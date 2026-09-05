<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin user
        User::create([
            'name'     => 'Petals Admin',
            'email'    => 'admin@petalslagos.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Test customer
        User::create([
            'name'     => 'Test Customer',
            'email'    => 'customer@example.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
        ]);

        $this->call(ProductSeeder::class);
    }
}
