import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    slug: string;
    base_price: number;
    compare_price: number | null;
    primary_image: string | null;
    hover_image: string | null;
    category: string | null;
}

interface Category { id: number; name: string; slug: string; }
interface PaginatedProducts { data: Product[]; current_page: number; last_page: number; total: number; }

interface CollectionProps {
    products: PaginatedProducts;
    categories: Category[];
    currentCategory: Category | null;
    filters: { size?: string; min_price?: string; max_price?: string; in_stock?: string; gender?: string };
}

function ProductCard({ product }: { product: Product }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <div style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--forme-surface, #f5f0eb)', overflow: 'hidden', borderRadius: '2px', marginBottom: '12px' }}>
                    {product.primary_image ? (
                        <>
                            <img src={product.primary_image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s', opacity: hovered && product.hover_image ? 0 : 1 }} />
                            {product.hover_image && <img src={product.hover_image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s', opacity: hovered ? 1 : 0 }} />}
                        </>
                    ) : (
                        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s', opacity: 1 }} />
                    )}
                    {product.compare_price && <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--forme-accent, #8B1A2A)', color: 'var(--forme-surface, #fff)', fontSize: '10px', letterSpacing: '1px', padding: '4px 8px' }}>SALE</span>}
                </div>
                <div>
                    {product.category && <p style={{ fontSize: '10px', color: 'var(--forme-dim, #888)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</p>}
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '16px', color: 'var(--forme-text, #1a1a1a)', marginBottom: '6px' }}>{product.name}</p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'var(--forme-text, #1a1a1a)', fontWeight: 500 }}>₦{Number(product.base_price).toLocaleString()}</span>
                        {product.compare_price && <span style={{ fontSize: '13px', color: 'var(--forme-dim, #999)', textDecoration: 'line-through' }}>₦{Number(product.compare_price).toLocaleString()}</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Collection({ products, categories, currentCategory, filters }: CollectionProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const applyFilters = () => {
        const base = currentCategory ? `/collections/${currentCategory.slug}` : '/shop';
        router.get(base, localFilters as Record<string, string>, { preserveState: true });
        setSidebarOpen(false);
    };

    const clearFilters = () => {
        setLocalFilters({});
        const base = currentCategory ? `/collections/${currentCategory.slug}` : '/shop';
        router.get(base, {});
    };

    const pageTitle = currentCategory ? currentCategory.name : 'Shop All';

    return (
        <>
            <Head title={pageTitle} />

            {/* Breadcrumb */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--forme-border, #EDE8DF)', background: 'var(--forme-surface, #FDFAF6)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--forme-dim, #888)' }}>
                    <Link href="/" style={{ color: 'var(--forme-dim, #888)', textDecoration: 'none' }}>Home</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--forme-text, #1a1a1a)' }}>{pageTitle}</span>
                </div>
            </div>

            {/* Header */}
            <div style={{ padding: '48px 24px 32px', textAlign: 'center' }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '48px', fontWeight: 400, color: 'var(--forme-text, #1a1a1a)', marginBottom: '8px' }}>{pageTitle}</h1>
                <p style={{ fontSize: '13px', color: 'var(--forme-dim, #888)' }}>{products.total} pieces</p>
            </div>

            <style>{`
                .collection-layout {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 24px 80px;
                    display: flex;
                    gap: 48px;
                }
                .collection-products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 32px;
                }
                .mobile-filter-bar {
                    display: none;
                }
                @media (max-width: 900px) {
                    .collection-layout {
                        padding: 0 16px 60px;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .collection-sidebar {
                        display: none;
                    }
                    .mobile-filter-bar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        background: var(--forme-surface);
                        border: 1px solid var(--forme-border);
                        margin-bottom: 20px;
                        border-radius: 4px;
                    }
                    .collection-products-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 14px;
                    }
                }
            `}</style>

            <div className="collection-layout">
                {/* Sidebar filters */}
                <aside className="collection-sidebar" style={{ width: '220px', flexShrink: 0 }}>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--forme-text, #1a1a1a)', fontWeight: 600 }}>Filter</p>
                            {Object.keys(localFilters).length > 0 && (
                                <button onClick={clearFilters} style={{ fontSize: '11px', color: 'var(--forme-accent, #8B1A2A)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear All</button>
                            )}
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: '32px' }}>
                            <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--forme-dim, #888)', marginBottom: '12px' }}>Category</p>
                            <Link href="/shop" style={{ display: 'block', fontSize: '13px', color: !currentCategory ? 'var(--forme-accent, #8B1A2A)' : 'var(--forme-text, #1a1a1a)', textDecoration: 'none', marginBottom: '10px', fontWeight: !currentCategory ? 600 : 400 }}>All</Link>
                            {categories.map(c => (
                                <Link key={c.id} href={`/collections/${c.slug}`} style={{ display: 'block', fontSize: '13px', color: currentCategory?.id === c.id ? 'var(--forme-accent, #8B1A2A)' : 'var(--forme-text, #1a1a1a)', textDecoration: 'none', marginBottom: '10px', fontWeight: currentCategory?.id === c.id ? 600 : 400 }}>
                                    {c.name}
                                </Link>
                            ))}
                        </div>

                        {/* Gender filter */}
                        <div style={{ marginBottom: '32px' }}>
                            <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--forme-dim, #888)', marginBottom: '12px' }}>Gender</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['female', 'male', 'kids', 'unisex'].map(g => (
                                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--forme-text, #1a1a1a)' }}>
                                        <input type="radio" name="gender" checked={localFilters.gender === g}
                                            onChange={() => setLocalFilters(f => ({ ...f, gender: g }))}
                                            style={{ accentColor: 'var(--forme-accent, #8B1A2A)' }} />
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </label>
                                ))}
                                {localFilters.gender && (
                                    <button onClick={() => setLocalFilters(f => { const nf = {...f}; delete nf.gender; return nf; })} style={{ alignSelf: 'flex-start', fontSize: '11px', color: 'var(--forme-dim, #888)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}>Clear gender</button>
                                )}
                            </div>
                        </div>

                        {/* Size filter */}
                        <div style={{ marginBottom: '32px' }}>
                            <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--forme-dim, #888)', marginBottom: '12px' }}>Size</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {SIZES.map(s => (
                                    <button key={s} onClick={() => setLocalFilters(f => ({ ...f, size: f.size === s ? undefined : s }))}
                                        style={{ width: '40px', height: '40px', border: `1px solid ${localFilters.size === s ? 'var(--forme-text, #1a1a1a)' : 'var(--forme-border, #DDD)'}`, background: localFilters.size === s ? 'var(--forme-text, #1a1a1a)' : 'transparent', color: localFilters.size === s ? 'var(--forme-surface, #fff)' : 'var(--forme-text, #1a1a1a)', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* In stock */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" checked={!!localFilters.in_stock} onChange={e => setLocalFilters(f => ({ ...f, in_stock: e.target.checked ? '1' : undefined }))} style={{ width: '16px', height: '16px', accentColor: 'var(--forme-accent, #8B1A2A)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--forme-text, #1a1a1a)' }}>In Stock Only</span>
                            </label>
                        </div>

                        <button onClick={applyFilters} style={{ width: '100%', background: 'var(--forme-text, #1a1a1a)', color: 'var(--forme-surface, #fff)', border: 'none', padding: '12px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
                            Apply
                        </button>
                    </div>
                </aside>

                {/* Product grid */}
                <div style={{ flex: 1 }}>
                    {products.data.length === 0 ? (
                        <div style={{ textAlign: 'center', paddingTop: '80px' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', color: 'var(--forme-dim, #888)', marginBottom: '16px' }}>No pieces found</p>
                            <button onClick={clearFilters} style={{ background: 'var(--forme-accent, #8B1A2A)', color: 'var(--forme-surface, #fff)', border: 'none', padding: '12px 32px', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>Clear Filters</button>
                        </div>
                    ) : (
                        <>
                            <div className="collection-products-grid">
                                {products.data.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '64px' }}>
                                    {Array.from({ length: products.last_page }, (_, i) => i + 1).map(page => (
                                        <button key={page} onClick={() => router.get(window.location.pathname, { ...localFilters, page: String(page) })}
                                            style={{ width: '40px', height: '40px', border: `1px solid ${products.current_page === page ? 'var(--forme-text, #1a1a1a)' : 'var(--forme-border, #DDD)'}`, background: products.current_page === page ? 'var(--forme-text, #1a1a1a)' : 'transparent', color: products.current_page === page ? 'var(--forme-surface, #fff)' : 'var(--forme-text, #1a1a1a)', fontSize: '13px', cursor: 'pointer' }}>
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
