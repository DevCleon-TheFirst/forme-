<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('paystack_auth_code')->nullable()->after('password');
            $table->string('card_last_four', 4)->nullable()->after('paystack_auth_code');
            $table->string('card_brand')->nullable()->after('card_last_four');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['paystack_auth_code', 'card_last_four', 'card_brand']);
        });
    }
};
