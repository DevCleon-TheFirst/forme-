import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface OrderItem {
    product_name: string;
    variant_description: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Order {
    order_number: string;
    status: string;
    payment_status: string;
    total_amount: number;
    customer_name: string;
    customer_email: string;
    shipping_city: string;
    shipping_state: string;
    items: OrderItem[];
}

export default function OrderConfirmation({ order }: { order: Order }) {
    return (
        <>
            <Head title="Order Confirmed" />

            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px 80px', textAlign: 'center' }}>

                {/* Success icon */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(45, 122, 79, 0.1)', border: '2px solid #2d7a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>

                <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--forme-accent)', marginBottom: '12px' }}>Thank You</p>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', fontWeight: 400, color: 'var(--forme-text)', marginBottom: '16px' }}>Order Confirmed!</h1>
                <p style={{ fontSize: '14px', color: 'var(--forme-muted)', lineHeight: '1.8', marginBottom: '8px' }}>
                    Hi <strong style={{ color: 'var(--forme-text)' }}>{order.customer_name}</strong>, your order has been placed successfully.
                </p>
                <p style={{ fontSize: '14px', color: 'var(--forme-muted)', lineHeight: '1.8', marginBottom: '40px' }}>
                    A confirmation email has been sent to <strong style={{ color: 'var(--forme-text)' }}>{order.customer_email}</strong>
                </p>

                {/* Order reference */}
                <div style={{ background: 'var(--forme-surface)', border: '1px solid var(--forme-border)', padding: '24px', borderRadius: '4px', marginBottom: '40px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--forme-muted)', marginBottom: '8px' }}>Order Reference</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: 'var(--forme-text)', letterSpacing: '2px' }}>{order.order_number}</p>
                </div>

                {/* Order items */}
                <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'var(--forme-text)', marginBottom: '16px' }}>Your Items</p>
                    {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--forme-border)' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--forme-text)' }}>{item.product_name} × {item.quantity}</p>
                                {item.variant_description && <p style={{ fontSize: '12px', color: 'var(--forme-muted)', marginTop: '2px' }}>{item.variant_description}</p>}
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--forme-text)', fontWeight: 500 }}>₦{Number(item.total_price).toLocaleString()}</p>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: '8px' }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: 'var(--forme-text)' }}>Total Paid</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: 'var(--forme-accent)' }}>₦{Number(order.total_amount).toLocaleString()}</span>
                    </div>
                </div>

                {/* Delivery info */}
                <div style={{ background: 'var(--forme-surface)', padding: '20px', borderRadius: '4px', textAlign: 'left', marginBottom: '40px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--forme-muted)', marginBottom: '12px' }}>Delivery To</p>
                    <p style={{ fontSize: '14px', color: 'var(--forme-text)' }}>{order.shipping_city}, {order.shipping_state}</p>
                    <p style={{ fontSize: '12px', color: 'var(--forme-muted)', marginTop: '8px' }}>Estimated delivery: 2-7 business days</p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/account/orders" style={{ background: 'var(--forme-text)', color: 'var(--forme-bg)', padding: '14px 32px', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Track Order
                    </Link>
                    <Link href="/shop" style={{ border: '1px solid var(--forme-text)', color: 'var(--forme-text)', padding: '14px 32px', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </>
    );
}
