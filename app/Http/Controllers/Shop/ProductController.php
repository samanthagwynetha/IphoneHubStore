<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
     public function index(Request $request)
    {
        $query = Product::with('category')
            ->where('is_active', true);

        // Handle search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Handle category filter
        if ($request->has('category')) {
            $categoryId = $request->input('category');
            $query->where('category_id', $categoryId);
        }

        // Handle price filter
        if ($request->has('min_price') && $request->has('max_price')) {
            $minPrice = $request->input('min_price');
            $maxPrice = $request->input('max_price');
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        }

        // Handle sorting
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(12);
        $categories = Category::where('is_active', true)->get();

        return inertia('Shop/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'min_price', 'max_price', 'sort'])
        ]);
          
    }

    /**
     * Display the specified product
     */
    public function show($slug)
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Get similar products
        $similarProducts = Product::similar($product->id)
            ->take(4)
            ->get();

        return inertia('Shop/Products/Show', [
            'product' => $product,
            'similarProducts' => $similarProducts
        ]);
    }

    /**
     * Get featured products for homepage
     */
    public function featured()
    {
        $featuredProducts = Product::with('category')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->take(8)
            ->get();

        return inertia('Shop/Home', [
            'featuredProducts' => $featuredProducts
        ]);
    }

    /**
     * Get similar products
     */
    public function similar($productId)
    {
        $similarProducts = Product::similar($productId)
            ->take(4)
            ->get();

        return response()->json([
            'products' => $similarProducts
        ]);
    }
}


