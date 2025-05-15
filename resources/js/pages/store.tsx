import ProductListing from '@/components/frontend/ProductListing';
import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopFrontLayout from '@/layouts/shop-front-layout';
import { CategoryItem } from '@/types/categories';
import { ProductItem } from '@/types/products';

export default function store({ categories, products }: { categories: CategoryItem[]; products: ProductItem[] }) {
    console.log(products);
    return (
        <ShopFrontLayout>
            <div className="min-h-screen">
                <div className="container mx-auto max-w-6xl ">
                    <ShopBanner />
                     <div className="py-8 mt-50">
                        <ProductListing products={products} />
                    </div>
                    
                </div>
            </div>
        </ShopFrontLayout>
    );
}
