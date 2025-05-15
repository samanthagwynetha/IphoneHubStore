<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::all();
        $products = []; // You can fetch products here if needed

        return Inertia::render('home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
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

    public function edit($id)
    {
        $category = Category::findOrFail($id);

        return Inertia::render('categories/EditCategory', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $category->id,
            'color' => 'nullable|string|max:32',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return redirect()->route('dashboard.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->back();
    }
}
