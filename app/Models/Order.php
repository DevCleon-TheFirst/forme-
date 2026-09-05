<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'status', 'payment_status', 'payment_reference',
        'subtotal', 'shipping_fee', 'total_amount',
        'customer_name', 'customer_email', 'customer_phone',
        'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country',
        'notes',
    ];

    protected $casts = [
        'subtotal'      => 'decimal:2',
        'shipping_fee'  => 'decimal:2',
        'total_amount'  => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function generateOrderNumber(): string
    {
        return 'PL-'.strtoupper(uniqid());
    }
}
