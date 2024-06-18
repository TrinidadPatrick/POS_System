<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function () {
        $user = Auth::user();
        $categories = Auth::user()->categories;
        $products = Product::where('user_id', $user->id)
            ->with(['variations', 'category'])
            ->get();
        $orders = Order::where('user_id', $user->id)->where('order_status', 'PENDING')
            ->with(['orderItems'])
            ->get();
        return response()->json(['user' => $user, 'categories' => $categories, 'products' => $products, 'orders' => $orders], 201);
    });

    // Categories API
    Route::resource('/category', CategoryController::class);

    // Products API
    Route::resource('/product', ProductController::class);

    // Order Api
    Route::resource('/order', OrderController::class);

    // Report Api
    Route::get('/getCustomerReport', [ReportController::class, 'GetCustomerReport']);

    // Expense Api
    Route::resource('/expense', OrderController::class);
});
