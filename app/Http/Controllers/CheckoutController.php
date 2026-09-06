<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    private function getCart(): Cart
    {
        if (auth()->check()) {
            return Cart::firstOrCreate(['user_id' => auth()->id()]);
        }
        return Cart::firstOrCreate(['session_id' => session()->getId()]);
    }

    public function show(): Response
    {
        $cart  = $this->getCart();
        $items = $cart->items()->with(['variant.product.images'])->get();

        if ($items->isEmpty()) {
            return redirect()->route('cart.show');
        }

        $subtotal    = $items->sum(fn ($i) => $i->variant->final_price * $i->quantity);
        $shippingFee = $subtotal >= 50000 ? 0 : 3000;

        $user = auth()->user();

        return Inertia::render('Store/Checkout', [
            'cartItems'   => $items->map(fn ($item) => [
                'product_name'        => $item->variant->product->name,
                'variant_description' => $item->variant->description,
                'quantity'            => $item->quantity,
                'unit_price'          => $item->variant->final_price,
                'image'               => $item->variant->product->images->first()
                    ? asset('storage/' . $item->variant->product->images->first()->image_path)
                    : null,
            ]),
            'subtotal'    => $subtotal,
            'shippingFee' => $shippingFee,
            'total'       => $subtotal + $shippingFee,
            'user'        => $user,
            // Pass saved card info so frontend can show "Pay with saved card" toggle
            'savedCard'   => $user && $user->paystack_auth_code ? [
                'last_four' => $user->card_last_four,
                'brand'     => $user->card_brand,
            ] : null,
        ]);
    }

    public function initiate(Request $request)
    {
        $request->validate([
            'customer_name'    => 'required|string',
            'customer_email'   => 'required|email',
            'customer_phone'   => 'nullable|string',
            'shipping_address' => 'required|string',
            'shipping_city'    => 'required|string',
            'shipping_state'   => 'required|string',
            'use_saved_card'   => 'nullable|boolean',
        ]);

        $cart  = $this->getCart();
        $items = $cart->items()->with(['variant.product'])->get();

        if ($items->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty']);
        }

        $subtotal    = $items->sum(fn ($i) => $i->variant->final_price * $i->quantity);
        $shippingFee = $subtotal >= 50000 ? 0 : 3000;
        $total       = $subtotal + $shippingFee;

        // ── Idempotency Check: Reuse recent unpaid pending order if duplicate request ──
        $existingOrder = Order::where('customer_email', $request->customer_email)
            ->where('payment_status', 'unpaid')
            ->where('total_amount', $total)
            ->where('created_at', '>=', now()->subMinutes(3))
            ->latest()
            ->first();

        if ($existingOrder) {
            $order = $existingOrder;
        } else {
            // Create order in pending state
            $order = Order::create([
                'order_number'     => Order::generateOrderNumber(),
                'user_id'          => auth()->id(),
                'status'           => 'pending',
                'payment_status'   => 'unpaid',
                'subtotal'         => $subtotal,
                'shipping_fee'     => $shippingFee,
                'total_amount'     => $total,
                'customer_name'    => $request->customer_name,
                'customer_email'   => $request->customer_email,
                'customer_phone'   => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'shipping_city'    => $request->shipping_city,
                'shipping_state'   => $request->shipping_state,
                'notes'            => $request->notes,
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id'            => $order->id,
                    'product_variant_id'  => $item->variant->id,
                    'product_name'        => $item->variant->product->name,
                    'variant_description' => $item->variant->description,
                    'quantity'            => $item->quantity,
                    'unit_price'          => $item->variant->final_price,
                    'total_price'         => $item->variant->final_price * $item->quantity,
                ]);
            }
        }

        $paystackKey = config('services.paystack.secret_key');

        // ── Pay with saved card (charge authorization) ──────────────────────
        $user = auth()->user();
        if ($request->boolean('use_saved_card') && $user && $user->paystack_auth_code) {
            $chargeResponse = Http::withToken($paystackKey)
                ->post('https://api.paystack.co/transaction/charge_authorization', [
                    'email'              => $request->customer_email,
                    'amount'             => (int) ($total * 100),
                    'currency'           => 'NGN',
                    'authorization_code' => $user->paystack_auth_code,
                    'reference'          => $order->order_number,
                    'metadata'           => $this->buildMetadata($order, $items),
                ]);

            if ($chargeResponse->successful() && $chargeResponse->json('data.status') === 'success') {
                return $this->markOrderPaid($order, $chargeResponse->json('data'));
            }

            // Charge failed — fall through to standard redirect checkout
            Log::warning('Saved-card charge failed for order ' . $order->order_number);
        }

        // ── Standard Paystack redirect checkout ─────────────────────────────
        $response = Http::withToken($paystackKey)
            ->post('https://api.paystack.co/transaction/initialize', [
                'email'        => $request->customer_email,
                'amount'       => (int) ($total * 100),
                'currency'     => 'NGN',
                'reference'    => $order->order_number,
                'channels'     => ['card', 'bank', 'bank_transfer', 'ussd', 'qr'],
                'metadata'     => $this->buildMetadata($order, $items),
                'callback_url' => route('checkout.callback'),
            ]);

        if (! $response->successful()) {
            $order->delete();
            return back()->withErrors(['payment' => 'Payment initialization failed. Please try again.']);
        }

        return Inertia::location($response->json('data.authorization_url'));
    }

    public function callback(Request $request)
    {
        $reference = $request->reference;
        if (! $reference) {
            return redirect()->route('home')->withErrors(['payment' => 'Invalid payment reference']);
        }

        $paystackKey = config('services.paystack.secret_key');
        $response    = Http::withToken($paystackKey)
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        if (! $response->successful()) {
            return redirect()->route('checkout.show')->withErrors(['payment' => 'Payment verification failed']);
        }

        $data  = $response->json('data');
        $order = Order::where('order_number', $reference)->first();

        if (! $order) {
            return redirect()->route('home');
        }

        if ($data['status'] === 'success') {
            return $this->markOrderPaid($order, $data);
        }

        return redirect()->route('checkout.show')->withErrors(['payment' => 'Payment was not completed']);
    }

    /**
     * Shared "mark order paid" logic, reused by callback & saved-card charge.
     */
    private function markOrderPaid(Order $order, array $paystackData)
    {
        if ($order->payment_status === 'paid') {
            // Already processed (e.g., webhook arrived first)
            return redirect()->route('order.confirmation', $order->order_number);
        }

        $order->update([
            'payment_status'    => 'paid',
            'payment_reference' => $paystackData['reference'],
            'status'            => 'processing',
        ]);

        // Save card token for future one-click checkout
        $user = auth()->user() ?? \App\Models\User::find($order->user_id);
        if ($user && ! empty($paystackData['authorization']['reusable'])
            && $paystackData['authorization']['reusable']) {
            $user->update([
                'paystack_auth_code' => $paystackData['authorization']['authorization_code'],
                'card_last_four'     => $paystackData['authorization']['last4'],
                'card_brand'         => $paystackData['authorization']['brand'],
            ]);
        }

        // Deduct stock
        foreach ($order->items as $item) {
            optional($item->variant)->decrement('stock_quantity', $item->quantity);
        }

        // Clear the cart
        $cart = $this->getCart();
        $cart->items()->delete();

        return redirect()->route('order.confirmation', $order->order_number);
    }

    /**
     * Build Paystack metadata with cart line items for display on Paystack page.
     */
    private function buildMetadata(Order $order, $items): array
    {
        $customFields = $items->map(fn ($item) => [
            'display_name' => $item->variant->product->name,
            'variable_name' => 'item_' . $item->variant->id,
            'value' => $item->variant->description
                ? $item->variant->description . ' × ' . $item->quantity
                : 'Qty: ' . $item->quantity,
        ])->toArray();

        return [
            'order_id'      => $order->id,
            'order_number'  => $order->order_number,
            'custom_fields' => $customFields,
        ];
    }

    public function confirmation(string $orderNumber): Response
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();

        return Inertia::render('Store/OrderConfirmation', [
            'order' => [
                'order_number'   => $order->order_number,
                'status'         => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount'   => $order->total_amount,
                'customer_name'  => $order->customer_name,
                'customer_email' => $order->customer_email,
                'shipping_city'  => $order->shipping_city,
                'shipping_state' => $order->shipping_state,
                'items'          => $order->items->map(fn ($i) => [
                    'product_name'        => $i->product_name,
                    'variant_description' => $i->variant_description,
                    'quantity'            => $i->quantity,
                    'unit_price'          => $i->unit_price,
                    'total_price'         => $i->total_price,
                ]),
            ],
        ]);
    }
}
