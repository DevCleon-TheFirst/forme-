<?php

use App\Http\Controllers\Auth\CustomerAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PaystackWebhookController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

// ─── Store Front (Rate Limited: Max 60 req/min) ────────────────────────────────
Route::middleware('throttle:storefront')->group(function () {
    Route::get('/', [StoreController::class, 'home'])->name('home');
    Route::get('/shop', [StoreController::class, 'collection'])->name('shop');
    Route::get('/collections/{slug}', [StoreController::class, 'collection'])->name('collection');
    Route::get('/products/{slug}', [StoreController::class, 'product'])->name('product');
    Route::get('/policy', [StoreController::class, 'policy'])->name('policy');
});

// ─── Cart (Rate Limited: Max 30 req/min) ──────────────────────────────────────
Route::middleware('throttle:30,1')->group(function () {
    Route::get('/cart', [CartController::class, 'show'])->name('cart.show');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');
});

// ─── Checkout & Paystack (Rate Limited) ───────────────────────────────────────
Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout/initiate', [CheckoutController::class, 'initiate'])
    ->middleware('throttle:checkout')
    ->name('checkout.initiate');
Route::get('/checkout/callback', [CheckoutController::class, 'callback'])->name('checkout.callback');
Route::get('/order/{orderNumber}/confirmation', [CheckoutController::class, 'confirmation'])->name('order.confirmation');

// ─── Paystack Webhook (Rate Limited: Max 60 req/min, CSRF-exempt) ────────────
Route::post('/webhooks/paystack', [PaystackWebhookController::class, 'handle'])
    ->middleware('throttle:60,1')
    ->name('webhook.paystack')
    ->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

// ─── Customer Auth (Rate Limited: Max 6 req/min) ──────────────────────────────
Route::middleware(['guest', 'throttle:auth'])->group(function () {
    Route::get('/register', [CustomerAuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [CustomerAuthController::class, 'register']);
    Route::get('/login', [CustomerAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [CustomerAuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [CustomerAuthController::class, 'logout'])->name('logout');
    Route::get('/account', [CustomerAuthController::class, 'account'])->name('account');
    Route::get('/account/orders', [CustomerAuthController::class, 'orders'])->name('account.orders');
    Route::patch('/account/profile', [CustomerAuthController::class, 'updateProfile'])->name('account.update');
});

require __DIR__ . '/settings.php';
