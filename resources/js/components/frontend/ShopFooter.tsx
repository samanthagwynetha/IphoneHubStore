
import { Link, usePage } from '@inertiajs/react'
import React from 'react'

const footerItems = ['Privacy Policy', 'Terms of Use', 'Sales and Refunds', 'Legal', 'Site Map']

const Footer = () => {
    const { url } =usePage();
  return (
    <section>
      <div className='flex flex-col  justify-center text-sm p-4'>
        <div>
            <p>More ways to shop: <a href="" className='text-blue-700 underline'>Find a retailer</a> near you. Or call 1800-1651-0525 (Smart/PLDT), 1800-8474-7382 (Globe).</p>
        </div>
        <div className='bg-neutral-700 my-5 h-[1px] w-full'></div>
        <div className='flex flex-col justify-between lg:flex-row text-sm gap-2'>
            <p>Copyright © 2025 Apple Inc. All rights reserved.</p>
            <div className='flex'>
            <p className='flex flex-row '>
            {footerItems.map((item, i) => (
                <li key={item} className='flex flex-row hover:text-white duration-200 text-sm'>
                    <Link href="/" className={url === '/' ? '' : ''}>
                    {item} {' '}
                    {i !== footerItems.length - 1 && (
                        <span className='mx-2'>|</span>
                    )}
                    </Link>
                
                </li>
            ))}
            </p>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Footer
