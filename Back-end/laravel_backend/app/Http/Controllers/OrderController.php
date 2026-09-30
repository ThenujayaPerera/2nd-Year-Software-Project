<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $email = $request->query('email') ?? $request->header('X-User-Email');
        if ($email) {
            $orders = Order::with('items')
                ->where('user_email', strtolower(trim($email)))
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $orders = Order::with('items')->orderBy('created_at', 'desc')->get();
        }
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with('items')->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'userEmail' => 'required|string',
            'customerName' => 'required|string',
            'customerPhone' => 'nullable|string',
            'shippingAddress' => 'required|string',
            'city' => 'nullable|string',
            'postalCode' => 'nullable|string',
            'totalAmount' => 'required|numeric',
            'items' => 'required|array|min:1',
            'paymentMethod' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $orderNumber = 'NV-' . rand(100000, 999999);

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_email' => strtolower(trim($validated['userEmail'])),
                'customer_name' => $validated['customerName'],
                'customer_phone' => $validated['customerPhone'] ?? null,
                'shipping_address' => $validated['shippingAddress'],
                'city' => $validated['city'] ?? 'Ambalangoda',
                'postal_code' => $validated['postalCode'] ?? '80300',
                'subtotal' => $request->input('subtotal', $validated['totalAmount']),
                'tax' => $request->input('tax', 0.0),
                'shipping_cost' => $request->input('shippingCost', 0.0),
                'total_amount' => $validated['totalAmount'],
                'status' => 'PROCESSING',
                'payment_method' => $validated['paymentMethod'] ?? 'COD',
                'payment_status' => ($validated['paymentMethod'] ?? 'COD') === 'COD' ? 'PENDING' : 'SUCCESS',
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['productId'] ?? $item['id'] ?? null,
                    'product_name' => $item['productName'] ?? $item['name'] ?? 'Item',
                    'product_image' => $item['productImage'] ?? $item['image'] ?? null,
                    'price' => $item['price'] ?? 0.0,
                    'quantity' => $item['quantity'] ?? 1,
                    'subtotal' => ($item['price'] ?? 0.0) * ($item['quantity'] ?? 1),
                ]);
            }

            return response()->json($order->load('items'), 201);
        });
    }

    public function cancel($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $order->update(['status' => 'CANCELLED']);
        return response()->json($order);
    }
}
