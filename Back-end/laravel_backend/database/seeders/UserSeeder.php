<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'phone' => '+94 77 747 0186',
                'role' => 'admin',
                'is_active' => true,
                'is_email_verified' => true,
                'is_phone_verified' => true,
                'address' => '185/1/2B New Road, Ambalangoda, Sri Lanka',
            ]
        );

        // Customer User
        User::updateOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('user123'),
                'phone' => '+94 76 989 0079',
                'role' => 'user',
                'is_active' => true,
                'is_email_verified' => true,
                'is_phone_verified' => true,
                'address' => 'Colombo, Sri Lanka',
            ]
        );

        User::updateOrCreate(
            ['email' => 'khimasha16@gmail.com'],
            [
                'name' => 'Kulashi Himasha',
                'password' => Hash::make('12345678'),
                'phone' => '+94 76 227 7566',
                'role' => 'user',
                'is_active' => true,
                'is_email_verified' => true,
                'is_phone_verified' => true,
                'address' => '185/1/2B New Road, Ambalangoda, Sri Lanka',
            ]
        );
    }
}
