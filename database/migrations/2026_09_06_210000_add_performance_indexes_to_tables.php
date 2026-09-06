<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Products performance indexes
        Schema::table('products', function (Blueprint $table) {
            $table->index(['is_active', 'is_featured'], 'idx_products_active_featured');
            $table->index(['category_id', 'is_active'], 'idx_products_cat_active');
            $table->index(['gender', 'is_active'], 'idx_products_gender_active');
        });

        // 2. Product variants indexes
        Schema::table('product_variants', function (Blueprint $table) {
            $table->index(['product_id', 'is_active'], 'idx_pv_product_active');
            $table->index(['color', 'size'], 'idx_pv_color_size');
        });

        // 3. Orders performance indexes
        Schema::table('orders', function (Blueprint $table) {
            $table->index('customer_email', 'idx_orders_email');
            $table->index('status', 'idx_orders_status');
            $table->index('payment_status', 'idx_orders_payment_status');
            $table->index(['user_id', 'status'], 'idx_orders_user_status');
        });

        // 4. Order items index
        Schema::table('order_items', function (Blueprint $table) {
            $table->index('order_id', 'idx_order_items_order_id');
        });

        // 5. Cart items composite index
        Schema::table('cart_items', function (Blueprint $table) {
            $table->index(['cart_id', 'product_variant_id'], 'idx_cart_items_cart_pv');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_active_featured');
            $table->dropIndex('idx_products_cat_active');
            $table->dropIndex('idx_products_gender_active');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropIndex('idx_pv_product_active');
            $table->dropIndex('idx_pv_color_size');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_email');
            $table->dropIndex('idx_orders_status');
            $table->dropIndex('idx_orders_payment_status');
            $table->dropIndex('idx_orders_user_status');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex('idx_order_items_order_id');
        });

        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropIndex('idx_cart_items_cart_pv');
        });
    }
};
