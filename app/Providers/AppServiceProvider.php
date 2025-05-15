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
        //
        // Inertia::share([
        //     'cartItems' => function () {
        //         if (! Auth::check()) {
        //             return [];
        //         }
    
        //         return CartItem::with('product')
        //             ->where('user_id', Auth::id())
        //             ->get()
        //             ->map(fn($item) => [
        //                 'id'       => $item->id,
        //                 'quantity'      => $item->quantity,
        //                 'product'  => [
        //                     'id'    => $item->product->id,
        //                     'name'  => $item->product->name,
        //                     'price' => $item->product->price,
        //                     'image' => $item->product->image,
        //                     'images' => $item->product->image,
        //                     'in_stock' => $item->product->in_stock,
        //                 ],
        //             ]);
        //     },
        // ]);
    }
}
