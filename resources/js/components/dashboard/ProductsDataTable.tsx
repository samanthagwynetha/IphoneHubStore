'use client';

import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, FileDown, Pencil, Plus, RefreshCw, Search, Trash } from 'lucide-react';

import * as React from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CategoryItem } from '@/types/categories';
import { CreateProductItem } from '@/types/products';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { CompactFileInput } from '../FormInputs/ImageUploadInput';
import InputError from '../input-error';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

export type Product = {
    id: string | number;
    name: string;
    category: CategoryItem;
    salesCount: number;
    image: string;
    stock: number;
    price: number;
    status: number;
    slug?: string;
    colors?: string;
    description?: string;
    is_featured?: boolean;
    original_price?: number;
    features?: string;
};

export default function ProductsDataTable({
    categories,
    products,
}: {
    products: Product[];
    categories: {
        label: string;
        value: number;
    }[];
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [productToEdit, setProductToEdit] = React.useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = React.useState<string | number | null>(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [images, setImages] = React.useState<File[]>([]);

    // Add/Edit form state
    const { data, setData, processing, errors, reset } = useForm<Required<CreateProductItem>>({
        name: '',
        slug: '',
        colors: '',
        image: null,
        description: '',
        is_featured: false,
        price: 0,
        original_price: 0,
        features: '',
        images: null,
        category_id: '1',
        stock: 0,
    });

    // Table columns
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <img
                        src={row.original.image.startsWith('products/') ? `/storage/${row.original.image}` : row.original.image}
                        alt={row.getValue('name')}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                    />
                </div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'price',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const price = Number.parseFloat(row.getValue('price'));
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(price);

                return <div>{formatted}</div>;
            },
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => {
                const name = row.original.category?.name || '';
                return (
                    <Button variant="outline" size="sm">
                        {name}
                    </Button>
                );
            },
        },
       
          
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(product)}
                        >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8"
                            onClick={() => handleDeleteClick(product.id)}
                        >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: products,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: rowsPerPage,
            },
        },
    });

    React.useEffect(() => {
        table.setPageSize(rowsPerPage);
    }, [rowsPerPage, table]);


const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    setData({
        name: product.name || '',
        slug: product.slug || '',
        colors: Array.isArray(product.colors) ? product.colors.join(',') : (product.colors || ''),
        image: null,
        description: product.description || '',
        is_featured: !!product.is_featured,
        price: product.price,
        original_price: product.original_price ?? 0,
        features: Array.isArray(product.features) ? product.features.join(',') : (product.features || ''),
        images: null,
        category_id: product.category?.id?.toString() || '1',
        stock: product.stock ?? 0,
    });
    setImages([]);
    setShowEditDialog(true);
};
    // Edit submit
    const handleEditSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (productToEdit) {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('slug', data.slug || '');
            formData.append('colors', typeof data.colors === 'string' ? data.colors : data.colors.join(','));
            formData.append('description', data.description || '');
            formData.append('is_featured', data.is_featured ? '1' : '0');
            formData.append('price', data.price.toString());
            formData.append('original_price', data.original_price.toString());
            formData.append('features', typeof data.features === 'string' ? data.features : data.features.join(','));
            formData.append('category_id', data.category_id.toString());
            formData.append('stock', data.stock.toString());
            formData.append('_method', 'PUT');
            if (images.length > 0) {
                formData.append('image', images[0]);
            }
            router.post(`/dashboard/products/${productToEdit.id}`, formData, {
                onSuccess: () => {
                    toast.success('Product updated successfully');
                    setShowEditDialog(false);
                    setProductToEdit(null);
                    setImages([]);
                    reset();
                },
                onError: (errors) => {
                    const firstError = errors && typeof errors === 'object' ? Object.values(errors)[0] : null;
                    toast.error(Array.isArray(firstError) ? firstError[0] : firstError || 'Failed to update product');
                }
            });
        }
    };

    // Delete
    const handleDeleteClick = (id: string | number) => {
        setProductToDelete(id);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (productToDelete) {
            router.delete(`/dashboard/products/${productToDelete}`, {
                onSuccess: () => {
                    toast.success('Product deleted successfully');
                    setShowDeleteDialog(false);
                    setProductToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete product');
                }
            });
        }
    };

    // Add
    const handleAddSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (images.length > 0) {
            data.image = images[0];
        }
        data.images = images;
        data.colors = typeof data.colors === 'string' ? data.colors.split(',') : data.colors;
        data.features = typeof data.features === 'string' ? data.features.split(',') : data.features;
        data.category_id = Number(data.category_id);
        router.post('/dashboard/products', data, {
            onSuccess: () => {
                reset();
                setImages([]);
                setShowAddDialog(false);
                toast.success('Product created successfully');
            },
            onError: () => {
                toast.error('Failed to create product');
            }
        });
    };

    // Export
    const handleExportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const rowData = row.original;
            return {
                ID: rowData.id,
                Name: rowData.name,
                Category: rowData.category?.name,
                Status: rowData.status,
                Stock: rowData.stock,
                'Sales Count': rowData.salesCount,
                Price: `$${rowData.price.toFixed(2)}`,
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'products.xlsx');
    };

    // Table value
    const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const formattedTotalValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(totalValue);

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                        <p className="text-muted-foreground text-sm">
                            {products.length} items | Total Value: USD {formattedTotalValue}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-rose-500 hover:bg-rose-600">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[750px]">
                                <form onSubmit={handleAddSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Add New Product</DialogTitle>
                                        <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Product Name</Label>
                                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="colors">Product Colors eg Navy Blue=#15317E</Label>
                                                <Input id="colors" value={data.colors} onChange={(e) => setData('colors', e.target.value)} />
                                                <InputError message={errors.colors} className="mt-2" />
                                            </div>
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="price">Price</Label>
                                                <Input id="price" value={data.price} onChange={(e) => setData('price', Number(e.target.value))} />
                                                <InputError message={errors.price} className="mt-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="original_price">Original Price</Label>
                                                <Input
                                                    id="original_price"
                                                    value={data.original_price}
                                                    onChange={(e) => setData('original_price', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category_id">Select Category</Label>
                                                <Select onValueChange={(value) => setData('category_id', value)} defaultValue={data.category_id?.toString()}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((item) => (
                                                            <SelectItem key={item.value} value={item.value.toString()}>
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="features">Product Features (comma separated) </Label>
                                                <Input id="features" value={data.features} onChange={(e) => setData('features', e.target.value)} />
                                                <InputError message={errors.features} className="mt-2" />
                                            </div>
                                            <div className="items-top flex space-x-2">
                                                <Checkbox
                                                    checked={data.is_featured}
                                                    onCheckedChange={(value) => setData('is_featured', !!value)}
                                                    id="isFeatured"
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="isFeatured"
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Is Featured
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', Number(e.target.value))}
                                                min={0}
                                            />
                                            <InputError message={errors.stock} className="mt-2" />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="grid w-full gap-1.5">
                                                <Label htmlFor="description">Product Description</Label>
                                                <Textarea
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Type your description here."
                                                    id="description"
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>
                                            <div>
                                                <h2 className="mb-3 text-lg font-semibold">Upload product Images</h2>
                                                <div className="rounded border p-4">
                                                    <CompactFileInput multiple={true} maxSizeMB={1} onChange={setImages} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button disabled={processing} type="submit">
                                            {processing ? 'Creating...' : 'Add Product'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {/* Edit Dialog */}
                        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                            <DialogContent className="sm:max-w-[750px]">
                                <form onSubmit={handleEditSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Edit Product</DialogTitle>
                                        <DialogDescription>Update the details of this product.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-name">Product Name</Label>
                                                <Input id="edit-name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-colors">Product Colors eg Navy Blue=#15317E</Label>
                                                <Input id="edit-colors" value={data.colors} onChange={(e) => setData('colors', e.target.value)} />
                                                <InputError message={errors.colors} className="mt-2" />
                                            </div>
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-price">Price</Label>
                                                <Input id="edit-price" value={data.price} onChange={(e) => setData('price', Number(e.target.value))} />
                                                <InputError message={errors.price} className="mt-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-original_price">Original Price</Label>
                                                <Input
                                                    id="edit-original_price"
                                                    value={data.original_price}
                                                    onChange={(e) => setData('original_price', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-category_id">Select Category</Label>
                                               <Select
                                                    value={data.category_id?.toString()}
                                                    onValueChange={(value) => setData('category_id', value)}
                                                >
                                                     
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((item) => (
                                                            <SelectItem key={item.value} value={item.value.toString()}>
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-features">Product Features (comma separated) </Label>
                                                <Input id="edit-features" value={data.features} onChange={(e) => setData('features', e.target.value)} />
                                                <InputError message={errors.features} className="mt-2" />
                                            </div>
                                            <div className="items-top flex space-x-2">
                                                <Checkbox
                                                    checked={data.is_featured}
                                                    onCheckedChange={(value) => setData('is_featured', !!value)}
                                                    id="edit-isFeatured"
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="edit-isFeatured"
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Is Featured
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', Number(e.target.value))}
                                                min={0}
                                            />
                                            <InputError message={errors.stock} className="mt-2" />
                                        </div>
                                                                                <div className="grid gap-4 md:grid-cols-2">
                                            <div className="grid w-full gap-1.5">
                                                <Label htmlFor="edit-description">Product Description</Label>
                                                <Textarea
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Type your description here."
                                                    id="edit-description"
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>
                                            <div>
                                                <h2 className="mb-3 text-lg font-semibold">Update product Images</h2>
                                                <div className="rounded border p-4">
                                                    <CompactFileInput multiple={true} maxSizeMB={1} onChange={setImages} />
                                                    {productToEdit?.image && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-muted-foreground">Current image:</p>
                                                            <img
                                                                src={productToEdit.image.startsWith('products/') ? `/storage/${productToEdit.image}` : productToEdit.image}
                                                                alt={productToEdit.name}
                                                                className="mt-2 h-16 w-16 rounded-md object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowEditDialog(false);
                                                setProductToEdit(null);
                                                reset();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button disabled={processing} type="submit">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* ...table and pagination as before... */}
                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            placeholder="Search..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="all-time">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select time period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-time">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="this-year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleExportToExcel} className="flex items-center gap-1">
                            <FileDown className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
                <div className="rounded-md">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Rows per page:</span>
                    <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="5" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-sm">
                        Showing {table.getState().pagination.pageIndex * rowsPerPage + 1}-
                        {Math.min((table.getState().pagination.pageIndex + 1) * rowsPerPage, table.getFilteredRowModel().rows.length)} of{' '}
                        {table.getFilteredRowModel().rows.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    {Array.from({ length: table.getPageCount() }).map((_, index) => (
                        <Button
                            key={index}
                            variant={table.getState().pagination.pageIndex === index ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => table.setPageIndex(index)}
                            className="h-8 w-8 p-0"
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </CardFooter>
            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the product.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}