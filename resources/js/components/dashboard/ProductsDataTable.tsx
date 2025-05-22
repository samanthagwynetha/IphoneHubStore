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
import { Link, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { CompactFileInput } from '../FormInputs/ImageUploadInput';
import InputError from '../input-error';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { useEffect } from 'react';

// export type Product = {
//     id: string;
//     name: string;
//     category: CategoryItem;
//     salesCount: number;
//     image: string;
//     stock: number;
//     price: number;
//     status: 'in-stock' | 'out-stock';
// };

export interface Product {
    id: number;
    name: string;
    slug: string;
    category: CategoryItem;
    price: number;
    original_price: number;
    description: string;
    features: string;
    image: string | null;
    images: string | null;
    colors: string;
    is_featured: boolean;
    in_stock: boolean;
}

// export interface CategoryItem {
//     id: number;
//     name: string;
//     slug: string;
//     image: string;
//     description: string;
//     color: string;
// }


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
    // --- Edit dialog state
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [productToEdit, setProductToEdit] = React.useState<Product | null>(null);
    const [editImages, setEditImages] = React.useState<File[]>([]);

    React.useEffect(() => {
        setEditData('image', editImages[0]);
        setEditData('images', editImages);
      }, [editImages]);

    const {
        data: editData,
        setData: setEditData,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
      } = useForm<{
        name: string;
        category_id: number;
        colors: string;
        price: number;
        original_price: number;
        features: string;
        description: string;
        is_featured: boolean;
        image: File | null;
        images: File[] | null;
      }>({
        name: '',
        category_id: 0,
        colors: '',
        price: 0,
        original_price: 0,
        features: '',
        description: '',
        is_featured: false, // default value is false, but type is boolean
        image: null,
        images: null,
      });

    useEffect(() => {
        console.log('productToEdit');
        console.log(productToEdit);
    }, [productToEdit]);

    useEffect(() => {
        console.log('editData');
        console.log(editData);
    }, [editData]);


    // --- Table columns
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'images',
            header: 'Image',
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <img
                        src={`/storage/${row.original.image}`}
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
                const name = row.original.category.name;
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                            setProductToEdit(row.original);
                            setEditData({
                                name: row.original.name,
                                colors: row.original.colors, 
                                price: row.original.price,
                                original_price: row.original.original_price,
                                features: row.original.features, // Fill with actual data if available
                                description: row.original.description, // Fill with actual data if available
                                is_featured: row.original.is_featured, // Fill with actual data if available
                                category_id: row.original.category?.id,
                                image: null,
                                images: null,
                            });
                            setShowEditDialog(true);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={()=>{handleDelete(row.original.id)}}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            ),
        },
    ];

    // --- Table logic
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

    // --- Add product form
    const [images, setImages] = React.useState<File[]>([]);
    const { data, setData, processing, errors, reset } = useForm<Required<CreateProductItem>>({
        name: '',
        slug: '',
        colors: '',
        image: null,
        description: '',
        is_featured: true,
        price: 0,
        original_price: 0,
        features: '',
        images: null,
        category_id: '1',
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        data.image = images[0];
        data.images = images;
        data.colors = typeof data.colors === 'string' ? data.colors.split(',') : data.colors;
        data.features = typeof data.features === 'string' ? data.features.split(',') : data.features;
        data.category_id = Number(data.category_id);
        
        router.post('/dashboard/products', data, {
            onSuccess: () => {
                reset();
                toast.success('Product Successfully');
                setShowAddDialog(false);
            },
        });
    };
    
    // --- Edit product form
    const submitEdit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (!productToEdit) return;
    
        data.name = editData.name;
        data.colors = editData.colors;
        data.image = editData.image;
        data.description = editData.description;
        data.is_featured = editData.is_featured;
        data.price = editData.price;
        data.original_price = editData.original_price;
        data.features = editData.features;
        data.images = editData.images;
        data.category_id = editData.category_id;

        router.post(`/dashboard/products/${productToEdit.id}`, data, {
            onSuccess: () => {
                resetEdit();
                setShowEditDialog(false);
                setProductToEdit(null);
                toast.success('Product updated!');
            },
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await router.delete(`/dashboard/products/${id}`, {
                onFinish: () => {
                    toast.success('Product deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete product');
                }
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete product');
        }
    }
    
    // --- Export to Excel
    const handleExportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const rowData = row.original;
            return {
                ID: rowData.id,
                Name: rowData.name,
                Category: rowData.category,
                // Status: rowData.,
                // Stock: rowData.stock,
                // 'Sales Count': rowData.salesCount,
                Price: `$${rowData.price.toFixed(2)}`,
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'products.xlsx');
    };

    // --- Total value
    const totalValue = products.reduce((sum, product) => sum + product.price * 5, 0);
    
    const formattedTotalValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
    }).format(totalValue);

    // --- Edit Dialog JSX
    const editDialog = (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-[750px]">
                <form onSubmit={submitEdit}>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>Update the product details below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Product Name</Label>
                                <Input id="edit-name" value={editData.name} onChange={e => setEditData('name', e.target.value)} />
                                <InputError message={editErrors.name} className="mt-2" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-colors">Product Colors</Label>
                                <Input id="edit-colors" value={editData.colors} onChange={e => setEditData('colors', e.target.value)} />
                                <InputError message={editErrors.colors} className="mt-2" />
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price</Label>
                                <Input id="edit-price" value={editData.price} onChange={e => setEditData('price', Number(e.target.value))} />
                                <InputError message={editErrors.price} className="mt-2" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-original-price">Original Price</Label>
                                <Input id="edit-original-price" value={editData.original_price} onChange={e => setEditData('original_price', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Select Category</Label>
                                <Select onValueChange={value => setEditData('category_id', Number(value))} value={String(editData.category_id)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(item => (
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
                                <Label htmlFor="edit-features">Product Features (comma separated)</Label>
                                <Input id="edit-features" value={editData.features} onChange={e => setEditData('features', e.target.value)} />
                                <InputError message={editErrors.features} className="mt-2" />
                            </div>
                            <div className="items-top flex space-x-2">
               
                            <Checkbox
                                checked={editData.is_featured}
                                onCheckedChange={(value) => setEditData('is_featured', value as boolean)}
                                id="edit-isFeatured"
                            />
                                                        <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="edit-isFeatured" className="text-sm leading-none font-medium">
                                        Is Featured
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="edit-description">Product Description</Label>
                                <Textarea
                                    value={editData.description}
                                    onChange={e => setEditData('description', e.target.value)}
                                    placeholder="Type your description here."
                                    id="edit-description"
                                />
                                <InputError message={editErrors.description} className="mt-2" />
                            </div>
                            <div>
                                <h2 className="mb-3 text-lg font-semibold">Upload product Images</h2>
                                <div className="rounded border p-4">
                                    <CompactFileInput multiple={true} maxSizeMB={1} onChange={setEditImages} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline"  type="button" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button disabled={editProcessing} type="submit">
                            {editProcessing ? 'Updating...' : 'Update Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );

    return (
        <Card className="w-full">
            {editDialog}
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                        <p className="text-muted-foreground text-sm">
                            {products.length} items | Total Value: USD {formattedTotalValue}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
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
                                <form action="" onSubmit={submit}>
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
                                                <Label htmlFor="category">Product Colors eg Navy Blue=#15317E</Label>
                                                <Input id="category" value={data.colors} onChange={(e) => setData('colors', e.target.value)} />
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
                                                <Label htmlFor="category">Original Price</Label>
                                                <Input
                                                    id="original_price"
                                                    value={data.original_price}
                                                    onChange={(e) => setData('original_price', Number(e.target.value))}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="category">Select Category</Label>
                                                <Select onValueChange={(value) => setData('category_id', value)} defaultValue={'1'}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((item) => {
                                                            return (
                                                                <SelectItem key={item.value} value={item.value.toString()}>
                                                                    {item.label}
                                                                </SelectItem>
                                                            );
                                                        })}
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
                                                    onCheckedChange={(value) => setData('is_featured', value as boolean)}
                                                    id="isFeatured"
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="terms1"
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Is Featured
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="grid w-full gap-1.5">
                                                <Label htmlFor="message">Product Description</Label>
                                                <Textarea
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Type your description here."
                                                    id="message"
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>
                                            <div className="">
                                                <h2 className="mb-3 text-lg font-semibold">Upload product Images</h2>
                                                <div className="rounded border p-4">
                                                    <CompactFileInput multiple={true} maxSizeMB={1} onChange={setImages} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" type="button" onClick={() => setShowAddDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button disabled={processing} type="submit">
                                            {processing ? 'Creating...' : 'Add Product'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
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

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete {table.getFilteredSelectedRowModel().rows.length} selected product(s). This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {}} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

