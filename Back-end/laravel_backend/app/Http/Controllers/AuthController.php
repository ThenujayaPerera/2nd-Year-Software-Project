<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'role' => 'user',
            'is_active' => true,
            'is_email_verified' => true,
            'is_phone_verified' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => 'laravel-token-' . $user->id . '-' . time(),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $email = strtolower(trim($request->email));
        $user = User::where('email', $email)->first();

        // Special fallback for admin credentials
        if ($email === 'admin@example.com' && ($request->password === 'admin123' || $request->password === '12345678')) {
            if (!$user) {
                $user = User::create([
                    'name' => 'Admin User',
                    'email' => 'admin@example.com',
                    'password' => Hash::make('admin123'),
                    'role' => 'admin',
                    'is_active' => true,
                    'is_email_verified' => true,
                    'is_phone_verified' => true,
                    'address' => '185/1/2B New Road, Ambalangoda, Sri Lanka',
                ]);
            }
            return response()->json([
                'user' => $user,
                'token' => 'laravel-token-admin-' . time(),
            ]);
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account has been deactivated. Please contact support.',
            ], 403);
        }

        return response()->json([
            'user' => $user,
            'token' => 'laravel-token-' . $user->id . '-' . time(),
        ]);
    }

    public function profile(Request $request)
    {
        $email = $request->query('email') ?? $request->header('X-User-Email');
        if (!$email) {
            return response()->json(['message' => 'Email required'], 400);
        }
        $user = User::where('email', strtolower(trim($email)))->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $email = $request->input('email') ?? $request->header('X-User-Email');
        if (!$email) {
            return response()->json(['message' => 'Email required'], 400);
        }
        $user = User::where('email', strtolower(trim($email)))->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($request->only(['name', 'phone', 'address']));
        return response()->json($user);
    }
}
