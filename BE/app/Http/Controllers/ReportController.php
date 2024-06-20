<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Order;
use App\Models\OrderList;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function GetReports(Request $request)
    {

        $user = Auth::user();

        $startOfDay = Carbon::today()->startOfDay();
        $endOfDay = Carbon::today()->endOfDay();

        $startYear = Carbon::today()->startOfYear();
        $endYear = Carbon::today()->endOfYear();

        // Year Sales report
        $ReportsForTheYear = Order::where('user_id', $user->id)->where('order_status', 'COMPLETE')
            ->whereBetween('created_at', [$startYear, $endYear])
            ->with('orderItems')->get();

        // Current Day Reports, 
        $initialReports = Order::where('user_id', $user->id)->where('order_status', '!=', 'PENDING')
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->with('orderItems')->get();

        $orderItems = $initialReports->flatMap(function ($order) {
            return $order->orderItems->map(function ($item) use ($order) {
                return [
                    'created_at' => $item->created_at,
                    'order_status' => $order->order_status,
                    'order_number' => $item->order_number,
                    'total_price' => $item->order_product_price,
                    'item_id' => $item->id,
                    'product_name' => $item->order_product_name,
                    'product_category' => $item->order_product_category_name,
                    'product_variant' => $item->order_product_variant,
                    'order_qty' => $item->order_qty,
                    'price' => $item->order_product_original_price,
                ];
            });
        });

        // Net sales of the day
        $net_sales = $initialReports->filter(function ($report) {
            return $report->order_status === 'COMPLETE';
        })->sum('total_price');

        // Expenses of the day
        $expense = Expense::where('user_id', Auth::user()->id)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->sum('item_price');

        // Products sold for the day
        $product_sold = $orderItems->filter(function ($item) {
            return $item['order_status'] === 'COMPLETE';
        })->sum('order_qty');


        $profit = $net_sales - $expense;

        return response()->json(
            [
                'net_sales' => $net_sales,
                'expense' => $expense,
                'product_sold' => $product_sold,
                'profit' => $profit,
                'ReportsForTheYear' => $ReportsForTheYear,
                'orderItems' => $orderItems,
            ],
            201
        );
    }

    public function GetReportsWithFilter(Request $request)
    {
        $date = $request->query('date');

        $user = Auth::user();

        $startYear = Carbon::today()->startOfYear();
        $endYear = Carbon::today()->endOfYear();

        // Year Sales report
        $ReportsForTheYear = Order::where('user_id', $user->id)->where('order_status', 'COMPLETE')
            ->whereBetween('created_at', [$startYear, $endYear])
            ->with('orderItems')->get();

        $initialReports = Order::where('user_id', $user->id)->where('order_status', '!=', 'PENDING')
            ->whereBetween('created_at', [Carbon::parse($date)->startOfDay(), Carbon::parse($date)->endOfDay()])
            ->with('orderItems')->get();

        $orderItems = $initialReports->flatMap(function ($order) {
            return $order->orderItems->map(function ($item) use ($order) {
                return [
                    'created_at' => $item->created_at,
                    'order_status' => $order->order_status,
                    'order_number' => $item->order_number,
                    'total_price' => $item->order_product_price,
                    'item_id' => $item->id,
                    'product_name' => $item->order_product_name,
                    'product_category' => $item->order_product_category_name,
                    'product_variant' => $item->order_product_variant,
                    'order_qty' => $item->order_qty,
                    'price' => $item->order_product_original_price,
                ];
            });
        });

        $product_sold = $orderItems->filter(function ($item) {
            return $item['order_status'] === 'COMPLETE';
        })->sum('order_qty');

        $net_sales = $initialReports->filter(function ($report) {
            return $report->order_status === 'COMPLETE';
        })->sum('total_price');

        $expense = Expense::where('user_id', Auth::user()->id)
            ->whereBetween('created_at', [Carbon::parse($date)->startOfDay(), Carbon::parse($date)->endOfDay()])
            ->sum('item_price');

        $profit = $net_sales - $expense;

        return response()->json(
            [
                'net_sales' => $net_sales,
                'expense' => $expense,
                'product_sold' => $product_sold,
                'profit' => $profit,
                'ReportsForTheYear' => $ReportsForTheYear,
                'orderItems' => $orderItems,
            ],
            201
        );
    }
}
