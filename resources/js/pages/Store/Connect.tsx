import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Connect() {
    // Custom theme for the link-in-bio style page
    const C = {
        bg: '#f4efe8',
        text: '#2d3320',
        buttonBg: '#39422a',
        buttonText: '#f4efe8',
    };

    const socialLinks = [
        {
            name: 'FORMÉ Instagram',
            url: 'https://www.instagram.com/thisis__forme?stkn=cXN0M3FxMzR6bmFq&utm_source=qr',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            ),
        },
        {
            name: 'FORMÉ TikTok',
            url: 'https://www.tiktok.com/@thisis__forme?_r=1&_t=ZS-99muq41jeU8',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.86a6.32 6.32 0 0 0-1-.08A6.34 6.34 0 0 0 3 12a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.31 8.31 0 0 0 4.67 1.44V6.7a4.86 4.86 0 0 1-3.76-.01z" />
                </svg>
            ),
        },
        {
            name: 'FORMÉ X account',
            url: 'https://x.com/thisis__forme?s=21&t=Z6g7e-fMkC6dFLqG4HxwVw',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: 'Syne, sans-serif' }}>
            <Head title="Connect | Formé" />
            
            <div style={{ maxWidth: '480px', margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Brand Header */}
                <div style={{ marginBottom: '50px' }}>
                    <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', fontWeight: 600, letterSpacing: '4px', margin: '0 0 8px 0', color: C.text }}>
                        FORMÉ
                    </h1>
                    <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, color: C.text }}>
                        Move. Perform. Live.
                    </p>
                </div>

                {/* Main Heading */}
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', fontWeight: 500, margin: '0 0 12px 0', letterSpacing: '1px', color: C.text }}>
                    SPOTTED IN FORMÉ?
                </h2>
                <p style={{ fontSize: '15px', fontWeight: 400, margin: '0 0 40px 0', color: C.text }}>
                    Find us. Tag us. Show us how you wear yours.
                </p>

                {/* Social Links */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                    {socialLinks.map((link) => (
                        <a 
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                backgroundColor: C.buttonBg, 
                                color: C.buttonText, 
                                padding: '18px 24px',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                transition: 'transform 0.2s, opacity 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
                                    {link.icon}
                                </div>
                                <span style={{ fontSize: '15px', fontWeight: 500 }}>{link.name}</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    ))}
                </div>

                {/* Hashtag */}
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 600, margin: '0 0 40px 0', color: C.text }}>
                    #SpottedInFormé
                </p>

                {/* Continue Shopping Button */}
                <Link 
                    href="/shop"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        border: `1.5px solid ${C.text}`,
                        color: C.text,
                        padding: '14px 32px',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        transition: 'background-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.text; e.currentTarget.style.color = C.bg; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.text; }}
                >
                    Continue Shopping
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </Link>
                
            </div>
        </div>
    );
}
