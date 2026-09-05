<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Number;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $revenue = Order::where('payment_status', 'success')->sum('total_amount');
        
        // Let's generate a mock chart array for visuals
        $revenueChart = [10, 20, 15, 30, 25, 40, 50, 45, 60, 55, 70];
        $orderChart = [2, 4, 3, 5, 4, 7, 6, 8, 5, 9, 10];
        $customerChart = [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 8];

        return [
            Stat::make('Total Revenue', '₦' . Number::format($revenue, 2))
                ->description('Total successful payments')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart($revenueChart)
                ->color('success'),

            Stat::make('Total Orders', Order::count())
                ->description('All time orders')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->chart($orderChart)
                ->color('primary'),

            Stat::make('Customers', User::where('role', 'customer')->count())
                ->description('Registered accounts')
                ->descriptionIcon('heroicon-m-users')
                ->chart($customerChart)
                ->color('info'),
        ];
    }
}
