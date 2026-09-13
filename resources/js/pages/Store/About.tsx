import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ScrollReveal from '@/components/ScrollReveal';

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

export default function About() {
    return (
        <>
            <Head title="About Formé — Made for Every Form of Movement" />

            <div style={{ background: C.bg, color: C.text, minHeight: '100vh', paddingBottom: '80px' }}>
                {/* Hero Header */}
                <section style={{
                    position: 'relative',
                    padding: '110px 24px 90px',
                    textAlign: 'center',
                    background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`,
                    borderBottom: `1px solid ${C.border}`,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '700px',
                        height: '700px',
                        background: `radial-gradient(circle, ${C.accent}25 0%, transparent 70%)`,
                        pointerEvents: 'none',
                        borderRadius: '50%'
                    }} />

                    <ScrollReveal animation="fade-down">
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            border: `1.5px solid ${C.accentLight || C.accent}`,
                            background: `${C.accent}18`,
                            color: C.accentLight || C.accent,
                            fontSize: '12px',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            marginBottom: '28px'
                        }}>
                            <span>✦</span> ABOUT FORMÉ
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={100}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(40px, 6vw, 72px)',
                            fontWeight: 600,
                            lineHeight: 1.15,
                            letterSpacing: '-0.02em',
                            maxWidth: '960px',
                            margin: '0 auto 24px',
                            color: C.text
                        }}>
                            Made for every form of movement.
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={200}>
                        <p style={{
                            fontSize: 'clamp(18px, 2.5vw, 26px)',
                            color: C.accentLight || C.accent,
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                            maxWidth: '720px',
                            margin: '0 auto',
                            fontWeight: 600
                        }}>
                            Why should living an active life cost so much?
                        </p>
                    </ScrollReveal>
                </section>

                <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 24px' }}>

                    {/* Main Story Section */}
                    <section style={{ padding: '90px 0 70px', borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
                            <ScrollReveal animation="fade-right">
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        aspectRatio: '4/5',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        border: `1.5px solid ${C.border}`,
                                        background: C.surface
                                    }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85"
                                            alt="Movement for everyone"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-24px',
                                        right: '-24px',
                                        background: C.surface,
                                        border: `2px solid ${C.accent}`,
                                        padding: '24px 28px',
                                        borderRadius: '6px',
                                        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                                        maxWidth: '300px'
                                    }}>
                                        <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: C.accentLight || C.accent, fontWeight: 800 }}>Our Belief</p>
                                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: C.text, marginTop: '6px', fontWeight: 600, lineHeight: '1.3' }}>Affordable should never mean forgettable.</p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <div>
                                <ScrollReveal animation="fade-up">
                                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: C.text, marginBottom: '22px', fontWeight: 500 }}>
                                        Movement is part of taking care of ourselves. It might be an early-morning workout, an evening tennis match, a round of golf, a long walk, playing your favourite sport, or simply choosing to move a little more every day.
                                    </p>
                                </ScrollReveal>
                                <ScrollReveal animation="fade-up" delay={100}>
                                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: C.text, marginBottom: '22px', fontWeight: 500 }}>
                                        But when we went looking for beautiful, well-made activewear to live that lifestyle in, we kept finding the same thing: prices that made something so everyday feel unnecessarily exclusive.
                                    </p>
                                </ScrollReveal>
                                <ScrollReveal animation="fade-up" delay={200}>
                                    <p style={{ fontSize: '22px', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: C.accentLight || C.accent, marginBottom: '22px', fontWeight: 600 }}>
                                        And that didn’t make sense to us.
                                    </p>
                                </ScrollReveal>
                                <ScrollReveal animation="fade-up" delay={300}>
                                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: C.text, marginBottom: '22px', fontWeight: 500 }}>
                                        If movement is part of your lifestyle, your active wardrobe shouldn’t have to consist of one or two pieces you’re afraid to replace. You should be able to build a wardrobe you genuinely love — pieces you can train in, play in, travel in and live in, without feeling like every purchase has to break the bank.
                                    </p>
                                </ScrollReveal>
                                <ScrollReveal animation="fade-up" delay={400}>
                                    <p style={{ fontSize: '20px', fontWeight: 700, color: C.text, marginTop: '32px', borderLeft: `4px solid ${C.accent}`, paddingLeft: '20px', lineHeight: '1.4' }}>
                                        That is why we created FORMÉ.
                                    </p>
                                </ScrollReveal>
                            </div>
                        </div>
                    </section>

                    {/* 5 Core Pillars Grid */}
                    <section style={{ padding: '70px 0', borderBottom: `1px solid ${C.border}` }}>
                        <ScrollReveal animation="fade-up">
                            <p style={{ textAlign: 'center', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: C.accentLight || C.accent, fontWeight: 800, marginBottom: '14px' }}>
                                OUR FOUNDATION
                            </p>
                            <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: '36px', color: C.text, marginBottom: '52px', fontWeight: 600 }}>
                                What Should Never Be Separated
                            </h2>
                        </ScrollReveal>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '24px' }}>
                            {[
                                { title: 'Beautiful Design', desc: 'Elevated aesthetics crafted for elegance on and off the court.' },
                                { title: 'Quality', desc: 'Considered fabrics built to endure active lifestyles.' },
                                { title: 'Function', desc: 'Uncompromised performance designed to move with your body.' },
                                { title: 'Inclusivity', desc: 'Activewear made for every body, age, and coverage preference.' },
                                { title: 'Attainable Pricing', desc: 'Fair luxury pricing that empowers you to build a full active wardrobe.' },
                            ].map((pillar, i) => (
                                <ScrollReveal key={pillar.title} animation="fade-up" delay={i * 100}>
                                    <div style={{
                                        background: C.surface,
                                        border: `1px solid ${C.border}`,
                                        padding: '32px 24px',
                                        borderRadius: '6px',
                                        height: '100%',
                                        transition: 'transform 0.3s ease, border-color 0.3s ease',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <span style={{ fontSize: '14px', color: C.accentLight || C.accent, fontWeight: 800, display: 'block', marginBottom: '10px' }}>0{i + 1}</span>
                                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: C.text, marginBottom: '12px', fontWeight: 700 }}>{pillar.title}</h3>
                                        <p style={{ fontSize: '15px', color: C.text, lineHeight: '1.6', fontWeight: 500, opacity: 0.9 }}>{pillar.desc}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>

                    {/* WHY FORMÉ? Section */}
                    <section style={{ padding: '90px 0', borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
                            <div>
                                <ScrollReveal animation="fade-right">
                                    <div style={{ display: 'inline-block', padding: '6px 14px', background: `${C.accent}20`, color: C.accentLight || C.accent, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 800, borderRadius: '4px', marginBottom: '20px' }}>
                                        THE MEANING
                                    </div>
                                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', color: C.text, marginBottom: '28px', fontWeight: 600 }}>
                                        WHY FORMÉ?
                                    </h2>
                                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: C.text, marginBottom: '22px', fontWeight: 500 }}>
                                        Our name is inspired by the French word <em>forme</em>, meaning form or shape, and a word closely connected in French with being fit and well.
                                    </p>
                                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: C.text, marginBottom: '32px', fontWeight: 500 }}>
                                        That meaning felt deeply connected to everything we wanted the brand to represent.
                                    </p>
                                </ScrollReveal>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                    {[
                                        'Your form is your shape.',
                                        'Your form is how you move.',
                                        'Your form is how you show up.',
                                    ].map((statement, idx) => (
                                        <ScrollReveal key={statement} animation="fade-up" delay={idx * 100}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: C.surface, padding: '18px 24px', borderRadius: '6px', border: `1px solid ${C.border}` }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.accentLight || C.accent, flexShrink: 0 }} />
                                                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', color: C.text, fontWeight: 600 }}>{statement}</p>
                                            </div>
                                        </ScrollReveal>
                                    ))}
                                </div>

                                <ScrollReveal animation="fade-up" delay={300}>
                                    <p style={{ fontSize: '17px', lineHeight: '1.8', color: C.text, marginBottom: '18px', fontWeight: 500 }}>
                                        But to us, FORMÉ goes beyond the physical. We’re all constantly forming: our habits, our confidence, our routines, our lifestyles and the people we’re becoming.
                                    </p>
                                    <p style={{ fontSize: '17px', lineHeight: '1.8', color: C.text, fontWeight: 500 }}>
                                        The accent on the <strong style={{ color: C.accentLight || C.accent }}>É</strong> gives FORMÉ its own distinctive identity, while keeping form at the heart of our name and everything we create. It’s about showing up in your form, wherever you are in your journey.
                                    </p>
                                </ScrollReveal>
                            </div>

                            <ScrollReveal animation="fade-left">
                                <div style={{
                                    background: C.surface,
                                    border: `2px solid ${C.accent}`,
                                    padding: '48px 36px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '84px', color: C.accentLight || C.accent, display: 'block', lineHeight: 1, marginBottom: '16px', fontWeight: 700 }}>É</span>
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: C.text, marginBottom: '20px', fontWeight: 600 }}>Constantly Forming</h3>
                                    <p style={{ fontSize: '16px', color: C.text, lineHeight: '1.8', fontWeight: 500 }}>
                                        "FORMÉ isn’t about achieving one 'perfect' body or fitting into one definition of what being fit should look like. It’s about showing up in your form, wherever you are."
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </section>

                    {/* MORE THAN ACTIVEWEAR Section */}
                    <section style={{ padding: '90px 0 70px' }}>
                        <ScrollReveal animation="fade-up">
                            <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 56px' }}>
                                <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: C.accentLight || C.accent, fontWeight: 800, marginBottom: '14px' }}>
                                    BUILT FOR LIFE
                                </p>
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', color: C.text, marginBottom: '20px', fontWeight: 600 }}>
                                    MORE THAN ACTIVEWEAR.
                                </h2>
                                <p style={{ fontSize: '18px', color: C.text, lineHeight: '1.7', fontWeight: 500 }}>
                                    FORMÉ was created for movement, but designed for life.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Audience Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '24px', marginBottom: '56px' }}>
                            {[
                                { title: 'For Women', detail: 'Elevated, high-support & chic silhouettes for every active routine.' },
                                { title: 'For Men', detail: 'Engineered performance & breathable everyday athletic essentials.' },
                                { title: 'For Children', detail: 'Durable, comfortable sportswear crafted for young active movers.' },
                                { title: 'Modest Coverage', detail: 'Considered, elegant designs for those who prefer full coverage.' },
                                { title: 'All Fitness Levels', detail: 'From seasoned athletes to taking your very first step.' },
                            ].map((item, idx) => (
                                <ScrollReveal key={item.title} animation="fade-up" delay={idx * 80}>
                                    <div style={{
                                        background: C.surface,
                                        border: `1px solid ${C.border}`,
                                        padding: '28px',
                                        borderRadius: '6px',
                                        textAlign: 'left'
                                    }}>
                                        <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: C.accentLight || C.accent, fontWeight: 800, marginBottom: '10px' }}>INCLUSIVE</p>
                                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: C.text, marginBottom: '10px', fontWeight: 600 }}>{item.title}</h3>
                                        <p style={{ fontSize: '15px', color: C.text, lineHeight: '1.6', fontWeight: 500, opacity: 0.9 }}>{item.detail}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        <ScrollReveal animation="fade-up">
                            <div style={{
                                background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
                                border: `2px solid ${C.accent}`,
                                padding: '56px 36px',
                                borderRadius: '10px',
                                textAlign: 'center',
                                maxWidth: '840px',
                                margin: '0 auto'
                            }}>
                                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: C.text, lineHeight: '1.6', marginBottom: '28px', fontWeight: 500 }}>
                                    "Because there isn’t one way to move, and there isn’t one body that movement belongs to. From training to court. From sport to everyday life."
                                </p>
                                <p style={{ fontSize: '17px', color: C.text, marginBottom: '40px', maxWidth: '640px', margin: '0 auto 40px', lineHeight: '1.7', fontWeight: 500 }}>
                                    We want to create beautiful, functional pieces that allow more people to move comfortably, confidently and in their own form, without luxury having to mean inaccessible.
                                </p>

                                <div style={{
                                    display: 'inline-block',
                                    borderTop: `2px solid ${C.accentLight || C.accent}`,
                                    borderBottom: `2px solid ${C.accentLight || C.accent}`,
                                    padding: '20px 40px',
                                    marginBottom: '36px'
                                }}>
                                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)', color: C.text, letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 800 }}>
                                        MOVE. PERFORM. LIVE. 🌿
                                    </h3>
                                </div>

                                <div>
                                    <Link href="/shop" className="shimmer-button" style={{
                                        display: 'inline-block',
                                        background: C.accent,
                                        color: '#fff',
                                        textDecoration: 'none',
                                        padding: '18px 44px',
                                        fontSize: '13px',
                                        letterSpacing: '2.5px',
                                        textTransform: 'uppercase',
                                        fontWeight: 700,
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        Explore the Collection
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>

                </div>
            </div>
        </>
    );
}
