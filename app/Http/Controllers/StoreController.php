<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\HeroSlide;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function home(): Response
    {
        $featuredProducts = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        $newArrivals = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->latest()
            ->take(4)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        // Hero slides — use DB slides if any, else fallback defaults
        $dbSlides = HeroSlide::active()->get();

        $heroSlides = $dbSlides->isNotEmpty()
            ? $dbSlides->map(fn ($s) => [
                'type'   => $s->type,
                'src'    => $s->src_url,
                'poster' => $s->poster_url,
                'label'  => $s->label,
                'sub'    => $s->sub,
              ])->values()->all()
            : [
                ['type' => 'image', 'src' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85', 'poster' => null, 'label' => 'The Bloom Edit',     'sub' => 'New Season Arrivals'],
                ['type' => 'image', 'src' => 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85', 'poster' => null, 'label' => 'Menswear Essentials',  'sub' => 'Resort Collection'],
                ['type' => 'video', 'src' => 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-catwalk-19609-large.mp4', 'poster' => 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'label' => 'Behind the Scenes', 'sub' => 'Our Latest Shoot'],
                ['type' => 'image', 'src' => 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=85', 'poster' => null, 'label' => 'Made in Lagos',      'sub' => 'For the Modern African'],
            ];

        return Inertia::render('Store/Home', [
            'featuredProducts' => $featuredProducts,
            'categories'       => $categories,
            'newArrivals'      => $newArrivals,
            'heroSlides'       => $heroSlides,
        ]);
    }

    public function policy(): Response
    {
        return Inertia::render('Store/Policy');
    }

    public function collection(?string $slug = null): Response
    {
        $query = Product::with(['images', 'category', 'variants'])
            ->where('is_active', true);

        $currentCategory = null;
        if ($slug) {
            $currentCategory = Category::where('slug', $slug)->firstOrFail();
            $query->where('category_id', $currentCategory->id);
        }

        // Filters
        if (request('size')) {
            $query->whereHas('variants', fn ($q) => $q->where('size', request('size'))->where('is_active', true));
        }
        if (request('min_price')) {
            $query->where('base_price', '>=', request('min_price'));
        }
        if (request('max_price')) {
            $query->where('base_price', '<=', request('max_price'));
        }
        if (request('in_stock')) {
            $query->whereHas('variants', fn ($q) => $q->where('stock_quantity', '>', 0));
        }

        if (request('gender')) {
            $query->whereIn('gender', (array) request('gender'));
        }

        $products = $query->orderBy('sort_order')->paginate(12)->through(fn ($p) => $this->formatProduct($p));

        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Store/Collection', [
            'products'        => $products,
            'categories'      => $categories,
            'currentCategory' => $currentCategory,
            'filters'         => request()->only(['size', 'min_price', 'max_price', 'in_stock', 'gender']),
        ]);
    }

    public function product(string $slug): Response
    {
        $product = Product::with(['images', 'variants', 'category'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $related = Product::with(['images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        return Inertia::render('Store/Product', [
            'product' => [
                'id'               => $product->id,
                'name'             => $product->name,
                'slug'             => $product->slug,
                'description'      => $product->description,
                'short_description'=> $product->short_description,
                'base_price'       => $product->base_price,
                'compare_price'    => $product->compare_price,
                'material'         => $product->material,
                'care_instructions'=> $product->care_instructions,
                'category'         => $product->category?->name,
                'images'           => $product->images->map(fn ($img) => [
                    'id'         => $img->id,
                    'url'        => asset('storage/'.$img->image_path),
                    'alt'        => $img->alt_text ?? $product->name,
                    'is_primary' => $img->is_primary,
                ]),
                'variants'         => $product->variants->where('is_active', true)->values()->map(fn ($v) => [
                    'id'             => $v->id,
                    'color'          => $v->color,
                    'color_hex'      => $v->color_hex,
                    'size'           => $v->size,
                    'price_modifier' => $v->price_modifier,
                    'final_price'    => $v->final_price,
                    'stock'          => $v->stock_quantity,
                    'sku'            => $v->sku,
                ]),
            ],
            'related' => $related,
        ]);
    }

    private function formatProduct(Product $p): array
    {
        $primaryImg = $p->images->firstWhere('is_primary', true) ?? $p->images->first();
        $secondImg  = $p->images->whereNotIn('id', [$primaryImg?->id])->first();

        return [
            'id'            => $p->id,
            'name'          => $p->name,
            'slug'          => $p->slug,
            'base_price'    => $p->base_price,
            'compare_price' => $p->compare_price,
            'category'      => $p->category?->name,
            'primary_image' => $primaryImg ? asset('storage/'.$primaryImg->image_path) : null,
            'hover_image'   => $secondImg  ? asset('storage/'.$secondImg->image_path)  : null,
            'is_featured'   => $p->is_featured,
        ];
    }
}
