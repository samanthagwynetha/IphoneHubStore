'use client';
import { ProductItem } from '@/types/products';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, Tag } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';


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

// Product Card Component with discount
const ProductCard: React.FC<{
    product: ProductItem;
    // onAddToCart: (id: number) => void;
}> = ({ product }) => {

    const addToCart: React.MouseEventHandler = (e) => {
        console.log('addtocart')
        e.preventDefault();
    
        const data = {
            product_id: product.id,
            quantity: 1,
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

    const imagePath = `/storage/${product.images[0]}`;
    const discount = product.original_price - product.price;
    const discountPercentage = Math.round((discount / product.original_price) * 100);

    function onAddToCart(id: number): void {
        console.log(id);
    }

    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-xl  bg-black shadow-md transition-all duration-300 hover:shadow-xl">
            {/* Image container with aspect ratio */}
            <div className="relative w-full overflow-hidden bg-gray-50 pb-[100%]">
                <img
                    src={imagePath}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discountPercentage > 0 && (
                        <span className="rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">{discountPercentage}% OFF</span>
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
                        onClick={addToCart}
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
                <div className='flex flex-col font-bold text-[40px] items-start justify-start text-start md:flex-col lg:flex-row'>
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
                            i === currentIndex ? 'w-6 bg-red-500' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* View all button */}
            <div className="mt-8 flex justify-center">
                <button className=" text-black rounded-lg border bg-white px-6 py-4 font-medium transition-colors duration-300 hover:bg-transparent hover:text-white hover:border-white">
                    View All Sales
                </button>
            </div>
        </div>
    );
};

export default ProductListing;
