'use client';
import { ProductItem } from '@/types/products';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, Tag } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Product type definition with discount properties
type Product = {
    id: string;
    name: string;
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
    description: string;
    image: string;
    category: string;
    rating: number;
    isNew?: boolean;
    favorite?: boolean;
    inCart?: boolean;
    stock: number;
};

// Sample product data with Unsplash images
// const sampleProducts: Product[] = [
//     {
//         id: '1',
//         name: 'Italian Leather Crossbody Bag',
//         originalPrice: 249.99,
//         discountPrice: 189.99,
//         discountPercentage: 24,
//         description: 'Handcrafted in Florence with premium full-grain leather',
//         image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Accessories',
//         rating: 4.9,
//         isNew: true,
//         stock: 15,
//     },
//     {
//         id: '2',
//         name: 'Automatic Chronograph Watch',
//         originalPrice: 599.99,
//         discountPrice: 449.99,
//         discountPercentage: 25,
//         description: 'Swiss-made movement with sapphire crystal and exhibition caseback',
//         image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Watches',
//         rating: 4.8,
//         stock: 8,
//     },
//     {
//         id: '3',
//         name: 'Premium Wireless Earbuds',
//         originalPrice: 199.99,
//         discountPrice: 149.99,
//         discountPercentage: 25,
//         description: 'Active noise cancellation with 30-hour battery life',
//         image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Electronics',
//         rating: 4.7,
//         stock: 22,
//     },
//     {
//         id: '4',
//         name: 'Pure Cashmere Sweater',
//         originalPrice: 299.99,
//         discountPrice: 199.99,
//         discountPercentage: 33,
//         description: 'Ultra-soft, sustainably sourced cashmere in a relaxed fit',
//         image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Clothing',
//         rating: 4.6,
//         stock: 10,
//     },
//     {
//         id: '5',
//         name: 'Smart Home Security Camera',
//         originalPrice: 179.99,
//         discountPrice: 129.99,
//         discountPercentage: 28,
//         description: '4K resolution with night vision and two-way audio',
//         image: 'https://images.unsplash.com/photo-1580745294621-2914fd8fee67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Electronics',
//         rating: 4.5,
//         isNew: true,
//         stock: 18,
//     },
//     {
//         id: '6',
//         name: 'Artisanal Ceramic Pour-Over Set',
//         originalPrice: 89.99,
//         discountPrice: 64.99,
//         discountPercentage: 28,
//         description: 'Hand-thrown ceramic pour-over coffee dripper with matching cup',
//         image: 'https://images.unsplash.com/photo-1516543647435-f8c78a45081f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Home & Kitchen',
//         rating: 4.7,
//         stock: 12,
//     },
//     {
//         id: '7',
//         name: 'Designer Sunglasses',
//         originalPrice: 159.99,
//         discountPrice: 99.99,
//         discountPercentage: 38,
//         description: 'Polarized lenses with premium acetate frames',
//         image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Accessories',
//         rating: 4.8,
//         stock: 9,
//     },
//     {
//         id: '8',
//         name: 'Luxury Scented Candle',
//         originalPrice: 69.99,
//         discountPrice: 49.99,
//         discountPercentage: 29,
//         description: 'Hand-poured soy wax with essential oils, 60-hour burn time',
//         image: 'https://images.unsplash.com/photo-1602178141046-c9fe5b7eade4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
//         category: 'Home & Decor',
//         rating: 4.6,
//         stock: 20,
//     },
// ];

// Product Card Component with discount
const ProductCard: React.FC<{
    product: ProductItem;

    onAddToCart: (id: number) => void;
}> = ({ product, onAddToCart }) => {
    const imagePath = `/storage/${product.images[0]}`;
    const discount = product.original_price - product.price;
    const discountPercentage = Math.round((discount / product.original_price) * 100);
    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-xl  bg-black shadow-md transition-all duration-300 hover:shadow-xl">
            {/* Image container with aspect ratio */}
            <div className="relative w-full overflow-hidden bg-gray-50 pb-[100%]">
                <img
                    src={imagePath}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 "
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discountPercentage > 0 && (
                        <span className="rounded-lg bg-black px-2 py-1 text-xs font-bold text-white shadow-sm">{discountPercentage}% OFF</span>
                    )}
                </div>

                {/* Quick actions overlay */}
                <div className="bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex translate-y-4 transform gap-2 transition-transform duration-300 group-hover:translate-y-0">
                        <Link
                            href={`/products/${product.slug}`}
                            className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-black shadow-md transition-colors duration-200 hover:bg-gray-100"
                        >
                            <Eye size={16} />
                            <span>View Product</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Product details */}
            <div className="flex flex-grow flex-col p-4">
                <div className="mb-1">
                    <span className="text-xs font-bold tracking-wider bg-white px-4 py-2 rounded-full text-black  ml-[-6px]">{product.category.name}</span>
                    <h3 className="mt-3 line-clamp-1 text-sm font-bold text-white uppercase">{product.name}</h3>
                </div>

                {/* <div className="mt-1 mb-3">
                    <StarRating rating={product.rating} />
                </div> */}

                <p className="mb-3 line-clamp-2 text-xs text-white">{product.description}</p>

                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
                    <div className="flex flex-col">
                        <span className="text-xs text-white line-through">${product.original_price}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-white">${discount}</span>
                            {/* <span className="text-xs font-medium text-red-500">
                Save $
                {(product.originalPrice - product.discountPrice).toFixed(2)}
              </span> */}
                        </div>
                    </div>

                    <button
                        onClick={() => onAddToCart(product.id)}
                        className={`} flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-black shadow-sm transition-all duration-200 hover:scale-105`}
                    >
                        <ShoppingCart size={16} />
                        <span className="text-xs font-medium ">Add to cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Carousel Component
const ProductListing = ({ products }: { products: ProductItem[] }) => {
    // const [products, setProducts] = useState<Product[]>(sampleProducts);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState(4);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Handle screen resize to adjust number of visible products
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setVisibleProducts(4);
            } else if (window.innerWidth >= 1024) {
                setVisibleProducts(3);
            } else if (window.innerWidth >= 768) {
                setVisibleProducts(2);
            } else {
                setVisibleProducts(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Navigation functions
    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1 >= products.length - visibleProducts + 1 ? 0 : prev + 1));
    }, [products.length, visibleProducts]);

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? Math.max(0, products.length - visibleProducts) : prev - 1));
    };

    // Add product to cart
    const addToCart = (id: number) => {
        console.log(id);
    };

    // Calculate displayed products
    // const displayedProducts = products.slice(currentIndex, Math.min(currentIndex + visibleProducts, products.length));

    // Auto scroll function
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, goToNext, products.length, visibleProducts]);

    return (
        <div className="mx-auto w-full max-w-7xl rounded-3xl  px-4 py-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="flex items-center gap-2 text-3xl font-bold pl-3 text-gray-900 dark:text-white">
                        <span className="relative">
                <div className='flex flex-col font-bold text-[30px] items-start justify-start text-start md:flex-col lg:flex-row'>
                <h1 className='text-white'>The latest.</h1>
                <h1 className='text-[#86868b]'> Take a look at what's new, right now.</h1>
            </div>
                        </span>
                    </h2>
                    
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={goToPrev}
                        className="rounded-full border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow"
                        aria-label="Previous products"
                    >
                        <ChevronLeft size={18} className="text-gray-700" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="rounded-full border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow"
                        aria-label="Next products"
                    >
                        <ChevronRight size={18} className="text-gray-700" />
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden" ref={carouselRef}>
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
                    }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3 xl:w-1/4">
                            <ProductCard product={product} onAddToCart={addToCart} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination dots */}
            <div className="mt-6 flex justify-center space-x-2">
                {Array.from({
                    length: Math.min(products.length - visibleProducts + 1, 8),
                }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            i === currentIndex ? 'w-6 bg-white' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* View all button */}
            <div className="mt-8 flex justify-center">
                <button className=" text-black rounded-lg border bg-white px-6 py-4 font-medium transition-colors duration-300 hover:bg-transparent hover:text-white hover:border-white">
                   <Link href={route('store')}>View all</Link>
                </button>
            </div>
        </div>
    );
};

export default ProductListing;
