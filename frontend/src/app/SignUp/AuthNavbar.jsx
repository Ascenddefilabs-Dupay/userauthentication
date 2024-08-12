'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const AuthNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white text-black p-4 flex items-center shadow-md z-50">
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="focus:outline-none text-3xl">
          {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Dupay Text */}
      <div className="flex-1 flex items-center justify-center md:justify-start">
        <Link href="/">
          <span id="dupayLink" className="bg-clip-text text-transparent bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] no-underline text-2xl font-medium">Dupay</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <span className="text-lg mr-4">Already have an account?</span>
        <Link href="/SignIn">
          <button className="bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] text-white border-none py-2 px-4 text-lg cursor-pointer rounded-full transition-colors duration-300 hover:bg-blue-800">
            Sign In
          </button>
        </Link>
        
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-white shadow-md z-40 transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="p-4 flex justify-end">
          <button onClick={toggleMenu} className="text-3xl">
            <HiOutlineX />
          </button>
        </div>
        <ul className="flex flex-col items-center gap-6 mt-8">
          <li>
            <Link href="/SignIn">
              <button className="bg-blue-600 text-white border-none py-2 px-5 text-lg cursor-pointer rounded-full transition-colors duration-300 hover:bg-blue-800 w-full" onClick={() => window.location.href = '/SignIn'}>
                Sign In
              </button>
            </Link>
          </li>
          
        </ul>
      </div>
    </nav>
  );
};

export default AuthNavbar;
