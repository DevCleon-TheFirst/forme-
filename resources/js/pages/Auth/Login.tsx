import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface LoginProps {
    errors?: { email?: string; password?: string };
}

export default function Login({ errors = {} }: LoginProps) {
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/login', form, {
            onFinish: () => setSubmitting(false),
        });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '14px 16px', border: '1px solid var(--forme-dim, #ddd)',
        background: 'var(--forme-surface, #fff)', fontSize: '14px', color: 'var(--forme-text, #1a1a1a)', outline: 'none',
        borderRadius: '2px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
    };

    return (
        <>
            <Head title="Sign In" />

            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', letterSpacing: '4px', color: 'var(--forme-accent, #8B1A2A)', marginBottom: '24px', fontWeight: 600 }}>FORME</p>
                        </Link>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 400, color: 'var(--forme-text, #1a1a1a)', marginBottom: '8px' }}>Welcome Back</h1>
                        <p style={{ fontSize: '14px', color: 'var(--forme-dim, #888)' }}>Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--forme-dim, #888)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                style={{ ...inputStyle, borderColor: errors.email ? '#8B1A2A' : '#ddd' }}
                                required
                                autoFocus
                            />
                            {errors.email && <p style={{ color: '#8B1A2A', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--forme-dim, #888)', display: 'block', marginBottom: '6px' }}>Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                style={{ ...inputStyle, borderColor: errors.password ? '#8B1A2A' : '#ddd' }}
                                required
                            />
                            {errors.password && <p style={{ color: '#8B1A2A', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={form.remember}
                                    onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                                    style={{ accentColor: 'var(--forme-accent, #8B1A2A)', width: '14px', height: '14px' }}
                                />
                                <span style={{ fontSize: '13px', color: 'var(--forme-dim, #555)' }}>Remember me</span>
                            </label>
                            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--forme-accent, #8B1A2A)', textDecoration: 'underline' }}>
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '16px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, marginBottom: '16px', transition: 'opacity 0.2s' }}
                        >
                            {submitting ? 'Signing In...' : 'Sign In'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--forme-dim, #888)' }}>Don't have an account? </span>
                            <Link href="/register" style={{ fontSize: '13px', color: 'var(--forme-accent, #8B1A2A)', textDecoration: 'underline' }}>Create one</Link>
                        </div>
                    </form>

                    <div style={{ marginTop: '40px', padding: '20px', background: 'var(--forme-surface, #faf7f2)', borderRadius: '4px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--forme-dim, #888)', marginBottom: '8px' }}>Or continue as a guest</p>
                        <Link href="/checkout" style={{ fontSize: '13px', color: 'var(--forme-text, #1a1a1a)', textDecoration: 'underline' }}>Proceed to Checkout</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
