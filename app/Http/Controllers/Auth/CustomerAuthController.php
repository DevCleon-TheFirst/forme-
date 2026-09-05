<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class CustomerAuthController extends Controller
{
    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'customer',
        ]);

        Auth::login($user);

        return redirect()->intended(route('home'));
    }

    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('home'));
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }

    public function account(): Response
    {
        return Inertia::render('Auth/Account', [
            'user' => auth()->user(),
        ]);
    }

    public function orders(): Response
    {
        $orders = Order::where('user_id', auth()->id())
            ->with('items')
            ->latest()
            ->get()
            ->map(fn ($o) => [
                'id'             => $o->id,
                'order_number'   => $o->order_number,
                'status'         => $o->status,
                'payment_status' => $o->payment_status,
                'total_amount'   => $o->total_amount,
                'items_count'    => $o->items->count(),
                'created_at'     => $o->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Auth/Orders', ['orders' => $orders]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:255',
            'phone'            => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'shipping_city'    => 'nullable|string',
            'shipping_state'   => 'nullable|string',
        ]);

        auth()->user()->update($request->only([
            'name', 'phone', 'shipping_address', 'shipping_city', 'shipping_state',
        ]));

        return back()->with('success', 'Profile updated successfully.');
    }
}
