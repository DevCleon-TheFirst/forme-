import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface CartItem {
    product_name: string;
    variant_description: string | null;
    quantity: number;
    unit_price: number;
    image: string | null;
}

interface User {
    name: string;
    email: string;
    phone: string | null;
    shipping_address: string | null;
    shipping_city: string | null;
    shipping_state: string | null;
}

interface SavedCard {
    last_four: string;
    brand: string;
}

interface CheckoutProps {
    cartItems: CartItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    user: User | null;
    savedCard?: SavedCard | null;
}

export default function Checkout({ cartItems, subtotal, shippingFee, total, user, savedCard }: CheckoutProps) {
    const [form, setForm] = useState({
        customer_name: user?.name ?? '',
        customer_email: user?.email ?? '',
        customer_phone: user?.phone ?? '',
        shipping_address: user?.shipping_address ?? '',
        shipping_city: user?.shipping_city ?? '',
        shipping_state: user?.shipping_state ?? '',
        notes: '',
    });
    const [useSavedCard, setUseSavedCard] = useState(!!savedCard);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/checkout/initiate', { ...form, use_saved_card: useSavedCard }, {
            onError: (errs) => { setErrors(errs); setSubmitting(false); },
            onFinish: () => setSubmitting(false),
        });
    };

    const nigeriaStates = [
        'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
        'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano',
        'Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun',
        'Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setErrors(err => ({ ...err, [e.target.name]: '' }));
    };


    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px', border: '1px solid var(--forme-border)', background: 'var(--forme-bg)',
        fontSize: '16px', color: 'var(--forme-text)', outline: 'none', borderRadius: '2px',
        fontFamily: "'DM Sans', sans-serif",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--forme-muted)',
        display: 'block', marginBottom: '6px',
    };

    return (
        <>
            <Head title="Checkout" />
            <style>{`
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 64px;
                    align-items: start;
                }
                @media (max-width: 900px) {
                    .checkout-grid {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                }
            `}</style>

            {/* Breadcrumb */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--forme-border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--forme-muted)' }}>
                    <Link href="/cart" style={{ color: 'var(--forme-muted)', textDecoration: 'none' }}>Bag</Link>
                    <span>›</span>
                    <span style={{ color: 'var(--forme-accent)', fontWeight: 500 }}>Information</span>
                    <span>›</span>
                    <span>Payment</span>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>
                <div className="checkout-grid">

                    {/* ── Checkout form ─────────────────────────────────── */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--forme-text)', marginBottom: '24px' }}>Contact Information</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input name="customer_name" value={form.customer_name} onChange={handleChange} style={{ ...inputStyle, borderColor: errors.customer_name ? 'var(--forme-accent)' : 'var(--forme-border)' }} required />
                                    {errors.customer_name && <p style={{ color: 'var(--forme-accent)', fontSize: '12px', marginTop: '4px' }}>{errors.customer_name}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Email Address *</label>
                                    <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} style={{ ...inputStyle, borderColor: errors.customer_email ? 'var(--forme-accent)' : 'var(--forme-border)' }} required />
                                    {errors.customer_email && <p style={{ color: 'var(--forme-accent)', fontSize: '12px', marginTop: '4px' }}>{errors.customer_email}</p>}
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="+234..." style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--forme-text)', marginBottom: '24px' }}>Shipping Address</p>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>Street Address *</label>
                                <input name="shipping_address" value={form.shipping_address} onChange={handleChange} style={{ ...inputStyle, borderColor: errors.shipping_address ? 'var(--forme-accent)' : 'var(--forme-border)' }} required />
                                {errors.shipping_address && <p style={{ color: 'var(--forme-accent)', fontSize: '12px', marginTop: '4px' }}>{errors.shipping_address}</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={labelStyle}>City *</label>
                                    <input name="shipping_city" value={form.shipping_city} onChange={handleChange} style={{ ...inputStyle, borderColor: errors.shipping_city ? 'var(--forme-accent)' : 'var(--forme-border)' }} required />
                                    {errors.shipping_city && <p style={{ color: 'var(--forme-accent)', fontSize: '12px', marginTop: '4px' }}>{errors.shipping_city}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>State *</label>
                                    <select name="shipping_state" value={form.shipping_state} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }} required>
                                        <option value="">Select State</option>
                                        {nigeriaStates.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {errors.shipping_state && <p style={{ color: 'var(--forme-accent)', fontSize: '12px', marginTop: '4px' }}>{errors.shipping_state}</p>}
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Order Notes (Optional)</label>
                                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any special instructions..." style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Inter', sans-serif" }} />
                            </div>
                        </div>

                        {errors.payment && (
                            <div style={{ background: 'var(--forme-surface)', border: '1px solid var(--forme-accent)', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
                                <p style={{ color: 'var(--forme-accent)', fontSize: '13px' }}>{errors.payment}</p>
                            </div>
                        )}

                        {/* Saved card banner */}
                        {savedCard && (
                            <div style={{ background: 'var(--forme-surface)', border: '1px solid var(--forme-border)', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '20px' }}>💳</span>
                                        <div>
                                            <p style={{ fontSize: '13px', color: 'var(--forme-text)', fontWeight: 500, marginBottom: '2px' }}>
                                                {savedCard.brand?.toUpperCase()} ending in {savedCard.last_four}
                                            </p>
                                            <p style={{ fontSize: '12px', color: 'var(--forme-muted)' }}>Saved card • One-click checkout</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setUseSavedCard(v => !v)}
                                        style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 16px', border: '1px solid var(--forme-accent)', color: useSavedCard ? '#fff' : 'var(--forme-accent)', background: useSavedCard ? 'var(--forme-accent)' : 'transparent', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.2s' }}>
                                        {useSavedCard ? '✓ Use This Card' : 'Use Saved Card'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Payment note */}
                        <div style={{ background: 'var(--forme-surface)', padding: '16px', borderRadius: '4px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '18px', color: 'var(--forme-accent)', flexShrink: 0 }}>🔒</span>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--forme-text)', fontWeight: 500, marginBottom: '4px' }}>Secure Payment via Paystack</p>
                                <p style={{ fontSize: '12px', color: 'var(--forme-muted)' }}>You will be redirected to Paystack to complete your payment securely. We accept all major cards and bank transfers.</p>
                            </div>
                        </div>

                        <button type="submit" disabled={submitting}
                            style={{ width: '100%', background: 'var(--forme-accent)', color: '#fff', border: 'none', padding: '18px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                            {submitting ? 'Redirecting to Payment...' : `Pay ₦${total.toLocaleString()}`}
                        </button>
                    </form>

                    {/* ── Order summary sidebar ─────────────────────────── */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'var(--forme-text)', marginBottom: '24px' }}>Order Summary</p>

                        <div style={{ marginBottom: '24px' }}>
                            {cartItems.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--forme-border)' }}>
                                    <div style={{ width: '60px', height: '80px', background: 'var(--forme-surface)', flexShrink: 0, borderRadius: '2px', overflow: 'hidden' }}>
                                        {item.image ? <img src={item.image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '14px', color: 'var(--forme-text)', marginBottom: '4px' }}>{item.product_name}</p>
                                        {item.variant_description && <p style={{ fontSize: '12px', color: 'var(--forme-muted)', marginBottom: '4px' }}>{item.variant_description}</p>}
                                        <p style={{ fontSize: '12px', color: 'var(--forme-muted)' }}>Qty: {item.quantity}</p>
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--forme-text)', fontWeight: 500 }}>₦{(item.unit_price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: 'var(--forme-surface)', padding: '20px', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--forme-muted)' }}>Subtotal</span>
                                <span style={{ fontSize: '13px', color: 'var(--forme-text)' }}>₦{subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--forme-muted)' }}>Shipping</span>
                                <span style={{ fontSize: '13px', color: shippingFee === 0 ? 'var(--forme-accent-light)' : 'var(--forme-text)' }}>{shippingFee === 0 ? 'FREE' : `₦${shippingFee.toLocaleString()}`}</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--forme-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: 'var(--forme-text)' }}>Total</span>
                                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: 'var(--forme-accent)' }}>₦{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
