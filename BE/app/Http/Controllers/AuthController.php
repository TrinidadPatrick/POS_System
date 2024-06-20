<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(StoreUserRequest $request)
    {

        $data = $request->validated();

        $user = User::create($data);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('API token of ' . $user->name)->plainTextToken
        ], 200);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => "Email or password is invalid",
            ], 401);
        }

        // Meaning succesfull login
        $user = User::where('email', $data['email'])->first();

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('API token of ' . $user->name)->plainTextToken
        ], 200);
    }

    public function updateUser(Request $request, string $id)
    {

        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'store_name' => 'sometimes|string|max:255',
            'profile_picture' => '',
            'password' => '',
            'currentPassword' => '',
        ]);


        if (Auth::user()->id === $user->id) {
            // Meaning password was meant to be changed
            if (!empty($validated['password'])) {
                // Check if the current password input is correct
                if (!Hash::check($validated['currentPassword'], $user->password)) {
                    return response()->json(['message' => 'The current password is incorrect.'], 403);
                } else {
                    // Remove the current password request
                    unset($validated['currentPassword']);
                    // Hash the new password
                    $validated['password'] = bcrypt($validated['password']);

                    $user->update($validated);

                    return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
                }
                // Meaning dont change the Password
            } else {
                // Remove the current password request
                unset($validated['currentPassword']);
                unset($validated['password']);

                $user->update($validated);

                return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
            }
        }
    }

    public function logout()
    {

        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
