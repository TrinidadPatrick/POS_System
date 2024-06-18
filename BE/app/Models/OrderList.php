<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderList extends Model
{
    use HasFactory;

    protected $table = 'order_lists';

    protected $fillable = [
        'user_id',
        'order_number',
        'order_id_number',
        'order_product_id',
        'order_product_name',
        'order_product_category_name',
        'order_product_variant',
        'order_product_original_price',
        'order_product_note',
        'order_product_price',
        'order_qty',
    ];

    // Define the relationship with the Order model
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_number', 'order_number');
    }

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
