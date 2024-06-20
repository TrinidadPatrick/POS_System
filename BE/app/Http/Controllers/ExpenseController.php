<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $startOfDay = Carbon::today()->startOfDay();
        $endOfDay = Carbon::today()->endOfDay();

        $expenses = Expense::where('user_id', Auth::user()->id)->whereBetween('created_at', [$startOfDay, $endOfDay])->get();
        // return $startOfDay;
        return response()->json(['expenses' => $expenses], 201);
    }

    public function filterShow(Request $request)
    {
        $startOfDay = $request->query('start_date');
        $endOfDay = $request->query('end_date');
        $search = $request->query('search');

        $query = Expense::where('user_id', Auth::user()->id);

        if ($startOfDay && $endOfDay) {
            $query->whereBetween('created_at', [Carbon::parse($startOfDay)->startOfDay(), Carbon::parse($endOfDay)->endOfDay()]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', '%' . $search . '%');
            });
        }

        $expenses = $query->get();
        return response()->json(['expenses' => $expenses], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:150',
            'item_price' => 'required|numeric|max:999999',
        ]);
        $validated['user_id'] = Auth::user()->id;
        try {
            $expense = Expense::create($validated);
            return response()->json(['message' => 'Expense successfuly added.', 'expense' => $expense], 201);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Failed to add expense, please try again later.', 'error' => $ex], 500);
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
        $validated = $request->validate([
            'item_name' => 'required|string|max:150',
            'item_price' => 'required|numeric|max:999999'
        ]);

        $expense = Expense::findOrFail($id);
        $updated = $expense->update($validated);

        return response()->json(['message' => 'Expense updated.', 'expense' => $updated], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return response()->json(['message' => 'Expense deleted.'], 201);
    }
}
