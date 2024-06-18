<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function GetCustomerReport(Request $request)
    {
        $user = Auth::user();

        $customerReport = Order::where('user_id', $user->id)->where('order_status', '!=', 'PENDING')->with('orderItems')->get();

        return $customerReport;
    }
}
