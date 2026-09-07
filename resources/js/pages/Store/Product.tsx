import React, { useState, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';

interface Variant {
    id: number;
    color: string | null;
    color_hex: string | null;
    size: string | null;
    price_modifier: number;
    final_price: number;
    stock: number;
    sku: string | null;
}

interface ProductImage { id: number; url: string; alt: string; is_primary: boolean; }

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    base_price: number;
    compare_price: number | null;
    material: string | null;
    care_instructions: string | null;
    category: string | null;
    images: ProductImage[];
    variants: Variant[];
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    base_price: number;
    primary_image: string | null;
}

interface ProductPageProps {
    product: Product;
    related: RelatedProduct[];
}

const C = {
    bg:      'var(--forme-bg)',
    surface: 'var(--forme-surface)',
    border:  'var(--forme-border)',
    accent:  'var(--forme-accent)',
    text:    'var(--forme-text)',
    muted:   'var(--forme-muted)',
    dim:     'var(--forme-dim)',
};

export default function ProductPage({ product, related }: ProductPageProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addedMsg, setAddedMsg] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

    // Zoom state
    const [zoomed, setZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const imgContainerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = imgContainerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
    }, []);

    const colors = [...new Set(product.variants.filter(v => v.color).map(v => v.color!))];
    const sizes  = [...new Set(product.variants.filter(v => v.size).map(v => v.size!))];

    const selectedVariant = product.variants.find(v => {
        if (colors.length && sizes.length) return v.color === selectedColor && v.size === selectedSize;
        if (colors.length) return v.color === selectedColor;
        if (sizes.length) return v.size === selectedSize;
        return true;
    }) ?? (product.variants.length === 1 ? product.variants[0] : null);

    const isSizeAvailable = (size: string) => {
        return product.variants.some(v =>
            v.size === size &&
            v.stock > 0 &&
            (!selectedColor || v.color === selectedColor)
        );
    };

    const currentPrice = selectedVariant ? selectedVariant.final_price : product.base_price;

    const handleAddToCart = async () => {
        setError('');
        if (!selectedVariant) {
            const missing = [];
            if (colors.length > 0 && !selectedColor) missing.push('color');
            if (sizes.length > 0 && !selectedSize) missing.push('size');
            setError(`Please select a ${missing.join(' and ')}.`);
            return;
        }
        if (selectedVariant.stock === 0) {
            setError('This variant is out of stock.');
            return;
        }
        setAdding(true);
        try {
            const res = await axios.post('/cart', { variant_id: selectedVariant.id, quantity });
            setAddedMsg('Added to bag!');
            setTimeout(() => setAddedMsg(''), 3000);
            window.dispatchEvent(new CustomEvent('cart-updated', { detail: res.data.count }));
        } catch (e: any) {
            setError(e.response?.data?.error || 'Could not add to cart.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <Head title={product.name} />

            <style>{`
                .product-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 64px;
                    align-items: start;
                }
                .product-images-wrap {
                    display: flex;
                    gap: 16px;
                }
                @media (max-width: 900px) {
                    .product-main-grid {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                    .product-images-wrap {
                        flex-direction: column-reverse;
                    }
                    .product-thumbnails-list {
                        flex-direction: row !important;
                        width: 100% !important;
                        overflow-x: auto;
                    }
                    .product-thumbnails-list button {
                        width: 64px !important;
                        flex-shrink: 0;
                    }
                }
            `}</style>

            {/* Breadcrumb */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '8px', fontSize: '12px', color: C.muted }}>
                    <Link href="/" style={{ color: C.muted, textDecoration: 'none' }}>Home</Link>
                    <span>/</span>
                    <Link href="/shop" style={{ color: C.muted, textDecoration: 'none' }}>Shop</Link>
                    <span>/</span>
                    <span style={{ color: C.text }}>{product.name}</span>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 20px 80px' }}>
                <div className="product-main-grid">

                    {/* ── Images ────────────────────────────────────────── */}
                    <div className="product-images-wrap">
                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="product-thumbnails-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '80px', flexShrink: 0 }}>
                                {product.images.map((img, i) => (
                                    <button key={img.id} onClick={() => setSelectedImage(i)} style={{ padding: 0, border: `2px solid ${selectedImage === i ? C.text : 'transparent'}`, cursor: 'pointer', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '2px' }}>
                                        <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Main image with zoom */}
                        <div
                            ref={imgContainerRef}
                            onMouseEnter={() => setZoomed(true)}
                            onMouseLeave={() => setZoomed(false)}
                            onMouseMove={handleMouseMove}
                            style={{ flex: 1, aspectRatio: '3/4', background: C.surface, borderRadius: '2px', overflow: 'hidden', position: 'relative', cursor: zoomed ? 'crosshair' : 'default' }}
                        >
                            {product.images[selectedImage] ? (
                                <img
                                    src={product.images[selectedImage].url}
                                    alt={product.images[selectedImage].alt}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                        transform: zoomed ? 'scale(2.5)' : 'scale(1)',
                                        transition: zoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease',
                                        display: 'block',
                                        pointerEvents: 'none',
                                    }}
                                />
                            ) : (
                                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                        transform: zoomed ? 'scale(2.5)' : 'scale(1)',
                                        transition: zoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease',
                                        display: 'block',
                                        pointerEvents: 'none',
                                    }} />
                            )}
                            {/* Zoom hint */}
                            {!zoomed && product.images[selectedImage] && (
                                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: C.surface, backdropFilter: 'blur(4px)', padding: '6px 12px', fontSize: '11px', letterSpacing: '1px', color: C.muted, borderRadius: '2px', pointerEvents: 'none', border: `1px solid ${C.border}` }}>
                                    Hover to zoom
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Product info ──────────────────────────────────── */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        {product.category && <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>{product.category}</p>}
                        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '36px', fontWeight: 400, color: C.text, marginBottom: '16px', lineHeight: 1.2 }}>{product.name}</h1>

                        {/* Price */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '24px', color: C.text }}>₦{Number(currentPrice).toLocaleString()}</span>
                            {product.compare_price && <span style={{ fontSize: '18px', color: C.muted, textDecoration: 'line-through' }}>₦{Number(product.compare_price).toLocaleString()}</span>}
                        </div>

                        {product.short_description && <p style={{ fontSize: '14px', color: C.muted, lineHeight: '1.8', marginBottom: '32px' }}>{product.short_description}</p>}

                        {/* Color picker */}
                        {colors.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: C.muted, marginBottom: '12px' }}>
                                    Color {selectedColor && <span style={{ color: C.text, fontWeight: 600 }}>— {selectedColor}</span>}
                                </p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {product.variants.filter((v, i, arr) => arr.findIndex(x => x.color === v.color) === i).map(v => (
                                        <button key={v.id} onClick={() => setSelectedColor(v.color)}
                                            title={v.color ?? ''}
                                            style={{ width: '36px', height: '36px', borderRadius: '50%', background: v.color_hex || C.dim, border: `3px solid ${selectedColor === v.color ? C.text : 'transparent'}`, outline: `1px solid ${v.color_hex ? 'rgba(0,0,0,0.15)' : C.dim}`, cursor: 'pointer', transition: 'border-color 0.2s', boxSizing: 'border-box' }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size picker */}
                        {sizes.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: C.muted }}>Size</p>
                                    <button style={{ fontSize: '12px', color: C.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Size Guide</button>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {sizes.map(size => {
                                        const available = isSizeAvailable(size);
                                        return (
                                            <button key={size} onClick={() => available && setSelectedSize(size)} disabled={!available}
                                                style={{ padding: '10px 16px', border: `1px solid ${selectedSize === size ? C.text : C.border}`, background: selectedSize === size ? C.text : 'transparent', color: !available ? C.dim : selectedSize === size ? C.bg : C.text, fontSize: '12px', letterSpacing: '1px', cursor: available ? 'pointer' : 'not-allowed', transition: 'all 0.2s', textDecoration: !available ? 'line-through' : 'none' }}>
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: C.muted, marginBottom: '12px' }}>Quantity</p>
                            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.border}`, width: 'fit-content' }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: C.text }}>−</button>
                                <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', color: C.text }}>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: C.text }}>+</button>
                            </div>
                        </div>

                        {/* Errors / success */}
                        {error && <p style={{ color: C.accent, fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
                        {addedMsg && <p style={{ color: '#2d7a4f', fontSize: '13px', marginBottom: '12px' }}>✓ {addedMsg}</p>}

                        {/* Add to bag button */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <button onClick={handleAddToCart} disabled={adding} style={{ flex: 1, background: C.text, color: C.bg, border: 'none', padding: '18px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s', opacity: adding ? 0.7 : 1 }}>
                                {adding ? 'Adding...' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: 'flex', gap: '24px', padding: '16px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginBottom: '32px', flexWrap: 'wrap' }}>
                            {['Free shipping over ₦50k', 'Easy returns', 'Secure checkout'].map(t => (
                                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', color: C.accent }}>✓</span>
                                    <span style={{ fontSize: '12px', color: C.muted }}>{t}</span>
                                </div>
                            ))}
                        </div>

                        {/* Accordion tabs */}
                        {[
                            { key: 'details' as const, label: 'Details', content: product.description || 'No additional details.' },
                            { key: 'care' as const, label: 'Care Instructions', content: product.care_instructions || 'Handle with care. Dry clean recommended.' },
                            { key: 'shipping' as const, label: 'Shipping & Returns', content: 'Standard delivery within Lagos: 2-3 business days. Nigeria-wide: 3-7 business days. Free returns within 14 days.' },
                        ].map(tab => (
                            <div key={tab.key} style={{ borderBottom: `1px solid ${C.border}` }}>
                                <button onClick={() => setActiveTab(activeTab === tab.key ? 'details' : tab.key)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: C.text, fontWeight: 500 }}>{tab.label}</span>
                                    <span style={{ fontSize: '18px', color: C.muted, transition: 'transform 0.2s', transform: activeTab === tab.key ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                                </button>
                                {activeTab === tab.key && (
                                    <div style={{ paddingBottom: '16px' }}>
                                        <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: tab.content }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div style={{ marginTop: '96px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <p style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>You May Also Like</p>
                            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '36px', fontWeight: 400, color: C.text }}>Complete the Look</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '32px' }}>
                            {related.map(p => (
                                <Link key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                                    <div>
                                        <div style={{ aspectRatio: '3/4', background: C.surface, overflow: 'hidden', borderRadius: '2px', marginBottom: '12px' }}>
                                            {p.primary_image ? <img src={p.primary_image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '16px', color: C.text, marginBottom: '6px' }}>{p.name}</p>
                                        <p style={{ fontSize: '14px', color: C.muted }}>₦{Number(p.base_price).toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
