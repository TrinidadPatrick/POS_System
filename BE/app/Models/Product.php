<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_name',
        'product_image',
        'product_stock',
        'product_price',
        'product_category',
        'is_active'
    ];

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'product_category');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
