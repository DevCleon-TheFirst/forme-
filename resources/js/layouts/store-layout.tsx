import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import AppLogoIcon from '@/components/app-logo-icon';

interface CartItem {
    id: number;
    quantity: number;
    product: { name: string; slug: string; image: string | null };
    variant: { color: string | null; size: string | null; final_price: number };
    line_total: number;
}

interface StoreLayoutProps { children: React.ReactNode; }

const C = {
    bg: 'var(--forme-bg)',
    surface: 'var(--forme-surface)',
    border: 'var(--forme-border)',
    accent: 'var(--forme-accent)',
    accentLight: 'var(--forme-accent-light)',
    text: 'var(--forme-text)',
    muted: 'var(--forme-muted)',
    dim: 'var(--forme-dim)',
};

export default function StoreLayout({ children }: StoreLayoutProps) {
    const { url, props } = usePage();
    const storeSetting = props.store_setting as any;
    const [cartOpen, setCartOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const searchRef = useRef<HTMLInputElement>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const stored = localStorage.getItem('forme_theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('forme_theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const nav = [
        { label: 'Shop All', href: '/shop' },
        { label: 'Women', href: '/shop?gender=female' },
        { label: 'Men', href: '/shop?gender=male' },
        { label: 'Kids', href: '/shop?gender=kids' },
        { label: 'New Arrivals', href: '/collections/new-arrivals' },
        { label: 'Dresses', href: '/collections/dresses' },
        { label: 'Sets', href: '/collections/sets' },
        { label: 'Accessories', href: '/collections/accessories' },
    ];

    useEffect(() => { fetchCartCount(); }, [url]);
    useEffect(() => {
        const handleCartUpdate = (e: any) => {
            if (e.detail !== undefined) {
                setCartCount(e.detail);
            } else {
                fetchCartCount();
            }
        };
        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const fetchCartCount = async () => {
        try { const r = await axios.get('/cart/count'); setCartCount(r.data.count || 0); } catch {}
    };

    const openCart = async () => {
        try { const r = await axios.get('/cart?json=1'); setCartItems(r.data.cartItems || []); setCartTotal(r.data.total || 0); } catch {}
        setCartOpen(true);
    };

    const removeFromCart = async (id: number) => {
        await axios.delete(`/cart/${id}`);
        setCartItems(p => p.filter(i => i.id !== id));
        fetchCartCount();
    };

    useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);
    useEffect(() => {
        document.body.style.overflow = cartOpen || navOpen || searchOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [cartOpen, navOpen, searchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) { router.visit(`/shop?q=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery(''); }
    };

    const isActive = (href: string) => url.startsWith(href);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif", backgroundColor: C.bg, color: C.text, overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap');
                *{box-sizing:border-box;margin:0;padding:0;}
                @media(max-width:768px){
                    .hide-mob{display:none!important;}
                    .header-container{padding:0 16px!important;}
                    .brand-logo{font-size:20px!important;letter-spacing:4px!important;}
                }
                @media(min-width:769px){.show-mob{display:none!important;}}
                ::selection{background:${C.accent};color:#fff;}
                a{transition:color .2s;}
            `}</style>

            {/* Announcement */}
            {storeSetting?.announcement_is_active && storeSetting?.announcement_text && (
                <div style={{ background: C.accent, color: '#fff', fontSize: '11px', letterSpacing: '2px', textAlign: 'center', padding: '9px 16px', fontWeight: 500, textTransform: 'uppercase' }}>
                    {storeSetting.announcement_link ? (
                        <Link href={storeSetting.announcement_link} style={{ color: '#fff', textDecoration: 'none' }}>
                            {storeSetting.announcement_text}
                        </Link>
                    ) : (
                        <span>{storeSetting.announcement_text}</span>
                    )}
                </div>
            )}

            {/* Header */}
            <header style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="header-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
                    {/* Left: Logo and Nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="show-mob" onClick={() => setNavOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px', padding: '8px', minWidth: '44px', minHeight: '44px', justifyContent: 'center', alignItems: 'center' }} aria-label="Menu">
                            <span style={{ display: 'block', width: '22px', height: '1.5px', background: C.text }} />
                            <span style={{ display: 'block', width: '15px', height: '1.5px', background: C.muted }} />
                            <span style={{ display: 'block', width: '22px', height: '1.5px', background: C.text }} />
                        </button>
                        
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(139,26,42,0.25)' }}>
                                <AppLogoIcon style={{ width: '18px', height: '18px', color: '#ffffff', fill: 'currentColor' }} />
                            </div>
                            <span className="brand-logo" style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, letterSpacing: '4px', color: C.text, textTransform: 'uppercase' }}>FORME</span>
                        </Link>

                        <nav className="hide-mob" style={{ display: 'flex', gap: '28px' }}>
                            {nav.map(item => (
                                <Link key={item.href} href={item.href}
                                    style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: isActive(item.href) ? C.accent : C.text, textDecoration: 'none', fontWeight: 800, transition: 'color .2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                                    onMouseLeave={e => (e.currentTarget.style.color = isActive(item.href) ? C.accent : C.text)}>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color .2s' }} aria-label="Toggle Theme"
                            onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                            {theme === 'light' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            )}
                        </button>
                        <button onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color .2s' }} aria-label="Search"
                            onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        </button>
                        <Link href="/account" style={{ color: C.muted, minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color .2s' }} aria-label="Account"
                            onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </Link>
                        <button onClick={openCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, position: 'relative', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color .2s' }} aria-label="Cart"
                            onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            {cartCount > 0 && (
                                <span style={{ position: 'absolute', top: '2px', right: '2px', background: C.accent, color: '#fff', borderRadius: '50%', width: '17px', height: '17px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1 }}>{children}</main>

            {/* Footer */}
            <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '48px 20px 32px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '36px', marginBottom: '40px' }}>
                        <div>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, letterSpacing: '5px', color: C.text, marginBottom: '16px' }}>FORME</p>
                            <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.9' }}>Beautifully crafted pieces for the modern African wardrobe. Made with love in Lagos, Nigeria.</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '20px', color: C.accent, fontWeight: 600 }}>Shop</p>
                            {nav.map(n => (
                                <Link key={n.href} href={n.href} style={{ display: 'block', fontSize: '13px', color: C.muted, textDecoration: 'none', marginBottom: '12px' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{n.label}</Link>
                            ))}
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '20px', color: C.accent, fontWeight: 600 }}>Help</p>
                            {['FAQ', 'Shipping & Returns', 'Size Guide', 'Contact Us'].map(t => (
                                <p key={t} style={{ fontSize: '13px', color: C.muted, marginBottom: '12px', cursor: 'pointer' }}>{t}</p>
                            ))}
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '20px', color: C.accent, fontWeight: 600 }}>Connect</p>
                            <p style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>hello@forme.ng</p>
                            <p style={{ fontSize: '13px', color: C.muted, marginBottom: '16px' }}>WhatsApp: +234 708 470 4785</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['IG', 'TT', 'FB'].map(s => (
                                    <div key={s} style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: C.muted, cursor: 'pointer', transition: 'all .2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>{s}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <p style={{ fontSize: '12px', color: C.dim }}>© {new Date().getFullYear()} Forme. All rights reserved.</p>
                        <p style={{ fontSize: '12px', color: C.dim }}>Privacy Policy · Terms of Service</p>
                    </div>
                </div>
            </footer>

            {/* Backdrop */}
            {(cartOpen || navOpen || searchOpen) && (
                <div onClick={() => { setCartOpen(false); setNavOpen(false); setSearchOpen(false); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 199, backdropFilter: 'blur(4px)' }} />
            )}

            {/* Nav Drawer */}
            <div style={{ position: 'fixed', top: 0, left: 0, height: '100%', width: 'min(340px, 85vw)', background: C.surface, zIndex: 200, transform: navOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.5s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1))', overflowY: 'auto', padding: '32px 24px', borderRight: `1px solid ${C.border}` }}>
                <button onClick={() => setNavOpen(false)} style={{ position: 'absolute', top: '24px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: C.muted, minWidth: '40px', minHeight: '40px' }}>✕</button>
                <Link href="/" onClick={() => setNavOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AppLogoIcon style={{ width: '16px', height: '16px', color: '#ffffff', fill: 'currentColor' }} />
                    </div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, letterSpacing: '4px', color: C.text }}>FORME</span>
                </Link>
                {nav.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setNavOpen(false)}
                        style={{ display: 'block', fontFamily: "'Playfair Display', serif", fontSize: '24px', color: C.text, textDecoration: 'none', marginBottom: '18px', opacity: 0.85, transition: 'color .2s, opacity .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.opacity = '1'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.opacity = '0.85'; }}>
                        {item.label}
                    </Link>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '24px', marginTop: '12px' }}>
                    <Link href="/account" onClick={() => setNavOpen(false)} style={{ display: 'block', fontSize: '13px', color: C.muted, textDecoration: 'none', marginBottom: '14px' }}>My Account</Link>
                    <Link href="/account/orders" onClick={() => setNavOpen(false)} style={{ display: 'block', fontSize: '13px', color: C.muted, textDecoration: 'none' }}>My Orders</Link>
                </div>
            </div>

            {/* Cart Drawer */}
            <div style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 'min(400px, 100vw)', background: C.surface, zIndex: 200, transform: cartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.5s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1))', display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${C.border}` }}>
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: C.text }}>Your Bag ({cartCount})</p>
                    <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: C.muted }}>✕</button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: C.muted, marginBottom: '8px' }}>Your bag is empty</p>
                            <p style={{ fontSize: '12px', color: C.dim, marginBottom: '28px' }}>Discover something you'll love</p>
                            <button onClick={() => { setCartOpen(false); router.visit('/shop'); }} className="shimmer-button" style={{ background: C.accent, color: '#fff', border: 'none', padding: '14px 36px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}>
                                Shop Now
                            </button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '14px', padding: '18px 0', borderBottom: `1px solid ${C.border}` }}>
                                <div style={{ width: '72px', height: '92px', background: C.bg, flexShrink: 0, overflow: 'hidden', borderRadius: '2px' }}>
                                    {item.product.image && <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', color: C.text, marginBottom: '4px' }}>{item.product.name}</p>
                                    <p style={{ fontSize: '11px', color: C.muted, marginBottom: '8px' }}>{[item.variant.color, item.variant.size].filter(Boolean).join(' · ')}</p>
                                    <p style={{ fontSize: '13px', color: C.accent, fontWeight: 600 }}>₦{item.variant.final_price.toLocaleString()}</p>
                                    <p style={{ fontSize: '11px', color: C.dim, marginTop: '4px' }}>Qty: {item.quantity}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.dim, alignSelf: 'flex-start', fontSize: '15px', transition: 'color .2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = C.accent)} onMouseLeave={e => (e.currentTarget.style.color = C.dim)}>✕</button>
                            </div>
                        ))
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div style={{ padding: '24px 28px', borderTop: `1px solid ${C.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: C.text }}>Subtotal</span>
                            <span style={{ fontWeight: 600, color: C.text }}>₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: C.muted, marginBottom: '20px' }}>Shipping calculated at checkout</p>
                        <Link href="/checkout" onClick={() => setCartOpen(false)} className="shimmer-button" style={{ display: 'block', background: C.accent, color: '#fff', textAlign: 'center', padding: '16px', textDecoration: 'none', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 500 }}>
                            Checkout
                        </Link>
                        <Link href="/cart" onClick={() => setCartOpen(false)} style={{ display: 'block', border: `1px solid ${C.border}`, color: C.muted, textAlign: 'center', padding: '14px', textDecoration: 'none', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', transition: 'border-color .2s, color .2s' }}>
                            View Cart
                        </Link>
                    </div>
                )}
            </div>

            {/* Search */}
            {searchOpen && (
                <div style={{ position: 'fixed', inset: 0, background: C.bg, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <button onClick={() => setSearchOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: C.muted }}>✕</button>
                    <p style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: C.muted, marginBottom: '32px' }}>What are you looking for?</p>
                    <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '560px' }}>
                        <div style={{ display: 'flex', borderBottom: `2px solid ${C.accent}` }}>
                            <input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..."
                                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: "'Playfair Display', serif", fontSize: '28px', padding: '16px 0', color: C.text, caretColor: C.accent }} />
                            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '16px', color: C.accent }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
