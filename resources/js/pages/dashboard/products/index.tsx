import ProductsDataTable from '@/components/dashboard/ProductsDataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CategoryItem } from '@/types/categories';
import { ProductItem } from '@/types/products';
import { Head } from '@inertiajs/react';
import { Images } from 'lucide-react';
import { features } from 'process';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/dashboard/products',
    },
];

export default function Products({ categories, products }: { categories: CategoryItem[]; products: ProductItem[] }) {
    const data = products.map((item) => {
        return {
            id: item.id,
            name: item.name,
            category: item.category,
            // salesCount: 0,
            price: item.price,
            original_price: item.original_price,
            description: item.description,
            features: item.features,
            image: item.images?.[0] ?? null,
            Images: item.images ?? null,
            colors: item.colors,
            is_featured: item.is_featured,
            in_stock: item.in_stock
            // stock: 0,
            // status: item.in_stock ? 'in-stock' : 'out-stock',
        };
    });
    const categoryOptions = categories.map((item) => {
        return {
            label: item.name,
            value: item.id,
        };
    });
    console.log(products);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ProductsDataTable products={data} categories={categoryOptions} />
            </div>
        </AppLayout>
    );
}
