<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaystackWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // Verify the webhook signature
        $secret    = config('services.paystack.secret_key');
        $signature = $request->header('X-Paystack-Signature');
        $computed  = hash_hmac('sha512', $request->getContent(), $secret);

        if (! hash_equals($computed, (string) $signature)) {
            Log::warning('Paystack webhook: invalid signature');
            return response('Forbidden', 403);
        }

        $event = $request->json('event');
        $data  = $request->json('data');

        if ($event !== 'charge.success') {
            return response('OK', 200);
        }

        $reference = $data['reference'] ?? null;
        if (! $reference) {
            return response('OK', 200);
        }

        return \Illuminate\Support\Facades\DB::transaction(function () use ($reference, $data) {
            $order = Order::where('order_number', $reference)->lockForUpdate()->first();

            if (! $order || $order->payment_status === 'paid') {
                return response('OK', 200);
            }

            $order->update([
                'payment_status'    => 'paid',
                'payment_reference' => $data['reference'],
                'status'            => 'processing',
            ]);

            // Save card token if available
            if ($order->user_id && ! empty($data['authorization']['reusable']) && $data['authorization']['reusable']) {
                $user = \App\Models\User::find($order->user_id);
                if ($user && ! $user->paystack_auth_code) {
                    $user->update([
                        'paystack_auth_code' => $data['authorization']['authorization_code'],
                        'card_last_four'     => $data['authorization']['last4'],
                        'card_brand'         => $data['authorization']['brand'],
                    ]);
                }
            }

            // Deduct stock
            foreach ($order->items as $item) {
                optional($item->variant)->decrement('stock_quantity', $item->quantity);
            }

            // Clear cart
            $cart = $order->user_id
                ? \App\Models\Cart::where('user_id', $order->user_id)->first()
                : null;

            if ($cart) {
                $cart->items()->delete();
            }

            Log::info("Paystack webhook: order {$order->order_number} marked paid via webhook");

            return response('OK', 200);
        });
    }
}
