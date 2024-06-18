<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
            'order_number' => 'required',
            'customer_name' => 'nullable|string|max:255',
            'total_price' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'amount_paid' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'order_items' => 'required|array',
            'order_items.*.order_product_id' => 'required|integer|exists:products,id',
            'order_items.*.order_id_number' => 'required|integer',
            'order_items.*.order_number' => 'integer',
            'order_items.*.order_product_name' => 'required|string|max:255',
            'order_items.*.order_product_category_name' => 'required|string|max:255',
            'order_items.*.order_product_variant' => 'nullable|string|max:255',
            'order_items.*.order_product_original_price' => 'required|numeric',
            'order_items.*.order_product_note' => 'nullable|string|max:255',
            'order_items.*.order_product_price' => 'required|numeric',
            'order_items.*.order_qty' => 'required|integer',
        ];
    }
}
