import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';

interface CartItem {
    id: number;
    quantity: number;
    variant: { id: number; color: string | null; size: string | null; final_price: number; stock: number; };
    product: { name: string; slug: string; image: string | null; };
    line_total: number;
}

interface CartProps {
    cartItems: CartItem[];
    total: number;
    count: number;
}

export default function Cart({ cartItems: initialItems, total: initialTotal }: CartProps) {
    const [items, setItems] = useState(initialItems);

    const total = items.reduce((sum, i) => sum + i.variant.final_price * i.quantity, 0);

    const updateQty = async (item: CartItem, qty: number) => {
        if (qty < 1) return;
        if (qty > item.variant.stock) return;
        try {
            await axios.patch(`/cart/${item.id}`, { quantity: qty });
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: qty, line_total: i.variant.final_price * qty } : i));
        } catch {}
    };

    const removeItem = async (id: number) => {
        try {
            await axios.delete(`/cart/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch {}
    };

    return (
        <>
            <Head title="Your Bag" />

            <style>{`
                .cart-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: 64px;
                    align-items: start;
                }
                .cart-item-image {
                    width: 120px;
                    height: 160px;
                    flex-shrink: 0;
                    overflow: hidden;
                    border-radius: 2px;
                    background: #f5f0eb;
                    display: block;
                }
                @media (max-width: 900px) {
                    .cart-main-grid {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                    .cart-item-image {
                        width: 84px !important;
                        height: 112px !important;
                    }
                }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px 80px' }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400, color: '#1a1a1a', marginBottom: '32px' }}>Shopping Bag ({items.length})</h1>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#888', marginBottom: '8px' }}>Your bag is empty</p>
                        <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '32px' }}>Discover pieces made just for you.</p>
                        <Link href="/shop" style={{ background: '#1a1a1a', color: '#fff', padding: '14px 40px', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-block' }}>
                            Explore the Shop
                        </Link>
                    </div>
                ) : (
                    <div className="cart-main-grid">

                        {/* Cart items */}
                        <div>
                            {items.map((item) => (
                                <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '20px 0', borderBottom: '1px solid #EDE8DF' }}>
                                    {/* Image */}
                                    <Link href={`/products/${item.product.slug}`} className="cart-item-image">
                                        {item.product.image
                                            ? <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        }
                                    </Link>

                                    {/* Details */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <Link href={`/products/${item.product.slug}`} style={{ textDecoration: 'none' }}>
                                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#1a1a1a', lineHeight: 1.2 }}>{item.product.name}</p>
                                            </Link>
                                            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '18px', flexShrink: 0 }}>✕</button>
                                        </div>
                                        {(item.variant.color || item.variant.size) && (
                                            <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
                                                {[item.variant.color, item.variant.size].filter(Boolean).join(' / ')}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {/* Qty */}
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd' }}>
                                                <button onClick={() => updateQty(item, item.quantity - 1)} style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>−</button>
                                                <span style={{ width: '36px', textAlign: 'center', fontSize: '13px' }}>{item.quantity}</span>
                                                <button onClick={() => updateQty(item, item.quantity + 1)} style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>+</button>
                                            </div>
                                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#1a1a1a' }}>₦{(item.variant.final_price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order summary */}
                        <div style={{ position: 'sticky', top: '100px', background: '#faf7f2', padding: '32px', borderRadius: '4px' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '24px', color: '#1a1a1a' }}>Order Summary</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: '#555' }}>Subtotal</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a' }}>₦{total.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <span style={{ fontSize: '14px', color: '#555' }}>Shipping</span>
                                <span style={{ fontSize: '14px', color: total >= 50000 ? '#2d7a4f' : '#1a1a1a' }}>
                                    {total >= 50000 ? 'FREE' : '₦3,000'}
                                </span>
                            </div>
                            {total < 50000 && (
                                <p style={{ fontSize: '12px', color: '#8B1A2A', marginBottom: '16px', background: '#fdf0f2', padding: '10px', borderRadius: '4px' }}>
                                    Add ₦{(50000 - total).toLocaleString()} more for free shipping
                                </p>
                            )}

                            <div style={{ borderTop: '1px solid #EDE8DF', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#1a1a1a' }}>Total</span>
                                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#1a1a1a' }}>₦{(total + (total >= 50000 ? 0 : 3000)).toLocaleString()}</span>
                            </div>

                            <Link href="/checkout" style={{ display: 'block', background: '#8B1A2A', color: '#fff', textAlign: 'center', padding: '18px', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', transition: 'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#6e1522')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#8B1A2A')}>
                                Proceed to Checkout
                            </Link>
                            <Link href="/shop" style={{ display: 'block', border: '1px solid #1a1a1a', color: '#1a1a1a', textAlign: 'center', padding: '16px', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Continue Shopping
                            </Link>

                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                {['Paystack', 'Visa', 'Mastercard'].map(b => (
                                    <span key={b} style={{ fontSize: '10px', color: '#888', background: '#fff', border: '1px solid #ddd', padding: '4px 8px', borderRadius: '3px' }}>{b}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
