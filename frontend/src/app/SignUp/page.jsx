'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthNavbar from './AuthNavbar';

const Page = () => {
  const [selectedAccount, setSelectedAccount] = useState('Individual');
  const router = useRouter();

  useEffect(() => {
    // Pre-select the 'Individual' account on initial render
    setSelectedAccount('Individual');
  }, []);

  const handleSelectAccount = (accountType) => {
    setSelectedAccount(accountType);
  };

  const handleGetStarted = () => {
    if (!selectedAccount) {
      alert('Please select an account type before proceeding.');
      return;
    }
    router.push('/SignUp/SecondaryNavbar'); 
  };

  return (
    <>
      <AuthNavbar />
      <main className="pt-20 md:pt-24 p-4 md:p-11"> {/* Adjust padding to account for navbar height */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Welcome to Dupay</h1>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-semibold">Choose your Account Type</h2>
        </div>

        <div className="flex flex-col gap-5 mb-5 md:flex-row md:gap-5">
          <div className="flex flex-col gap-5 w-full md:w-1/2">
            <div
              className={`bg-gray-100 border ${selectedAccount === 'Individual' ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-5 cursor-pointer transition-colors duration-300 h-32`}
              onClick={() => handleSelectAccount('Individual')}
            >
              <h3 className="text-lg font-semibold">Individual</h3>
              <p>For individuals who want to trade, send and receive crypto, get price alerts, and more.</p>
            </div>

            <div
              className={`bg-gray-100 border ${selectedAccount === 'Vendor' ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-5 cursor-pointer transition-colors duration-300 h-32`}
              onClick={() => handleSelectAccount('Vendor')}
            >
              <h3 className="text-lg font-semibold">Vendor</h3>
              <p>We offer businesses and high-net-worth individuals secure solutions for accepting, managing, and trading cryptocurrencies.</p>
            </div>
          </div>

          <aside className="mt-5 md:mt-0 md:ml-2 flex-grow max-w-full md:max-w-lg">
            {selectedAccount === 'Individual' && (
              <div>
                <h3 className="text-lg font-semibold mb-2">An individual account is the best way to manage your personal crypto portfolio</h3>
                <h5 className="text-md font-semibold">Access to hundreds of cryptocurrencies</h5>
                <p className="mb-2">Buy, sell, and track your crypto all in one place</p>

                <h5 className="text-md font-semibold">Safe & secure</h5>
                <p className="mb-2">Industry best practices are used to keep your crypto safe</p>

                <h5 className="text-md font-semibold">Anytime, anywhere</h5>
                <p>Stay on top of the markets with the Coinbase app for Android or iOS</p>
              </div>
            )}

            {selectedAccount === 'Vendor' && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Our business account provides companies, institutions, and high-net-worth clients with access to top-tier investment tools.</h4>
                <h5 className="text-md font-semibold">Set up your organization</h5>
                <p className="mb-2">Create a single account to manage all of your business entities</p>

                <h5 className="text-md font-semibold">Invite and manage your team</h5>
                <p className="mb-2">Provide your whole team with permissioned access to your organization’s account</p>

                <h5 className="text-md font-semibold">Safe & secure</h5>
                <p>Offline cold storage provides maximum security.</p>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-8">
          <button className="bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] text-white rounded-lg py-2 px-4 md:py-2 md:px-6 hover:bg-blue-700 transition-colors duration-300 w-full md:w-auto" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </main>
    </>
  );
};

export default Page;
