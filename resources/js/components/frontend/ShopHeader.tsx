import { ChevronDown, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { IoLogoApple } from "react-icons/io5";

import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import { ModeToggle } from '../mode-togle';
import { LuSearch } from "react-icons/lu";

type PageProps = {
    auth: { user: { id: number; name: string } | null }
  }

// Sample cart items for demonstration
const initialCartItems = [
    {
        id: 1,
        name: 'Premium Noise-Cancelling Headphones',
        price: 299.99,
        quantity: 1,
        image: '/placeholder.svg?height=80&width=80',
    },
    {
        id: 2,
        name: 'Smart Watch Ultra Series',
        price: 429.99,
        quantity: 1,
        image: '/placeholder.svg?height=80&width=80',
    },
];

export default function ShopHeader({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll position for styling changes
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const updateQuantity = (id: number, increment: boolean) => {
        setCartItems(
            cartItems.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1),
                    };
                }
                return item;
            }),
        );
    };

    const removeItem = (id: number) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const [showSearch, setShowSearch] = useState(false)

   const navitems = [
  { name: 'Store', href: '/store' },
  { name: 'About', href: '/about' },
];

const NavCont = () => {
  const { url } = usePage();

  return (
    <ul className="flex flex-row items-center gap-6 text-[#86868b] text-sm">
      {navitems.map(({ name, href }) => (
        <li key={name} className="flex flex-row hover:text-white duration-200">
          <Link href={href} className={url === href ? 'text-white' : ''}>
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

    return (
        <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
            <div className="container mx-auto">
                <div className="flex h-20 items-center justify-between px-4 md:px-6">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <div className="relative h-8 w-40">
                                <div className="flex items-center">
                                    <span className="text-3xl font-bold tracking-tight"><IoLogoApple /></span>
                                   
                                </div>
                            </div>
                        </Link>
                    </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
                    <NavCont />
                </div>



                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-6">
                        <div className="relative flex  items-center gap-2">
                            <Input
                            type="search"
                            placeholder="Search products, brands and categories"
                            className={`h-10  rounded-full border transition-all duration-300 ${
                                showSearch ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                            />
                            <LuSearch
                            className="w-5 h-5 cursor-pointer hover:scale-110 duration-200"
                            onClick={() => setShowSearch((prev) => !prev)}
                            />
                        </div>
                        <ModeToggle />
                        {auth.user ? 
                        
                        (
                        <Link
                            method="post" href={route('logout')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                        Logout
                        </Link>
                        )
                        :
                        (<Link
                            href={route('login')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Login
                        </Link>)
                        }
                        {/* Shopping Cart */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative rounded-full">
                                    <ShoppingBag className="h-5 w-5" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black dark:bg-white text-xs font-medium text-white dark:text-black">
                                            {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                        </span>
                                    )}
                                    <span className="sr-only">Shopping Cart</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="flex w-full flex-col sm:max-w-md">
                                <SheetHeader className="border-b pb-4">
                                    <SheetTitle className="text-xl">Your Shopping Bag</SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-auto py-6">
                                    {cartItems.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center">
                                            <ShoppingBag className="h-16 w-16 text-slate-300" />
                                            <p className="mt-6 text-lg font-medium">Your shopping bag is empty</p>
                                            <p className="mt-2 max-w-xs text-center text-sm text-slate-500">
                                                Looks like you haven't added anything to your bag yet.
                                            </p>
                                            <SheetClose asChild>
                                                <Button className="mt-8 bg-orange-500 hover:bg-orange-600">Continue Shopping</Button>
                                            </SheetClose>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="grid grid-cols-[80px_1fr] gap-4">
                                                    <div className="aspect-square overflow-hidden rounded-md bg-slate-50">
                                                        <img
                                                            src={item.image || '/placeholder.svg'}
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="grid gap-1">
                                                        <div className="flex items-start justify-between">
                                                            <h3 className="leading-tight font-medium">{item.name}</h3>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full"
                                                                onClick={() => removeItem(item.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                                <span className="sr-only">Remove</span>
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
                                                        <div className="mt-2 flex items-center gap-3">
                                                            <div className="flex items-center rounded-full border">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full"
                                                                    onClick={() => updateQuantity(item.id, false)}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                    <span className="sr-only">Decrease quantity</span>
                                                                </Button>
                                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full"
                                                                    onClick={() => updateQuantity(item.id, true)}
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                    <span className="sr-only">Increase quantity</span>
                                                                </Button>
                                                            </div>
                                                            <div className="ml-auto font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {cartItems.length > 0 && (
                                    <SheetFooter className="border-t pt-6">
                                        <div className="w-full space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">Subtotal</span>
                                                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">Shipping</span>
                                                <span className="font-medium">Calculated at checkout</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t pt-4">
                                                <span className="text-base font-semibold">Total</span>
                                                <span className="text-base font-semibold">${calculateTotal().toFixed(2)}</span>
                                            </div>
                                            <div className="grid gap-2">
                                                <Button className="w-full bg-black py-6 hover:bg-black dark:bg-white">Proceed to Checkout</Button>
                                                <SheetClose asChild>
                                                    <Button variant="outline" className="w-full">
                                                        Continue Shopping
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                            <p className="mt-4 text-center text-xs text-slate-500">Shipping & taxes calculated at checkout</p>
                                        </div>
                                    </SheetFooter>
                                )}
                            </SheetContent>
                        </Sheet>

                        {/* Mobile menu button */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0.5H18" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M0 5.5H18" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M0 10.5H18" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader className="border-b pb-4">
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="space-y-4 py-6">
                                    <div className="relative">
                                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Search" className="pl-9" />
                                    </div>
                                    <nav className="grid gap-2">
                                        <Link href="#" className="flex items-center justify-between py-2 text-base font-medium">
                                            New Arrivals <ChevronDown className="h-4 w-4" />
                                        </Link>
                                        <Link href="#" className="flex items-center justify-between py-2 text-base font-medium">
                                            Women <ChevronDown className="h-4 w-4" />
                                        </Link>
                                        <Link href="#" className="flex items-center justify-between py-2 text-base font-medium">
                                            Men <ChevronDown className="h-4 w-4" />
                                        </Link>
                                        <Link href="#" className="flex items-center justify-between py-2 text-base font-medium">
                                            Accessories <ChevronDown className="h-4 w-4" />
                                        </Link>
                                        <Link href="#" className="flex items-center justify-between py-2 text-base font-medium">
                                            Collections <ChevronDown className="h-4 w-4" />
                                        </Link>
                                    </nav>
                                    <div className="mt-6 border-t pt-4">
                                        <nav className="grid gap-1">
                                            <Link href="#" className="py-2 text-sm">
                                                Account
                                            </Link>
                                            <Link href="#" className="py-2 text-sm">
                                                Wishlist
                                            </Link>
                                            <Link href="#" className="py-2 text-sm">
                                                Order Tracking
                                            </Link>
                                            <Link href="#" className="py-2 text-sm">
                                                Help & Contact
                                            </Link>
                                        </nav>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
