<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Products;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return ProductResource::collection(
            Product::where('user_id', Auth::user()->id)->with(['category', 'variations'])->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $validated = $request->validated();
        try {
            DB::beginTransaction();

            $product = Product::create([
                'user_id' => Auth::user()->id,
                'product_image' => $validated['productDetails']['product_image'],
                'product_category' => $validated['productDetails']['product_category'],
                'product_name' => $validated['productDetails']['product_name'],
                'product_price' => $validated['productDetails']['product_price'],
                'product_stock' => $validated['productDetails']['product_stock'],
            ]);

            $productId = $product->id;

            if (!empty($validated['variants'])) {
                foreach ($validated['variants'] as $variant) {
                    ProductVariation::create([
                        'product_id' => $productId,
                        'variation_name' => $variant['variation_name'],
                        'variation_price' => $variant['variation_price'],
                        'variation_stock' => $variant['variation_stock'],
                    ]);
                }
            }
            DB::commit();

            return response()->json(['message' => 'Product and variations created successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create product and variations', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, string $id)
    {
        $validated = $request->validated();
        $product = Product::findOrFail($id);
        $product->update([
            'product_image' => $validated['productDetails']['product_image'],
            'product_category' => $validated['productDetails']['product_category'],
            'product_name' => $validated['productDetails']['product_name'],
            'product_price' => $validated['productDetails']['product_price'],
            'product_stock' => $validated['productDetails']['product_stock'],
        ]);

        $newVariants = $validated['variants'];
        $existingVariationIds = $product->variations->pluck('id')->toArray();

        foreach ($newVariants as $variant) {
            $productVariation = ProductVariation::updateOrCreate(
                ['id' => $variant['id'] ?? null, 'product_id' => $product->id],
                [
                    'variation_name' => $variant['variation_name'],
                    'variation_price' => $variant['variation_price'],
                    'variation_stock' => $variant['variation_stock'],
                ]
            );

            // Remove the processed variation from the list of existing IDs
            if (($key = array_search($productVariation->id, $existingVariationIds)) !== false) {
                unset($existingVariationIds[$key]);
            }
        }

        // Delete the remaining variations that were not updated or re-created
        ProductVariation::whereIn('id', $existingVariationIds)->delete();

        return response()->json(['message' => 'Product and variations updated successfully'], 200);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
