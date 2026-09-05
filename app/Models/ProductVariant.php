<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'color', 'color_hex', 'size',
        'price_modifier', 'stock_quantity', 'sku', 'is_active',
    ];

    protected $casts = [
        'price_modifier' => 'decimal:2',
        'is_active'      => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getFinalPriceAttribute(): float
    {
        return (float) $this->product->base_price + (float) $this->price_modifier;
    }

    public function getDescriptionAttribute(): string
    {
        return collect([$this->color, $this->size])->filter()->implode(' / ');
    }

    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }
}
