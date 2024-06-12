<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'category_name' => $this->category_name,
            'created_at' => $this->created_at,
            'relationships' => [
                'id' => (string)$this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email
            ]
        ];
    }
}
