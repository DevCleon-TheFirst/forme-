import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    shipping_address: string | null;
    shipping_city: string | null;
    shipping_state: string | null;
}

interface AccountProps {
    user: User;
    flash?: { success?: string };
}

export default function Account({ user, flash }: AccountProps) {
    const [form, setForm] = useState({
        name: user.name,
        phone: user.phone ?? '',
        shipping_address: user.shipping_address ?? '',
        shipping_city: user.shipping_city ?? '',
        shipping_state: user.shipping_state ?? '',
    });
    const [saving, setSaving] = useState(false);

    const nigeriaStates = [
        'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
        'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano',
        'Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun',
        'Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
    ];

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px', border: '1px solid #ddd',
        background: '#fff', fontSize: '14px', color: '#1a1a1a', outline: 'none',
        borderRadius: '2px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
    };
    const labelStyle: React.CSSProperties = {
        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
        color: '#888', display: 'block', marginBottom: '6px',
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.patch('/account/profile', form, { onFinish: () => setSaving(false) });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="My Account" />

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px 80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B1A2A', marginBottom: '8px' }}>Welcome Back</p>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: 400, color: '#1a1a1a' }}>{user.name}</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'none', border: '1px solid #ddd', padding: '10px 24px', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', color: '#666' }}
                    >
                        Sign Out
                    </button>
                </div>

                {flash?.success && (
                    <div style={{ background: '#f0faf4', border: '1px solid #b7dfc5', padding: '14px 20px', borderRadius: '4px', marginBottom: '32px' }}>
                        <p style={{ color: '#2d7a4f', fontSize: '13px' }}>✓ {flash.success}</p>
                    </div>
                )}

                {/* Quick links */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
                    {[
                        { icon: '📦', label: 'My Orders', href: '/account/orders' },
                        { icon: '🛍️', label: 'Continue Shopping', href: '/shop' },
                        { icon: '❤️', label: 'New Arrivals', href: '/collections/new-arrivals' },
                    ].map(card => (
                        <Link key={card.href} href={card.href} style={{ textDecoration: 'none', background: '#faf7f2', border: '1px solid #EDE8DF', padding: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'background 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f5f0eb')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#faf7f2')}>
                            <span style={{ fontSize: '24px' }}>{card.icon}</span>
                            <span style={{ fontSize: '13px', color: '#1a1a1a', letterSpacing: '0.5px' }}>{card.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Profile form */}
                <div style={{ background: '#fff', border: '1px solid #EDE8DF', padding: '40px', borderRadius: '4px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', color: '#1a1a1a', marginBottom: '32px' }}>Profile & Shipping Details</p>

                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input type="email" value={user.email} disabled style={{ ...inputStyle, background: '#faf7f2', color: '#888', cursor: 'not-allowed' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={labelStyle}>Phone Number</label>
                            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234..." style={inputStyle} />
                        </div>

                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#1a1a1a', marginBottom: '20px' }}>Default Shipping Address</p>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Street Address</label>
                            <input type="text" value={form.shipping_address} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))} style={inputStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                            <div>
                                <label style={labelStyle}>City</label>
                                <input type="text" value={form.shipping_city} onChange={e => setForm(f => ({ ...f, shipping_city: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>State</label>
                                <select value={form.shipping_state} onChange={e => setForm(f => ({ ...f, shipping_state: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                                    <option value="">Select State</option>
                                    {nigeriaStates.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={saving}
                            style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px 40px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
