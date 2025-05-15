<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function save_category(Request $request){
      $request->validate([
        'name'=>'string|required|max:255',
        'color'=>'string|required',
        'description'=>'string|nullable',
        'image'=>'image|nullable|max:2048'
      ]);

    //   Slug
      $slug = Str::slug($request->name);
      $image ='';
    //   Image
    if($request->hasFile('image')){
        $image = $request->file('image')->store('categories','public');
    }
      $new_category =[
        'name'=> $request->name,
        'slug'=>$slug,
        'image'=> $image,
        'color'=> $request->color,
    ];
      $cat =Category::create($new_category);

      return to_route('dashboard.categories.index');

    }

    public function list_categories(){
        $categories =Category::latest()->get();

        return Inertia::render('dashboard/categories/index',[
            'categories'=>$categories
        ]);
    }
     public function index()
    {
        $categories = Category::withCount('products')->latest()->paginate(10);

        return inertia('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new category
     */
    public function create()
    {
        return inertia('Admin/Categories/Create');
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully');
    }

    /**
     * Show the specified category
     */
    public function show(Category $category)
    {
        $category->load('products');

        return inertia('Admin/Categories/Show', [
            'category' => $category
        ]);
    }

    /**
     * Show the form for editing the category
     */
    public function edit(Category $category)
    {
        return inertia('Admin/Categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the category
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        // Generate slug
        if ($validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully');
    }

    /**
     * Remove the category
     */
    public function destroy(Category $category)
    {
        // Delete image if exists
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully');
    }
}
