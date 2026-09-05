import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface RegisterProps {
    errors?: { name?: string; email?: string; password?: string };
}

export default function Register({ errors = {} }: RegisterProps) {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/register', form, {
            onFinish: () => setSubmitting(false),
        });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '14px 16px', border: '1px solid var(--forme-dim, #ddd)',
        background: 'var(--forme-surface, #fff)', fontSize: '14px', color: 'var(--forme-text, #1a1a1a)', outline: 'none',
        borderRadius: '2px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
        color: 'var(--forme-dim, #888)', display: 'block', marginBottom: '6px',
    };

    return (
        <>
            <Head title="Create Account" />

            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', letterSpacing: '4px', color: 'var(--forme-accent, #8B1A2A)', marginBottom: '24px', fontWeight: 600 }}>FORME</p>
                        </Link>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 400, color: 'var(--forme-text, #1a1a1a)', marginBottom: '8px' }}>Create Account</h1>
                        <p style={{ fontSize: '14px', color: 'var(--forme-dim, #888)' }}>Join the Forme community</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                style={{ ...inputStyle, borderColor: errors.name ? '#8B1A2A' : '#ddd' }}
                                required autoFocus
                            />
                            {errors.name && <p style={{ color: '#8B1A2A', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                style={{ ...inputStyle, borderColor: errors.email ? '#8B1A2A' : '#ddd' }}
                                required
                            />
                            {errors.email && <p style={{ color: '#8B1A2A', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                style={{ ...inputStyle, borderColor: errors.password ? '#8B1A2A' : '#ddd' }}
                                required
                            />
                            {errors.password && <p style={{ color: '#8B1A2A', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={labelStyle}>Confirm Password</label>
                            <input
                                type="password"
                                value={form.password_confirmation}
                                onChange={e => setForm(f => ({ ...f, password_confirmation: e.target.value }))}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '16px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, marginBottom: '16px', transition: 'opacity 0.2s' }}
                        >
                            {submitting ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--forme-dim, #888)' }}>Already have an account? </span>
                            <Link href="/login" style={{ fontSize: '13px', color: 'var(--forme-accent, #8B1A2A)', textDecoration: 'underline' }}>Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
