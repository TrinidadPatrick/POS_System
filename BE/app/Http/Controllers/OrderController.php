<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderList;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return OrderResource::collection(
            Order::where('user_id', Auth::user()->id)->with('orderItems')->where('order_status', 'PENDING')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::user()->id;

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => $validated['user_id'],
                'customer_name' => $validated['customer_name'],
                'order_number' => $validated['order_number'],
                'total_price' => $validated['total_price'],
                'amount_paid' => $validated['amount_paid'],
            ]);

            $order_number = $validated['order_number'];
            $order_items = $validated['order_items'];


            if (!empty($order_items)) {
                $orderItems = [];
                foreach ($order_items as $item) {
                    $orderItem = OrderList::create([
                        'user_id' => $validated['user_id'],
                        'order_number' => $order_number,
                        'order_id_number' => $item['order_id_number'],
                        'order_product_id' => $item['order_product_id'],
                        'order_product_name' => $item['order_product_name'],
                        'order_product_category_name' => $item['order_product_category_name'],
                        'order_product_variant' => $item['order_product_variant'],
                        'order_product_original_price' => $item['order_product_original_price'],
                        'order_product_note' => $item['order_product_note'],
                        'order_product_price' => $item['order_product_price'],
                        'order_qty' => $item['order_qty'],
                    ]);
                    $orderItems[] = $orderItem;
                }

                $order->load('orderItems');

                DB::commit();

                return response()->json(['order' => $order, 'order_items' => $orderItems], 201);
            }


            // return response()->json(['message' => 'Order submitted'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to add order', 'error' => $e->getMessage()], 500);
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
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'order_status' => 'required|string|in:PENDING,COMPLETE,CANCELLED', // Adjust the statuses as needed
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }


        try {
            // Find the order by ID, or fail with a 404 error if not found
            $order = Order::findOrFail($id);

            // Update the order status
            $updated = $order->update([
                'order_status' => $request->order_status
            ]);

            if ($updated) {
                return response()->json([
                    'success' => true,
                    'message' => 'Order status updated successfully',
                    'order' => $order
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update order status'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
