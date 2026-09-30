<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('user_email');
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->text('shipping_address');
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->double('subtotal')->default(0.0);
            $table->double('tax')->default(0.0);
            $table->double('shipping_cost')->default(0.0);
            $table->double('total_amount')->default(0.0);
            $table->string('status')->default('PROCESSING'); // PROCESSING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
            $table->string('payment_method')->default('COD'); // COD, CARD, PAYHERE
            $table->string('payment_status')->default('PENDING'); // PENDING, SUCCESS, FAILED
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
