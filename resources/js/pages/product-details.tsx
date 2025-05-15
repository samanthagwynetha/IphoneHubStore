'use client';
import SimilarProducts from '@/components/frontend/SimillarProducts';
import ShopFrontLayout from '@/layouts/shop-front-layout';
import { SimilarProduct } from '@/types/products';
// ProductDetail.tsx
import { Check, ChevronRight, Heart, Share2, ShoppingCart } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

// Types
interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    description: string;
    features: string[];
    images: string[];
    colors: string[];
    sizes: string[];
    in_stock: boolean;
}

const ProductDetails = ({ product, similarProducts }: { product: Product; similarProducts: SimilarProduct }) => {
    console.log(product, similarProducts);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);

    const [quantity, setQuantity] = useState(1);

    const addToCart: React.MouseEventHandler = (e) => {
        e.preventDefault();
    
        const data = {
            product_id: product.id,
            quantity: quantity,
        };
    
        router.post('/products/addCart', data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Added to cart!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to add to cart.');
            },
        });
    };

    
    return (
        <ShopFrontLayout>
            <div className="mx-auto max-w-6xl bg-white px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex text-sm">
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                        Home
                    </a>
                    <ChevronRight className="mx-2 h-4 w-4 self-center text-gray-400" />
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                        Office Furniture
                    </a>
                    <ChevronRight className="mx-2 h-4 w-4 self-center text-gray-400" />
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                        Chairs
                    </a>
                    <ChevronRight className="mx-2 h-4 w-4 self-center text-gray-400" />
                    <span className="font-medium text-gray-900">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Product Images */}
                    <div className="space-y-6">
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                            <img
                                src={`/storage/${product.images[selectedImage]}`}
                                alt={product.name}
                                className="object-cover transition-all duration-300 hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <div className="flex space-x-4 overflow-auto pb-2">
                            {product.images.map((image, index) => {
                                const imagePath = `/storage/${image}`;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ${
                                            selectedImage === index ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200'
                                        }`}
                                    >
                                        <img src={imagePath} alt={`${product.name} - View ${index + 1}`} className="object-cover" sizes="80px" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            {/* <div className="mt-2 flex items-center">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${
                                                i < Math.floor(product.rating)
                                                    ? '-yellow-400 text-yellow-400'
                                                    : i < product.rating
                                                      ? '-yellow-400 text-yellow-400 opacity-50'
                                                      : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="ml-2 text-sm text-gray-500">
                                    {product.rating} ({product.reviewCount} reviews)
                                </p>
                            </div> */}
                        </div>

                        <div className="border-t border-b py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">${product.price}</p>
                                    {product.originalPrice && (
                                        <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <div className={`h-3 w-3 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                                    <p className={`text-sm ${product.in_stock ? 'text-green-700' : 'text-red-700'}`}>
                                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                <div className="mt-2 flex space-x-3">
                                {product.colors && product.colors.length > 0 && product.colors.map((colorStr, index) => {
                                    const [name, value] = colorStr.split('=');
                                    const color = { name, value };
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(index)}
                                            className={`relative h-10 w-10 rounded-full ${
                                                selectedColor === index ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                                            }`}
                                            title={color.name}
                                        >
                                            <span
                                                className="absolute inset-0 rounded-full"
                                                style={{ backgroundColor: color.value }}
                                            ></span>
                                        </button>
                                    );
                                })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                                <div className="mt-2 flex w-32 items-center rounded-md border border-gray-200">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                                    >
                                        -
                                    </button>
                                    <span className="flex-1 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-500 hover:text-gray-700">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button onClick={addToCart} className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                                <div className="flex items-center justify-center">
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart
                                </div>
                            </button>
                            <button className="rounded-md border border-gray-300 p-3 transition-all duration-200 hover:bg-gray-50">
                                <Heart className="h-5 w-5 text-gray-500" />
                            </button>
                            <button className="rounded-md border border-gray-300 p-3 transition-all duration-200 hover:bg-gray-50">
                                <Share2 className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-sm font-medium text-gray-900">Product Description</h3>
                            <p className="mt-2 leading-relaxed text-gray-600">{product.description}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Features</h3>
                            <ul className="mt-2 space-y-2">
                                {product.features.map((feature, index) => {
                                    return (
                                        <li key={index} className="flex items-start">
                                            <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Similar Products */}
                <SimilarProducts similarProducts={similarProducts} />
            </div>
        </ShopFrontLayout>
    );
};

export default ProductDetails;
