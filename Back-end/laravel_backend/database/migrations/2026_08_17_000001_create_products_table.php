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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->double('price');
            $table->double('original_price')->nullable();
            $table->string('category');
            $table->string('brand')->nullable();
            $table->double('rating')->default(5.0);
            $table->integer('reviews')->default(0);
            $table->text('image')->nullable();
            $table->integer('discount')->default(0);
            $table->boolean('is_new')->default(false);
            $table->integer('stock')->default(0);
            $table->string('warranty')->nullable();
            $table->string('return_period')->default('7 Days');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
