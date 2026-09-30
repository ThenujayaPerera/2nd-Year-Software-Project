<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function salesReport()
    {
        $totalRevenue = Order::where('status', '!=', 'CANCELLED')->sum('total_amount');
        $totalOrders = Order::count();
        $pendingOrders = Order::whereIn('status', ['PROCESSING', 'PENDING', 'CONFIRMED'])->count();
        $completedOrders = Order::where('status', 'DELIVERED')->count();
        $totalProducts = Product::count();

        $lowStockProducts = Product::where('stock', '<=', 5)->get();
        $lowStockCount = $lowStockProducts->count();

        return response()->json([
            'totalRevenue' => (double)$totalRevenue,
            'totalOrders' => (int)$totalOrders,
            'pendingOrders' => (int)$pendingOrders,
            'completedOrders' => (int)$completedOrders,
            'totalProducts' => (int)$totalProducts,
            'lowStockCount' => (int)$lowStockCount,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }

    public function orders()
    {
        $orders = Order::with('items')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->update(['status' => $request->input('status')]);
        return response()->json($order);
    }

    public function users()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    public function toggleUserStatus($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update(['is_active' => !$user->is_active]);
        return response()->json($user);
    }

    public function toggleUserRole($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $nextRole = $user->role === 'admin' ? 'user' : 'admin';
        $user->update(['role' => $nextRole]);
        return response()->json($user);
    }

    public function createAdmin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? '185/1/2B New Road, Ambalangoda, Sri Lanka',
            'role' => 'admin',
            'is_active' => true,
            'is_email_verified' => true,
            'is_phone_verified' => true,
        ]);

        return response()->json($admin, 201);
    }

    public function payments()
    {
        $orders = Order::select('id', 'order_number', 'customer_name', 'payment_method', 'total_amount', 'payment_status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders);
    }
}
