<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function list_products(){
        $categories =Category::latest()->get();
        $products =Product::with('category')->latest()->get();

        return Inertia::render('dashboard/products/index',[
            'categories'=>$categories,
            'products'=>$products
        ]);
    }
    public function save_product(Request $request){
        $request->validate([
            'name'=>'string|required|max:255',
            'category_id'=>'string|required',
            'colors'=>'array|nullable',
            'features'=>'array|nullable',
            'description'=>'string|nullable',
            'image'=>'image|nullable|max:2048',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
            'is_featured' => 'boolean',
          ]);

        //   Slug
          $slug = Str::slug($request->name);
          $image ='';
          $images =[];

        //   Image
        if($request->hasFile('image')){
        $image = $request->file('image')->store('products','public');
        }

        $images = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $images[] = $image->store('products/images', 'public');
            }
        }

        $new_product =[
        'name' =>$request->name,
        'slug'=>$slug,
        'colors' =>$request->colors,
        'image'=>$image,
        'description'=>$request->description,
        'is_featured'=>$request->is_featured,
        'price'=>$request->price,
        'original_price'=>$request->original_price,
        'features'=>$request->features,
        'images'=>$images,
        'category_id'=>$request->category_id,
        ];

          $prod =Product::create($new_product);
        //   dd($prod);
          return to_route('dashboard.products.index');
    }
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(10);

        return inertia('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create()
    {
        $categories = Category::where('is_active', true)->get();

        return inertia('Admin/Products/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle main image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Handle gallery images upload
        if ($request->hasFile('gallery')) {
            $gallery = [];

            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('products/gallery', 'public');
            }

            $validated['gallery'] = $gallery;
        }

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully');
    }

    /**
     * Show the specified product
     */
    public function show(Product $product)
    {
        $product->load('category');

        return inertia('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the product
     */
    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->get();

        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the product
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|max:2048',
            'colors'=>'array|nullable',
            'features'=>'array|nullable',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        $image ='';
        $images =[];

        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($request->name);

        }

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products','public');
        } else {
            $validated['images'] = $product->image;
        }

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $images[] = $image->store('products/images', 'public');

            }
            $validated['images'] = $images;
        } else {
            $validated['images'] = $product->images;
        }

        $product->update($validated);
        return back(); 

        
    }

    /**
     * Remove the product
     */
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('dashboard.products.index')
            ->with('success', 'Product deleted successfully');
    }

    /**
     * Get dashboard data
     */
    public function dashboard()
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $featuredProducts = Product::where('is_featured', true)->count();
        $outOfStockProducts = Product::where('stock', 0)->count();

        $recentProducts = Product::with('category')
            ->latest()
            ->take(5)
            ->get();

        return inertia('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'featuredProducts' => $featuredProducts,
                'outOfStockProducts' => $outOfStockProducts,
            ],
            'recentProducts' => $recentProducts
        ]);
    }
}
