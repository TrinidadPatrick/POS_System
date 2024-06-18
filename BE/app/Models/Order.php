<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    // Make sure to include the fillable properties
    protected $fillable = [
        'user_id',
        'order_number',
        'customer_name',
        'order_status',
        'total_price',
        'amount_paid'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderList::class, 'order_number', 'order_number');
    }

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
