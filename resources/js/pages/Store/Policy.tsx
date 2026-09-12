import { Head } from '@inertiajs/react';

const C = {
    bg: 'var(--forme-bg)',
    surface: 'var(--forme-surface)',
    border: 'var(--forme-border)',
    accent: 'var(--forme-accent)',
    text: 'var(--forme-text)',
    muted: 'var(--forme-muted)',
    dim: 'var(--forme-dim)',
};

const sections = [
    {
        id: 'shipping',
        title: 'Shipping & Delivery Policy',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
        ),
        items: [
            {
                title: 'Processing Time',
                body: 'Orders take 1–2 business days to process before dispatch. Orders placed on weekends or public holidays will begin processing the next business day.',
            },
            {
                title: 'Delivery Timelines',
                body: 'Local deliveries within Lagos take 2–5 business days. National shipping to other states across Nigeria takes 3–7 business days, depending on your location.',
            },
            {
                title: 'Shipping Rates',
                body: 'Shipping fees are calculated at checkout based on your delivery location and the weight of your order. You will see the exact cost before completing payment.',
            },
        ],
    },
    {
        id: 'returns',
        title: 'Returns, Refunds & Cancellations',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.18"/>
            </svg>
        ),
        items: [
            {
                title: 'Returns & Exchanges',
                body: 'We accept returns or exchanges for unused items in their original condition with tags still attached, within 3 days of delivery. Items that show signs of wear, washing, or damage will not be accepted.',
            },
            {
                title: 'Cancellations',
                body: 'Orders can be canceled or modified within 2 hours of payment by reaching out to our support team via WhatsApp or email. Once an order has been dispatched, it can no longer be canceled.',
            },
            {
                title: 'Delivery & Exchange Costs',
                body: 'If an error occurs on our end, we will take full responsibility for any necessary delivery or return costs. Customers are responsible for any additional delivery costs resulting from an incorrect or incomplete delivery address provided at the time of ordering.',
            },
            {
                title: 'Our Commitment',
                body: 'We will always do our best to resolve genuine issues fairly and promptly. If you have any concerns, please do not hesitate to contact our support team — we are here to help.',
            },
        ],
    },
];

export default function Policy() {
    return (
        <div style={{ background: C.bg, minHeight: '100vh' }}>
            <Head title="Shipping & Policy — Formé" />

            {/* Hero Banner */}
            <div style={{
                background: C.surface,
                borderBottom: `1px solid ${C.border}`,
                padding: '72px 24px 56px',
                textAlign: 'center',
            }}>
                <p style={{
                    fontSize: '10px',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    color: C.accent,
                    fontWeight: 600,
                    marginBottom: '16px',
                }}>Our Commitment</p>
                <h1 style={{
                    fontSize: 'clamp(28px, 5vw, 48px)',
                    fontWeight: 300,
                    letterSpacing: '2px',
                    color: C.text,
                    marginBottom: '16px',
                    fontFamily: "'Cormorant Garamond', serif",
                }}>Shipping &amp; Policy</h1>
                <p style={{
                    fontSize: '14px',
                    color: C.muted,
                    maxWidth: '520px',
                    margin: '0 auto',
                    lineHeight: '1.8',
                }}>
                    Everything you need to know about how we deliver your order and how we handle returns, refunds, and cancellations.
                </p>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px 80px' }}>
                {sections.map((section, si) => (
                    <div key={section.id} style={{ marginBottom: si < sections.length - 1 ? '64px' : 0 }}>
                        {/* Section Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            marginBottom: '32px',
                            paddingBottom: '20px',
                            borderBottom: `1px solid ${C.border}`,
                        }}>
                            <div style={{ color: C.accent }}>{section.icon}</div>
                            <h2 style={{
                                fontSize: 'clamp(18px, 3vw, 24px)',
                                fontWeight: 400,
                                letterSpacing: '1px',
                                color: C.text,
                                fontFamily: "'Cormorant Garamond', serif",
                                margin: 0,
                            }}>{section.title}</h2>
                        </div>

                        {/* Policy Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {section.items.map((item) => (
                                <div key={item.title} style={{
                                    background: C.surface,
                                    border: `1px solid ${C.border}`,
                                    borderRadius: '4px',
                                    padding: '24px 28px',
                                    display: 'flex',
                                    gap: '20px',
                                }}>
                                    <div style={{
                                        width: '3px',
                                        borderRadius: '2px',
                                        background: C.accent,
                                        flexShrink: 0,
                                        alignSelf: 'stretch',
                                    }} />
                                    <div>
                                        <p style={{
                                            fontSize: '11px',
                                            letterSpacing: '2px',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            color: C.accent,
                                            marginBottom: '10px',
                                        }}>{item.title}</p>
                                        <p style={{
                                            fontSize: '14px',
                                            color: C.muted,
                                            lineHeight: '1.85',
                                            margin: 0,
                                        }}>{item.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Contact CTA */}
                <div style={{
                    marginTop: '60px',
                    padding: '36px 32px',
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: '4px',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontSize: '11px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: C.accent,
                        fontWeight: 600,
                        marginBottom: '12px',
                    }}>Still Have Questions?</p>
                    <p style={{
                        fontSize: '15px',
                        color: C.muted,
                        marginBottom: '24px',
                        lineHeight: '1.7',
                    }}>Our support team is always happy to help. Reach out and we will get back to you as quickly as possible.</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="mailto:hello@forme.ng"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 28px',
                                background: C.accent,
                                color: '#fff',
                                fontSize: '11px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                textDecoration: 'none',
                                borderRadius: '2px',
                                transition: 'opacity .2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            Email Us
                        </a>
                        <a
                            href="https://wa.me/2347084704785"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 28px',
                                background: 'transparent',
                                color: C.accent,
                                border: `1px solid ${C.accent}`,
                                fontSize: '11px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                textDecoration: 'none',
                                borderRadius: '2px',
                                transition: 'all .2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.accent; }}
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
