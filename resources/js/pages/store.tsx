
import ProductListing from '@/components/frontend/ProductListing';
import ShopFrontLayout from '@/layouts/shop-front-layout';
import { CategoryItem } from '@/types/categories';
import { ProductItem } from '@/types/products';

export default function store({ categories, products }: { categories: CategoryItem[]; products: ProductItem[] }) {
    console.log(products);
    return (
        <ShopFrontLayout>
            <div className="min-h-screen">
                <div className="container mx-auto max-w-6xl">
                    <div className="py-16">
                        
                    </div>
                    
                </div>
            </div>
        </ShopFrontLayout>
    );
}
