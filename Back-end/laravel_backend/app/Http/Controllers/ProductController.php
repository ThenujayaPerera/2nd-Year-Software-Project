<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = strtolower($request->search);
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(brand) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(category) LIKE ?', ["%{$s}%"]);
            });
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'brand' => 'nullable|string',
            'stock' => 'required|integer',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'warranty' => 'nullable|string',
            'originalPrice' => 'nullable|numeric',
            'returnPeriod' => 'nullable|string',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'original_price' => $request->input('originalPrice', $validated['price']),
            'category' => $validated['category'],
            'brand' => $validated['brand'] ?? 'Generic',
            'stock' => $validated['stock'],
            'image' => $validated['image'] ?? 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600',
            'description' => $validated['description'] ?? '',
            'warranty' => $validated['warranty'] ?? '1 Year Warranty',
            'return_period' => $request->input('returnPeriod', '7 Days'),
            'rating' => 5.0,
            'reviews' => 1,
            'discount' => 10,
            'is_new' => true,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $data = $request->only([
            'name', 'price', 'category', 'brand', 'stock',
            'image', 'description', 'warranty', 'discount', 'is_new'
        ]);

        if ($request->has('originalPrice')) {
            $data['original_price'] = $request->input('originalPrice');
        }
        if ($request->has('returnPeriod')) {
            $data['return_period'] = $request->input('returnPeriod');
        }

        $product->update($data);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
