import ProductListing from '@/components/frontend/ProductListing';
import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopFrontLayout from '@/layouts/shop-front-layout';

export default function home() {
    return (
        <ShopFrontLayout>
            <div className="min-h-screen">
                <div className="container mx-auto max-w-6xl">
                    <ShopBanner />
                    <div className="py-16">
                        <ShopCategories />
                    </div>
                    <div className="py-8">
                        <ProductListing />
                    </div>
                </div>
            </div>
        </ShopFrontLayout>
    );
}
