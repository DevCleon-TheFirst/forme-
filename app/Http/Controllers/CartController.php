<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    private function getCart(): Cart
    {
        if (auth()->check()) {
            return Cart::firstOrCreate(['user_id' => auth()->id()]);
        }

        $sessionId = session()->getId();
        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    public function show(Request $request)
    {
        $cart  = $this->getCart();
        $items = $cart->items()->with(['variant.product.images'])->get();

        $data = [
            'cartItems' => $items->map(fn ($item) => [
                'id'          => $item->id,
                'quantity'    => $item->quantity,
                'variant'     => [
                    'id'          => $item->variant->id,
                    'color'       => $item->variant->color,
                    'color_hex'   => $item->variant->color_hex,
                    'size'        => $item->variant->size,
                    'final_price' => $item->variant->final_price,
                    'stock'       => $item->variant->stock_quantity,
                ],
                'product'     => [
                    'name'  => $item->variant->product->name,
                    'slug'  => $item->variant->product->slug,
                    'image' => $item->variant->product->images->first()
                        ? asset('storage/'.$item->variant->product->images->first()->image_path)
                        : null,
                ],
                'line_total'  => $item->variant->final_price * $item->quantity,
            ]),
            'total'     => $cart->total,
            'count'     => $cart->count,
        ];

        if ($request->has('json')) {
            return response()->json($data);
        }

        return Inertia::render('Store/Cart', $data);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'variant_id' => 'required|exists:product_variants,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $variant = ProductVariant::findOrFail($request->variant_id);

        if ($variant->stock_quantity < $request->quantity) {
            return response()->json(['error' => 'Not enough stock'], 422);
        }

        $cart = $this->getCart();
        $item = $cart->items()->where('product_variant_id', $variant->id)->first();

        if ($item) {
            $newQty = $item->quantity + $request->quantity;
            if ($newQty > $variant->stock_quantity) {
                return response()->json(['error' => 'Not enough stock'], 422);
            }
            $item->update(['quantity' => $newQty]);
        } else {
            $cart->items()->create([
                'product_variant_id' => $variant->id,
                'quantity'           => $request->quantity,
            ]);
        }

        return response()->json(['count' => $cart->fresh()->count, 'message' => 'Added to cart']);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        if ($request->quantity > $cartItem->variant->stock_quantity) {
            return response()->json(['error' => 'Not enough stock'], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Updated']);
    }

    public function destroy(CartItem $cartItem): JsonResponse
    {
        $cartItem->delete();
        return response()->json(['message' => 'Removed']);
    }

    public function count(): JsonResponse
    {
        $cart = $this->getCart();
        return response()->json(['count' => $cart->count]);
    }
}
