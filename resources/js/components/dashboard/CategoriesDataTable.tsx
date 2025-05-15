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
import { CategoryItem, CreateCategoryItem } from '@/types/categories';
import { Link, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { CompactFileInput } from '../FormInputs/ImageUploadInput';
import InputError from '../input-error';
import { Textarea } from '../ui/textarea';

export type Product = {
    id: string;
    name: string;
    category: string;
    salesCount: number;
    image: string;
    stock: number;
    price: number;
    status: 'in-stock' | 'out-stock';
};

export default function CategoriesDataTable({ categories }: { categories: CategoryItem[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(null);
    const [categoryToEdit, setCategoryToEdit] = React.useState<CategoryItem | null>(null);
    const [images, setImages] = React.useState<File[]>([]);
    
    // Form for adding new categories
    const { data, setData, processing, errors, reset } = useForm<Required<CreateCategoryItem>>({
        name: '',
        slug: '',
        color: '',
        image: null,
        description: '',
    });
    
    // Form for editing categories
    const editForm = useForm<Required<CreateCategoryItem>>({
        name: '',
        slug: '',
        color: '',
        image: null,
        description: '',
    });
    
    // Define columns with updated action buttons
    const columns: ColumnDef<CategoryItem>[] = [
        {
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row }) => {
                const imagePath = row.original.image.startsWith('categories/') ? `/storage/${row.original.image}` : row.original.image;
                return (
                    <div className="flex items-center justify-center">
                        <img src={imagePath} alt={row.getValue('name')} width={40} height={40} className="rounded-md object-cover" />
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditClick(category)}
                        >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive h-8 w-8"
                            onClick={() => handleDeleteClick(String(category.id))}
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
        data: categories,
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

    // Handle Delete button click
    const handleDeleteClick = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setShowDeleteDialog(true);
    };

    // Handle actual deletion
    const handleDeleteConfirm = () => {
        if (categoryToDelete) {
            router.delete(`/dashboard/categories/${categoryToDelete}`, {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                    setShowDeleteDialog(false);
                    setCategoryToDelete(null);
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Failed to delete category');
                }
            });
        }
    };

    // Handle bulk deletion of selected rows
    const handleDeleteSelected = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedIds = selectedRows.map(row => row.original.id);
        
        // Submit each delete request sequentially
        Promise.all(selectedIds.map(id => 
            fetch(`/dashboard/admin/categories/${id}/destroy`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            })
        ))
        .then(() => {
            toast.success(`${selectedIds.length} categories deleted successfully`);
            setShowDeleteDialog(false);
            setRowSelection({});
            window.location.reload(); // Refresh to see updated list
        })
        .catch(() => {
            toast.error('Failed to delete some categories');
        });
    };

    // Handle Edit button click
    const handleEditClick = (category: CategoryItem) => {
        setCategoryToEdit(category);
        editForm.setData({
            name: category.name || '',
            slug: category.slug || '',
            color: category.color || '',
            image: null,
            description: category.description || '',
        });
        setShowEditDialog(true);
        setImages([]); // clear images for new upload
    };

    // Handle form submission for editing
    const handleEditSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (categoryToEdit) {
            const formData = new FormData();
            formData.append('name', editForm.data.name);
            formData.append('description', editForm.data.description || '');
            formData.append('color', editForm.data.color || '');
            formData.append('slug', editForm.data.slug || '');
            formData.append('_method', 'PUT'); // <-- important for Laravel
            if (images.length > 0) {
                formData.append('image', images[0]);
            }
            router.post(`/dashboard/categories/${categoryToEdit.id}`, formData, {
                onSuccess: () => {
                    toast.success('Category updated successfully');
                    setShowEditDialog(false);
                    setCategoryToEdit(null);
                    setImages([]);
                    editForm.reset();
                },
              onError: (errors) => {
    console.error(errors);
    // Show first error if available
    if (errors && typeof errors === 'object') {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
    } else {
        toast.error('Failed to update category');
    }
}
            });
        }
    };

    // Handle form submission for adding
    const handleAddSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (images.length > 0) {
            data.image = images[0];
        }
        
        router.post('/dashboard/categories', data, {
            onSuccess: () => {
                reset();
                setImages([]);
                setShowAddDialog(false);
                toast.success('Category created successfully');
            },
            onError: () => {
                toast.error('Failed to create category');
            }
        });
    };

    const handleExportToExcel = () => {
        // Get visible and filtered data
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const rowData = row.original;
            return {
                ID: rowData.id,
                Name: rowData.name,
                Slug: rowData.slug,
                Image: rowData.image,
            };
        });

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'categories.xlsx');
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                        <p className="text-muted-foreground text-sm">Manage your shop Categories</p>
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
                                <form action="" onSubmit={handleAddSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Add New Category</DialogTitle>
                                        <DialogDescription>Fill in the details to add a new category to your inventory.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Category Name</Label>
                                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category Tailwind Color Class eg bg-slate-100</Label>
                                                <Input id="category" value={data.color} onChange={(e) => setData('color', e.target.value)} />
                                                <InputError message={errors.color} className="mt-2" />
                                            </div>
                                        </div>
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="message">Category Description</Label>
                                            <Textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Type your message here."
                                                id="message"
                                            />
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>
                                        <div className="mb-8">
                                            <h2 className="mb-3 text-lg font-semibold">Upload Category Image</h2>
                                            <div className="rounded border p-4">
                                                <CompactFileInput multiple={true} maxSizeMB={1} onChange={setImages} />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" type='button' onClick={() => setShowAddDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button disabled={processing} type="submit">
                                            {processing ? 'Creating...' : 'Add Category'}
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
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
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

            {/* Delete Confirmation Dialog for individual category */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete the selected category. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Category Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[750px]">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Update the details of this category.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Category Name</Label>
                                    <Input 
                                        id="edit-name" 
                                        value={editForm.data.name} 
                                        onChange={(e) => editForm.setData('name', e.target.value)} 
                                    />
                                    <InputError message={editForm.errors.name} className="mt-2" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-color">Category Tailwind Color Class</Label>
                                    <Input 
                                        id="edit-color" 
                                        value={editForm.data.color} 
                                        onChange={(e) => editForm.setData('color', e.target.value)} 
                                    />
                                    <InputError message={editForm.errors.color} className="mt-2" />
                                </div>
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="edit-description">Category Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    placeholder="Type your description here."
                                />
                                <InputError message={editForm.errors.description} className="mt-2" />
                            </div>
                            <div className="mb-8">
                                <h2 className="mb-3 text-lg font-semibold">Update Category Image</h2>
                                <div className="rounded border p-4">
                                    <CompactFileInput multiple={true} maxSizeMB={1} onChange={setImages} />
                                    {categoryToEdit?.image && (
                                        <div className="mt-2">
                                            <p className="text-sm text-muted-foreground">Current image:</p>
                                            <img 
                                                src={categoryToEdit.image.startsWith('categories/') ? 
                                                    `/storage/${categoryToEdit.image}` : categoryToEdit.image} 
                                                alt={categoryToEdit.name} 
                                                className="mt-2 h-16 w-16 rounded-md object-cover" 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setShowEditDialog(false);
                                    setCategoryToEdit(null);
                                    editForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button disabled={editForm.processing} type="submit">
                                {editForm.processing ? 'Updating...' : 'Update Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}