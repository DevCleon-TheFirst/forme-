<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'gender', 'name', 'slug', 'description', 'short_description',
        'base_price', 'compare_price', 'is_featured', 'is_active', 'sort_order',
        'material', 'care_instructions',
    ];

    protected $casts = [
        'base_price'    => 'decimal:2',
        'compare_price' => 'decimal:2',
        'is_featured'   => 'boolean',
        'is_active'     => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): ?ProductImage
    {
        return $this->images()->where('is_primary', true)->first()
            ?? $this->images()->first();
    }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        $img = $this->images()->where('is_primary', true)->first()
            ?? $this->images()->first();

        return $img ? asset('storage/'.$img->image_path) : null;
    }

    public function colors(): \Illuminate\Support\Collection
    {
        return $this->variants()
            ->whereNotNull('color')
            ->distinct('color')
            ->pluck('color', 'color_hex');
    }

    public function sizes(): \Illuminate\Support\Collection
    {
        return $this->variants()
            ->whereNotNull('size')
            ->distinct()
            ->pluck('size');
    }
}
