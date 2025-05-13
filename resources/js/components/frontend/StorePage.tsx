
import React, { useEffect, useRef, useState } from 'react';

const categories = [
  { id: 1, name: 'iPhones', icon: '/images/icons/mobile-notch.svg' },
  { id: 2, name: 'Mac', icon: '/images/icons/computer.svg' },
  { id: 3, name: 'Watch', icon: '/images/icons/watch-smart.svg' },
  { id: 4, name: 'AirPods', icon: '/images/icons/headphones.svg' },
  { id: 5, name: 'Accessories', icon: '/images/icons/cable.svg' },
];

const products = [
  {
    id: 1,
    name: 'iPhone 13 Pro Max (128GB)',
    price: '99.99',
    image_url: 'https://pngimg.com/uploads/iphone_13/iphone_13_PNG5.png',
  },
  {
    id: 2,
    name: 'iPhone 12 Silicone Case',
    price: '49.99',
    image_url: '/images/case.png',
  },
  {
    id: 3,
    name: 'AirPods Pro (2nd Generation)',
    price: '599.99',
    image_url: '/images/airpods.png',
  },
  {
    id: 4,
    name: 'MagSafe Charger for iPhone',
    price: '599.99',
    image_url: '/images/charger.png',
  },
  {
    id: 5,
    name: 'iPhone 13 Mini (256GB)',
    price: '99.99',
    image_url: '/images/iphone-mini.png',
  },
  {
    id: 6,
    name: 'iPhone 12 Screen Protector',
    price: '49.99',
    image_url: '/images/screen-protector.png',
  },
  {
    id: 7,
    name: 'Beats Studio Buds',
    price: '299.99',
    image_url: '/images/beats.png',
  },
  {
    id: 8,
    name: 'Apple Watch Series 8',
    price: '999.99',
    image_url: '/images/apple-watch.png',
  },
];

export default function StorePage() {
  const scrollRef = useRef<HTMLDivElement | null>(null);


  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };
  

  return (
   
    <div className="bg-white dark:bg-[#0F0F0F] min-h-screen transition-colors duration-300">
      {/* Toggle Button */}
     

      {/* Hero Section */}
      <section className="text-center text-black dark:text-white mb-16 py-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Apple Innovation</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          Welcome to iPhoneHub — your destination for Apple excellence. Shop the latest iPhones, explore trusted second-hand models, and find accessories that bring your Apple experience to life.
        </p>
      </section>

      {/* Categories */}
      <section className="flex gap-6 overflow-x-auto pb-6 mb-16 items-center justify-center">
        {categories.map(({ id, name, icon }) => (
          <div key={id} className="flex flex-col items-center min-w-[100px]">
            <img src={icon} alt={name} className="w-12 h-12 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
          </div>
        ))}
      </section>

      {/* Product Listing */}
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-6 text-black dark:text-white">
          Authentic Apple Products. Fair Prices.
        </h2>
        <p className="text-lg text-center mb-12 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Explore verified iPhones, Apple accessories, and more — selected to ensure quality, performance, and transparency.
        </p>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map(({ id, name, price, image_url }) => (
              <div
                key={id}
                className="rounded-xl shadow-lg overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] p-4 flex flex-col h-full transition-colors"
              >
                <div className="w-full h-52 mb-4 rounded-lg flex items-center justify-center">
                  <img src={image_url} alt={name} className="max-h-full max-w-full object-contain" />
                </div>
                <h3 className="text-l text-black dark:text-white mb-2">{name}</h3>
                <div className="flex-grow" />
                <div className="text-sm font-bold text-black dark:text-white">₱{price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
