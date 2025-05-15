import { Button } from '@headlessui/react';

const Highlights = () => {
  return (
    <section>
        <div className='flex flex-col m-8 gap-4'>
            <div className='flex flex-col font-bold text-[40px] items-start justify-start text-start md:flex-col lg:flex-row'>
                <h1 className='text-white'>The latest.</h1>
                <h1 className='text-[#86868b]'> Take a look at what's new, right now.</h1>
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'>
                <div className='w-full min-h-[400px] max-h-[600px] bg-[#000000] rounded-3xl px-6 py-10 flex flex-col hover:scale-102 duration-400'>
                    <p className='text-[20px] font-bold'>iPhone 16 pro</p>
                    <p className='font-bold '>The ultimate iPhone</p>
                    <p>From ₱69,990</p>
                    <img src="/images/highlight/16pro.jpg" alt="" className="w-full h-auto rounded-lg" />
                </div>
                <div className='w-full min-h-[400px] max-h-[600px] bg-[#000000] rounded-3xl px-6 py-10 flex flex-col hover:scale-102 duration-400'>
                    <p className='text-[20px] font-bold'>Macbook Air</p>
                    <p className='font-bold '>Speed of lightness</p>
                    <p>From ₱64,990</p>
                    <img src="/images/highlight/macbookair.png" alt="" className="w-full h-auto rounded-lg" />
                </div>
                <div className='w-full min-h-[400px] max-h-[600px] bg-[#000000] rounded-3xl px-6 py-10 flex flex-col hover:scale-102 duration-400'>
                    <p className='text-[20px] font-bold'>iPad Air</p>
                    <p className='font-bold '>Flight Speed</p>
                    <p>From ₱42,990</p>
                    <img src="/images/highlight/iPadair.png" alt="" className="w-full h-auto rounded-lg" />
                </div>
                <div className='w-full min-h-[400px] max-h-[600px] bg-[#000000] rounded-3xl px-6 py-10 flex flex-col hover:scale-102 duration-400'>
                    <p className='text-[20px] font-bold'>Apple Watch Series 10</p>
                    <p className='font-bold '>Thinstant classic</p>
                    <p>From ₱26,490</p>
                    <img src="/images/highlight/watch.jpg" alt="" className="w-full h-auto rounded-lg" />
                </div>
            </div>
            <div className="w-full flex items-center justify-center mt-6">
                 <a href="/store">
                    <Button className="bg-white text-black py-4 px-8 rounded-full border hover:bg-transparent hover:text-white hover:border-white">
                    View Shop
                    </Button>
                </a>
            </div>
        </div>
    </section>
  )
}

export default Highlights;
