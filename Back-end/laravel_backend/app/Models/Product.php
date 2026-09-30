<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'original_price',
        'category',
        'brand',
        'rating',
        'reviews',
        'image',
        'discount',
        'is_new',
        'stock',
        'warranty',
        'return_period',
        'description',
    ];

    protected $casts = [
        'price' => 'double',
        'original_price' => 'double',
        'rating' => 'double',
        'reviews' => 'integer',
        'discount' => 'integer',
        'is_new' => 'boolean',
        'stock' => 'integer',
    ];
}
