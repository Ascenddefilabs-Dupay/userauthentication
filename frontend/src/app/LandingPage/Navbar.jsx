'use client';
import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import Login from '../SignIn/login';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    toggleMenu();
    router.push('/SignIn');
  };

  const handleSignUp = () => {
    toggleMenu();
    router.push('/SignUp');
  };

  return (
    <nav className="fixed top-0 w-full p-4 flex items-center shadow-md z-50">
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="focus:outline-none text-3xl">
          {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Dupay Text */}
      <div className="flex-1 flex items-center justify-center md:justify-start">
        <Link href="/">
          <span id="dupayLink" className="text-2xl font-medium cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-[#7f2ee3] to-[#4246f7]">Dupay</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex list-none gap-4 md:gap-8 m-0 p-0 items-center">
        <li>
          <Link href="/" className="text-black text-base md:text-lg no-underline transition-colors duration-300 hover:text-gray-700">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-black text-base md:text-lg no-underline transition-colors duration-300 hover:text-gray-700">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-black text-base md:text-lg no-underline transition-colors duration-300 hover:text-gray-700">
            Contact
          </Link>
        </li>
        <li className="flex gap-2 md:gap-4">
          <button className="bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] text-white border-none py-1 md:py-2 px-3 md:px-5 text-base md:text-lg cursor-pointer rounded-full transition-colors duration-300 hover:bg-blue-800" onClick={handleLogin}>
            Login
          </button>
          <button className="bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] text-white border-none py-1 md:py-2 px-3 md:px-5 text-base md:text-lg cursor-pointer rounded-full transition-colors duration-300 hover:bg-blue-800" onClick={handleSignUp}>
            Sign Up
          </button>
        </li>
      </ul>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-white shadow-md z-40 transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="p-4 flex justify-end">
          <button onClick={toggleMenu} className="text-3xl">
            <HiOutlineX />
          </button>
        </div>
        <ul className="flex flex-col items-center gap-6 mt-8">
          <li>
            <Link href="/" className="text-black text-lg no-underline transition-colors duration-300 hover:text-gray-700" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-black text-lg no-underline transition-colors duration-300 hover:text-gray-700" onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-black text-lg no-underline transition-colors duration-300 hover:text-gray-700" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
          <li className="flex flex-col gap-2 w-full">
            <button className="bg-blue-600 text-white border-none py-2 px-5 text-lg cursor-pointer rounded-full transition-colors duration-300 hover:bg-blue-800 w-full" onClick={handleLogin}>
              Login
            </button>
            <button className="bg-blue-600 text-white border-none py-2 px-5 text-lg cursor-pointer rounded-full transition-colors duration-300 hover:bg-blue-800 w-full" onClick={handleSignUp}>
              Sign Up
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


// 'use client';
// import { useState } from 'react';
// import Link from 'next/link';
// import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="fixed top-6 w-full h-16 flex items-center shadow-lg z-50 bg-gray-800">
//       {/* Hamburger Menu for Mobile */}
//       <div className="md:hidden flex items-center">
//         <button onClick={toggleMenu} className="focus:outline-none text-3xl text-white">
//           {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
//         </button>
//       </div>

//       {/* Dupay Text */}
//       <div className="flex-1 flex items-center md:justify-start ml-6 md:ml-10">
//         <Link href="/">
//           <span
//             id="dupayLink"
//             className="text-3xl font-semibold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"
//           >
//             Dupay
//           </span>
//         </Link>
//       </div>

//       {/* Desktop Menu */}
//       <ul className="hidden md:flex list-none gap-4 md:gap-8 m-0 p-0 items-center">
//         <li>
//           <Link href="/" className="text-white text-base md:text-lg no-underline transition-colors duration-300 hover:text-gray-300">
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link href="/about" className="text-white text-base md:text-lg no-underline transition-colors duration-300 hover:text-gray-300">
//             About
//           </Link>
//         </li>
//         <li>
//           <Link href="/contact" className="text-white text-base md:text-lg no-underline transition-colors duration-300 hover:text-gray-300">
//             Contact
//           </Link>
//         </li>
//         <li className="flex gap-2 md:gap-4">
//           <button
//             className="bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white border-none py-1 md:py-2 px-3 md:px-5 text-base md:text-lg cursor-pointer rounded-full transition-colors duration-300 hover:from-blue-600 hover:to-indigo-700"
//             onClick={() => window.location.href = '/SignIn'}
//           >
//             Sign In
//           </button>
//           <button
//             className="bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white border-none py-1 md:py-2 px-3 md:px-5 text-base md:text-lg cursor-pointer rounded-full transition-colors duration-300 hover:from-blue-600 hover:to-indigo-700"
//             onClick={() => window.location.href = '/SignUp'}
//           >
//             Sign Up
//           </button>
//         </li>
//       </ul>

//       {/* Mobile Menu */}
//       <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 shadow-md z-40 transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
//         <div className="p-4 flex justify-end">
//           <button onClick={toggleMenu} className="text-3xl text-white">
//             <HiOutlineX />
//           </button>
//         </div>
//         <ul className="flex flex-col items-center gap-6 mt-8">
//           <li>
//             <Link href="/" className="text-white text-lg no-underline transition-colors duration-300 hover:text-gray-300" onClick={toggleMenu}>
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link href="/about" className="text-white text-lg no-underline transition-colors duration-300 hover:text-gray-300" onClick={toggleMenu}>
//               About
//             </Link>
//           </li>
//           <li>
//             <Link href="/contact" className="text-white text-lg no-underline transition-colors duration-300 hover:text-gray-300" onClick={toggleMenu}>
//               Contact
//             </Link>
//           </li>
//           <li className="flex flex-col gap-2 w-full">
//             <button
//               className="bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white border-none py-2 px-5 text-lg cursor-pointer rounded-full transition-colors duration-300 hover:from-blue-600 hover:to-indigo-700 w-full"
//               onClick={() => { window.location.href = '/SignIn'; toggleMenu(); }}
//             >
//               Sign In
//             </button>
//             <button
//               className="bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white border-none py-2 px-5 text-lg cursor-pointer rounded-full transition-colors duration-300 hover:from-blue-600 hover:to-indigo-700 w-full"
//               onClick={() => { window.location.href = '/SignUp'; toggleMenu(); }}
//             >
//               Sign Up
//             </button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

