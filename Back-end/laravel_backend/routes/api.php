<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes for NVSHOP.LK (2nd Year Software Project)
|--------------------------------------------------------------------------
*/

// Health Check
Route::get('/health', function () {
    return response()->json(['status' => 'OK', 'framework' => 'Laravel 11', 'timestamp' => now()]);
});

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/verify-otp', function () {
        return response()->json(['success' => true, 'message' => 'OTP verified successfully']);
    });
    Route::post('/verify-token', function () {
        return response()->json(['valid' => true]);
    });
});

// Product Catalog Routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::post('/', [ProductController::class, 'store']);
    Route::put('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
});

// Order Routes
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/my-orders', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::post('/', [OrderController::class, 'store']);
    Route::put('/{id}/cancel', [OrderController::class, 'cancel']);
});

// Admin Panel Routes
Route::prefix('admin')->group(function () {
    Route::get('/reports/sales', [AdminController::class, 'salesReport']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::put('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
    Route::put('/users/{id}/toggle-role', [AdminController::class, 'toggleUserRole']);
    Route::post('/users/create-admin', [AdminController::class, 'createAdmin']);
    Route::get('/payments', [AdminController::class, 'payments']);
});
