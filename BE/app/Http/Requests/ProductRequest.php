<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'productDetails.product_image' => 'string|max:200|nullable',
            'productDetails.product_category' => 'required|integer',
            'productDetails.product_name' => 'required|string|max:255',
            'productDetails.product_price' => 'nullable|numeric',  // Allow null values
            'productDetails.product_stock' => 'nullable|integer|min:0',
            'variants' => 'array|min:0',
        ];
    }

    public function withValidator($validator)
    {
        $validator->sometimes('variants.*.variation_name', 'required|string|max:255', function ($input) {
            return !empty($input->variants);
        });

        $validator->sometimes('variants.*.variation_price', 'required|numeric', function ($input) {
            return !empty($input->variants);
        });

        $validator->sometimes('variants.*.variation_stock', 'required|integer|min:0', function ($input) {
            return !empty($input->variants);
        });
    }
}
