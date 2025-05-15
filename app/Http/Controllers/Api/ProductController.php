<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all active products with filtering options
     */
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
        if ($request->has('category_id')) {
            $categoryId = $request->input('category_id');
            $query->where('category_id', $categoryId);
        }

        // Handle price filter
        if ($request->has('min_price') && $request->has('max_price')) {
            $minPrice = $request->input('min_price');
            $maxPrice = $request->input('max_price');
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        }

        // Handle featured filter
        if ($request->has('featured')) {
            $featured = $request->boolean('featured');
            $query->where('is_featured', $featured);
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

        $perPage = $request->input('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'products' => $products
        ]);
    }

    /**
     * Get a specific product by slug
     */
    public function show($slug)
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'product' => $product
        ]);
    }

    /**
     * Get similar products
     */
    public function similar($productId)
    {
        $similarProducts = Product::similar($productId)
            ->with('category')
            ->take(4)
            ->get();

        return response()->json([
            'products' => $similarProducts
        ]);
    }

    /**
     * Get featured products
     */
    public function featured()
    {
        $featuredProducts = Product::with('category')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->take(8)
            ->get();

        return response()->json([
            'products' => $featuredProducts
        ]);
    }
}