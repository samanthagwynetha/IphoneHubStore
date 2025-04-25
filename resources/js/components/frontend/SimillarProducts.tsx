import { SimilarProduct } from '@/types/products';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function SimilarProducts({ similarProducts }: { similarProducts: SimilarProduct[] }) {
    return (
        <div className="mt-16">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
                <div className="flex space-x-2">
                    <button className="rounded-full border border-gray-300 p-2 transition-all duration-200 hover:bg-gray-50">
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="rounded-full border border-gray-300 p-2 transition-all duration-200 hover:bg-gray-50">
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {similarProducts.map((product) => (
                    <a href="#" key={product.id} className="group block">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                width={500}
                                height={500}
                                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                            <div className="mt-1 flex items-center">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < Math.floor(product.rating)
                                                    ? '-yellow-400 text-yellow-400'
                                                    : i < product.rating
                                                      ? '-yellow-400 text-yellow-400 opacity-50'
                                                      : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="ml-2 text-xs text-gray-500">({product.reviewCount})</p>
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
