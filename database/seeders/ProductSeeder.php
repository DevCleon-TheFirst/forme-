<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Dresses',     'slug' => 'dresses',     'description' => 'Elegant dresses for every occasion'],
            ['name' => 'Sets',        'slug' => 'sets',        'description' => 'Co-ord sets and matching pieces'],
            ['name' => 'Tops',        'slug' => 'tops',        'description' => 'Chic tops and blouses'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Statement accessories'],
            ['name' => 'New Arrivals','slug' => 'new-arrivals','description' => 'The latest from Petals Lagos'],
        ];

        foreach ($categories as $i => $cat) {
            Category::create([
                ...$cat,
                'is_active'  => true,
                'sort_order' => $i,
            ]);
        }

        $products = [
            [
                'category'    => 'dresses',
                'name'        => 'Bloom Midi Dress',
                'description' => '<p>A beautifully crafted midi dress featuring delicate floral details. Perfect for garden parties, brunches, and special occasions. Made from premium fabric sourced locally in Nigeria.</p>',
                'short_desc'  => 'Effortlessly elegant midi dress with floral details.',
                'base_price'  => 85000,
                'compare'     => 110000,
                'featured'    => true,
                'material'    => '100% Cotton Blend',
                'care'        => 'Hand wash cold. Do not tumble dry. Iron on low heat.',
                'colors'      => [['name' => 'Sage Green', 'hex' => '#8FAF7A'], ['name' => 'Dusty Rose', 'hex' => '#D4A5A5'], ['name' => 'Ivory', 'hex' => '#FFFFF0']],
                'sizes'       => ['XS', 'S', 'M', 'L', 'XL'],
            ],
            [
                'category'    => 'sets',
                'name'        => 'Tennis Co-ord Set',
                'description' => '<p>Our signature Tennis Co-ord set — the piece that put Petals Lagos on the map. A structured crop top paired with wide-leg trousers, crafted from our signature fabric blend.</p>',
                'short_desc'  => 'The iconic Petals Lagos Tennis co-ord set.',
                'base_price'  => 120000,
                'compare'     => null,
                'featured'    => true,
                'material'    => 'Premium Cotton-Linen Blend',
                'care'        => 'Dry clean only. Store hanging to maintain shape.',
                'colors'      => [['name' => 'Cream', 'hex' => '#F5F0E8'], ['name' => 'Caramel', 'hex' => '#C68642']],
                'sizes'       => ['S', 'M', 'L', 'XL'],
            ],
            [
                'category'    => 'dresses',
                'name'        => 'Petal Maxi Dress',
                'description' => '<p>A flowing maxi dress inspired by the natural beauty of petals. Features an adjustable tie waist, flutter sleeves, and a graceful hem. Made for the woman who commands every room she enters.</p>',
                'short_desc'  => 'Flowing maxi dress with flutter sleeves and tie waist.',
                'base_price'  => 95000,
                'compare'     => null,
                'featured'    => true,
                'material'    => 'Chiffon with satin lining',
                'care'        => 'Dry clean recommended. Hand wash delicate.',
                'colors'      => [['name' => 'Blush', 'hex' => '#F4C2C2'], ['name' => 'Midnight Blue', 'hex' => '#191970']],
                'sizes'       => ['XS', 'S', 'M', 'L'],
            ],
            [
                'category'    => 'tops',
                'name'        => 'Lagos Wrap Top',
                'description' => '<p>A versatile wrap top that transitions from day to night with ease. Pair with our matching wide-leg trousers or your favourite jeans.</p>',
                'short_desc'  => 'Versatile wrap top, perfect day-to-night.',
                'base_price'  => 45000,
                'compare'     => 58000,
                'featured'    => false,
                'material'    => 'Silk Crepe',
                'care'        => 'Hand wash cold. Lay flat to dry.',
                'colors'      => [['name' => 'Terracotta', 'hex' => '#C66b3B'], ['name' => 'Forest Green', 'hex' => '#2D5A27'], ['name' => 'Ivory', 'hex' => '#FFFFF0']],
                'sizes'       => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            ],
            [
                'category'    => 'sets',
                'name'        => 'Ankara Crop Set',
                'description' => '<p>A stunning crop top and midi skirt set made from authentic Ankara fabric. Each piece is unique and celebrates the richness of African textile heritage.</p>',
                'short_desc'  => 'Authentic Ankara crop top and midi skirt co-ord.',
                'base_price'  => 78000,
                'compare'     => null,
                'featured'    => true,
                'material'    => 'Authentic Ankara Cotton',
                'care'        => 'Machine wash cold. Do not bleach.',
                'colors'      => [['name' => 'Multi Print A', 'hex' => '#E07B39'], ['name' => 'Multi Print B', 'hex' => '#3B7BC0']],
                'sizes'       => ['S', 'M', 'L'],
            ],
            [
                'category'    => 'new-arrivals',
                'name'        => 'Hibiscus Slip Dress',
                'description' => '<p>Our newest addition — a sleek satin slip dress with hibiscus embroidery at the hem. Minimal, modern, and unmistakably Petals Lagos.</p>',
                'short_desc'  => 'Satin slip dress with signature hibiscus embroidery.',
                'base_price'  => 67000,
                'compare'     => null,
                'featured'    => true,
                'material'    => 'Premium Satin',
                'care'        => 'Dry clean only.',
                'colors'      => [['name' => 'Champagne', 'hex' => '#F7E7CE'], ['name' => 'Burgundy', 'hex' => '#800020']],
                'sizes'       => ['XS', 'S', 'M', 'L'],
            ],
            [
                'category'    => 'tops',
                'name'        => 'Lagos Linen Shirt',
                'description' => '<p>A breathable linen shirt tailored for the modern African man. Features a relaxed fit and a subtle mandarin collar, perfect for the tropical climate.</p>',
                'short_desc'  => 'Breathable linen shirt with a relaxed fit.',
                'base_price'  => 55000,
                'compare'     => null,
                'featured'    => true,
                'gender'      => 'male',
                'material'    => '100% Linen',
                'care'        => 'Machine wash cold. Line dry in shade. Warm iron.',
                'colors'      => [['name' => 'White', 'hex' => '#FFFFFF'], ['name' => 'Navy', 'hex' => '#000080']],
                'sizes'       => ['S', 'M', 'L', 'XL'],
            ],
            [
                'category'    => 'sets',
                'name'        => 'Ankara Print Men\'s Set',
                'description' => '<p>A modern take on traditional menswear. This coordinated set includes a short-sleeve top and matching shorts featuring a bold Ankara print.</p>',
                'short_desc'  => 'Coordinated top and shorts in bold Ankara print.',
                'base_price'  => 85000,
                'compare'     => 105000,
                'featured'    => true,
                'gender'      => 'male',
                'material'    => 'Cotton Ankara',
                'care'        => 'Hand wash cold. Do not bleach.',
                'colors'      => [['name' => 'Sunburst', 'hex' => '#F4A460'], ['name' => 'Ocean', 'hex' => '#4682B4']],
                'sizes'       => ['M', 'L', 'XL', 'XXL'],
            ],
            [
                'category'    => 'new-arrivals',
                'name'        => 'Unisex Oversized Hoodie',
                'description' => '<p>The ultimate comfort piece. Our oversized hoodie is designed to be worn by anyone, featuring dropped shoulders and a heavy-weight cotton fleece.</p>',
                'short_desc'  => 'Heavy-weight cotton fleece oversized hoodie.',
                'base_price'  => 60000,
                'compare'     => null,
                'featured'    => false,
                'gender'      => 'unisex',
                'material'    => '100% Cotton Fleece',
                'care'        => 'Machine wash warm. Tumble dry low.',
                'colors'      => [['name' => 'Ash Grey', 'hex' => '#B2BEB5'], ['name' => 'Charcoal', 'hex' => '#36454F']],
                'sizes'       => ['S', 'M', 'L', 'XL'],
            ],
            [
                'category'    => 'tops',
                'name'        => 'Kids Graphic Tee',
                'description' => '<p>A playful graphic tee for kids, made from 100% organic cotton for ultimate softness and breathability.</p>',
                'short_desc'  => 'Playful and soft organic cotton graphic tee for kids.',
                'base_price'  => 15000,
                'compare'     => null,
                'featured'    => false,
                'gender'      => 'kids',
                'material'    => '100% Organic Cotton',
                'care'        => 'Machine wash cold with like colors.',
                'colors'      => [['name' => 'Sunshine', 'hex' => '#FFD700'], ['name' => 'Sky Blue', 'hex' => '#87CEEB']],
                'sizes'       => ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
            ],
            [
                'category'    => 'sets',
                'name'        => 'Kids Mini Lounge Set',
                'description' => '<p>A cozy two-piece lounge set for kids. Perfect for playdates or relaxing at home, featuring a stretchy waistband for easy wearing.</p>',
                'short_desc'  => 'Cozy two-piece lounge set for everyday play.',
                'base_price'  => 35000,
                'compare'     => null,
                'featured'    => true,
                'gender'      => 'kids',
                'material'    => 'Cotton Blend',
                'care'        => 'Machine wash warm.',
                'colors'      => [['name' => 'Blush', 'hex' => '#FFB6C1'], ['name' => 'Mint', 'hex' => '#98FF98']],
                'sizes'       => ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
            ]
        ];

        foreach ($products as $data) {
            $cat     = Category::where('slug', $data['category'])->first();
            $product = Product::create([
                'category_id'       => $cat->id,
                'name'              => $data['name'],
                'slug'              => Str::slug($data['name']),
                'description'       => $data['description'],
                'short_description' => $data['short_desc'],
                'base_price'        => $data['base_price'],
                'compare_price'     => $data['compare'],
                'is_featured'       => $data['featured'],
                'is_active'         => true,
                'material'          => $data['material'],
                'care_instructions' => $data['care'],
                'gender'            => $data['gender'] ?? 'female',
            ]);

            // Create all colour × size variants
            foreach ($data['colors'] as $color) {
                foreach ($data['sizes'] as $size) {
                    ProductVariant::create([
                        'product_id'     => $product->id,
                        'color'          => $color['name'],
                        'color_hex'      => $color['hex'],
                        'size'           => $size,
                        'price_modifier' => 0,
                        'stock_quantity' => rand(3, 20),
                        'sku'            => strtoupper(Str::random(8)),
                        'is_active'      => true,
                    ]);
                }
            }
        }
    }
}
