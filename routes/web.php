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
use App\Http\Controllers\CartController;


use Inertia\Inertia;

Route::get('/', [HomeController::class,'get_home_data'])->name('home');


Route::get('/products/{slug}', [HomeController::class,'show_detail'])->name('detail');
Route::get('/Allproducts', [HomeController::class,'getproducts'])->name('productlist');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/store', function () {
        // return Inertia::render('resources/js/components/frontend/StorePage.tsx');
        return Inertia::render('Store/Index');
    })->name('store.index');
});


Route::middleware(['auth', 'role:user'])->group(function () {
    Route::post('products/addCart', [CartController::class, 'add'])->name('add.cart');
    Route::get('/getCart', [CartController::class, 'getCartItems'])->name('get.cart');
    Route::patch('/updateItem/{id}', [CartController::class, 'update'])->name('get.cart');
    Route::delete('/removeItem/{id}', [CartController::class, 'destroy'])->name('remove.cart');
});
Route::get('/store', [ProductController::class, 'store'])->name('store');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard');

    Route::get('/dashboard/products',[ProductController::class,'list_products'] )->name('dashboard.products.index');
    Route::post('/dashboard/products',[ProductController::class,'save_product'] )->name('dashboard.products.save');


    Route::get('/dashboard/categories',[CategoryController::class,'list_categories'] )->name('dashboard.categories.index');
    Route::post('/dashboard/categories', [CategoryController::class,'save_category'])->name('dashboard.categories.save');

    Route::put('/dashboard/categories/{category}', [CategoryController::class, 'update'])->name('dashboard.categories.update');
    Route::delete('/dashboard/categories/{category}', [CategoryController::class, 'destroy'])->name('dashboard.categories.destroy');
});

Route::get('/users',[AuthenticatedSessionController::class,'getusers'] )->name('Users');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
