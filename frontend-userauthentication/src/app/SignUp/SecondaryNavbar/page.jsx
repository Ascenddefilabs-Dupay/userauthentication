'use client'
import React from 'react';
import SecondaryNavbar from './SecondaryNavbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const handleDownloadClick = () => {
    router.push('/SignUp/DownloadExtension');
  };

  return (
    <>
      <SecondaryNavbar />
      <div className='mt-36 flex'>
        <div className='flex items-center max-w-7xl w-full'>
          <div className='flex-grow p-4'>
            <p className='text-black text-4xl ml-12'>
              Dupay Wallet is available in your <br /> <span className='block'>country.</span>
            </p>
            <p className='text-black text-xl ml-12 mt-5'>
              Dupay Wallet, our self-custody crypto wallet to trade crypto and collect NFTs, is available in your country.
            </p>
            <button 
              className='text-white text-lg bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] mt-10 h-12 ml-12 rounded-full w-60'
              onClick={handleDownloadClick}
            >
              Download Dupay Wallet
            </button>
            <div className='flex items-center mt-6 ml-12'>
              <p className='text-black text-lg mr-4'>
                Already have a Dupay account?
              </p>
              <Link href='/signin'>
                <span className='text-blue-600 text-lg cursor-pointer font-medium'>
                  Sign In
                </span>
              </Link>
            </div>
          </div>
          <div className='ml-16 flex-shrink-0'>
            <div className='bg-gray-50 p-6 rounded-lg shadow-lg'>
              <img 
                src='/images/download_wallet.svg'   
                alt='Descriptive Alt Text' 
                className='w-[400px] h-[400px] object-cover' 
              /> 
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
