<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class CartController extends Controller
{
    // Add item to cart
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Increment quantity if item already exists
            $cartItem->quantity += $request->quantity ?? 1;
            $cartItem->save();
        } else {
            // Create new cart item
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $product->id,
                'quantity' => $request->quantity ?? 1,
                // 'price' => $product->price, // store current price
            ]);
        }

        // return response()->json(['message' => 'Product added to cart successfully']);
        return Inertia::location(url()->previous()); // this acts like a soft redirect

        // return redirect()->back()->with('message', 'Cart item updated successfully');
    }

    public function update(Request $request, $id)
    {
        // $request->validate([
        //     'quantity' => 'required|integer|min:1',
        // ]);

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($request->type === 'increase') {
            $cartItem->quantity += 1;
        } elseif ($request->type === 'decrease' && $cartItem->quantity > 1) {
            $cartItem->quantity -= 1;
        }
        
        // $cartItem->quantity = $request->quantity;
        $cartItem->save();
        return back(); 


    }

    public function getCartItems()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
    
        $cartItems = CartItem::with('product')
            ->where('user_id', $userId)
            ->get();
    
        return response()->json(['cartItems' => $cartItems]);
    }



    // Delete cart item
    public function destroy($id)
    {
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $cartItem->delete();

        return redirect()->back()->with('message', 'Cart item updated successfully');
    }
}
