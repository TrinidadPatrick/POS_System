<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string)$this->id,
            'product_image' => $this->product_image,
            'product_category' => $this->product_category,
            'product_name' => $this->product_name,
            'product_price' => $this->product_price,
            'product_stock' => $this->product_stock,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'category' => $this->category,
            'variations' => $this->variations

        ];
    }
}
