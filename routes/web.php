<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Shop\CategoryController as ShopCategoryController;
use App\Http\Controllers\Shop\ProductController as ShopProductController;
use Inertia\Inertia;

Route::get('/', [HomeController::class,'get_home_data'])->name('home');


Route::get('/products/{slug}', [HomeController::class,'show_detail'])->name('detail');


Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard/index');
    // })->name('dashboard');

    // Route::get('/store', function () {
    //     return Inertia::render('resources/js/components/frontend/StorePage.tsx');
    // })->name('store.index');

    // Route::get('/dashboard/products',[ProductController::class,'list_products'] )->name('dashboard.products.index');
    // Route::post('/dashboard/products',[ProductController::class,'save_product'] )->name('dashboard.products.save');


    // Route::get('/dashboard/categories',[CategoryController::class,'list_categories'] )->name('dashboard.categories.index');
    // Route::post('/dashboard/categories', [CategoryController::class,'save_category'])->name('dashboard.categories.save');
});

Route::get('/store', [ProductController::class, 'store'])->name('store');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard');
//     return Inertia::render('store'); // This must match the filename in your Pages folder
//     })->name('store');

    Route::get('/dashboard/products',[ProductController::class,'list_products'] )->name('dashboard.products.index');
    Route::post('/dashboard/products',[ProductController::class,'save_product'] )->name('dashboard.products.save');


    Route::get('/dashboard/categories',[CategoryController::class,'list_categories'] )->name('dashboard.categories.index');
    Route::post('/dashboard/categories', [CategoryController::class,'save_category'])->name('dashboard.categories.save');
    
});


Route::get('/users',[AuthenticatedSessionController::class,'getusers'] )->name('Users');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
