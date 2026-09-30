<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_email',
        'customer_name',
        'customer_phone',
        'shipping_address',
        'city',
        'postal_code',
        'subtotal',
        'tax',
        'shipping_cost',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
    ];

    protected $casts = [
        'subtotal' => 'double',
        'tax' => 'double',
        'shipping_cost' => 'double',
        'total_amount' => 'double',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
