<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'type', 'src', 'poster', 'label', 'sub', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function getSrcUrlAttribute(): string
    {
        // If it looks like a full URL (http/https), return as-is
        if (str_starts_with($this->src, 'http')) {
            return $this->src;
        }
        // Otherwise treat as storage path
        return asset('storage/' . $this->src);
    }

    public function getPosterUrlAttribute(): ?string
    {
        if (!$this->poster) return null;
        if (str_starts_with($this->poster, 'http')) return $this->poster;
        return asset('storage/' . $this->poster);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
