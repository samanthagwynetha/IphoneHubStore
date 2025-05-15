<?php

namespace App\Providers;
use Inertia\Inertia;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'shared.cartItems' => function () {
              if (! auth()->check()) return [];
              return CartItem::with('product')
                  ->where('user_id', auth()->id())
                  ->get();
            },
          ]);
    }
}
