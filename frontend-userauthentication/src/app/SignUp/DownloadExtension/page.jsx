// import React from 'react'
// import ExtensionNavbar from './ExtensionNavbar'
// import { FaAppStoreIos, FaChrome } from "react-icons/fa"
// import { IoLogoGooglePlaystore } from "react-icons/io5"
// import { FaBrave } from "react-icons/fa6"

// const Extension = () => {
//   return (
//     <>
//       <ExtensionNavbar />
//       <div className="p-4 mt-40">
//         {/* Paragraphs */}
//         <div className="mb-4">
//           <p className="text-4xl font-semibold ml-6">Dupay Wallet</p>
//         </div>
//         <div className="mb-12">
//           <p className="text-base pt-4 ml-6">
//             Dupay Wallet is available as a mobile app and desktop browser extension.
//           </p>
//         </div>

//         {/* Card Structure */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="border p-4 rounded-lg shadow-lg h-64 bg-gray-50 pt-10 hover:scale-y-105">
//             <h3 className="text-4xl font-semibold mb-2">
//               <FaAppStoreIos color="#007AFF" />
//             </h3>
//             <p className='mt-4 text-xl pt-2'>Download For iOS</p>
//             <p className='mt-4 text-sm pt-2'>Get the Dupay wallet mobile app from the Appstore</p>
//           </div>
//           <div className="border p-4 rounded-lg shadow-lg bg-gray-50 pt-10 hover:scale-y-105">
//             <h3 className="text-4xl font-semibold mb-2">
//               <IoLogoGooglePlaystore color="#34A853" />
//             </h3>
//             <p className='mt-4 text-xl pt-2'>Download For Android</p>
//             <p className='mt-4 text-sm pt-2'>Get the Dupay wallet mobile app from the Playstore</p>
//           </div>
//           <div className="border p-4 rounded-lg shadow-lg bg-gray-50 pt-10 hover:scale-y-105">
//             <h3 className="text-4xl font-semibold mb-2">
//               <FaChrome color="#F4B400" />
//             </h3>
//             <p className='mt-4 text-xl pt-2'>Download for Chrome</p>
//             <p className='mt-4 text-sm pt-2'>Get the Dupay wallet extension from the Chrome web store</p>
//           </div>
//           <div className="border p-4 rounded-lg shadow-lg bg-gray-50 pt-10 hover:scale-y-105">
//             <h3 className="text-4xl font-semibold mb-2">
//               <FaBrave color="#FB542B" />
//             </h3>
//             <p className='mt-4 text-xl pt-2'>Download For Brave</p>
//             <p className='mt-4 text-sm pt-2'>Get the Dupay wallet extension from the Brave store</p>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Extension


import React from 'react'
import Link from 'next/link';
import ExtensionNavbar from './ExtensionNavbar'
import { FaAppStoreIos,  } from "react-icons/fa"
import { FaBrave } from "react-icons/fa6"
import  '../EmailVerification/Signup'

const Extension = () => {
  return (
    <>
      <ExtensionNavbar />
      <div className="p-4 mt-40">
        {/* Paragraphs */}
        <div className="mb-4">
          <p className="text-4xl font-semibold ml-6">Dupay Wallet</p>
        </div>
        <div className="mb-12">
          <p className="text-base pt-4 ml-6">
            Dupay Wallet is available as a mobile app and desktop browser extension.
          </p>
        </div>

        {/* Card Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer" className="border p-4 rounded-lg shadow-lg h-64 bg-gray-50 pt-10 hover:scale-y-105">
            <h3 className="text-4xl font-semibold mb-2">
              <FaAppStoreIos color="#007AFF" />
            </h3>
            <p className='mt-4 text-xl pt-2'>Download For iOS</p>
            <p className='mt-4 text-sm pt-2'>Get the Dupay wallet mobile app from the Appstore</p>
          </a>
          {/* <a href="https://play.google.com/" target="_blank" rel="noopener noreferrer" className="border p-4 rounded-lg shadow-lg h-64 bg-gray-50 pt-10 hover:scale-y-105"> */}
          <Link href="/SignUp/EmailVerification" passHref>
            <h3 className="text-4xl font-semibold mb-2">
            <img 
                src='/images/playstore.png'   
                alt='Descriptive Alt Text' 
                className='w-[40px] h-[40px] object-cover' 
              />
            </h3>
            <p className='mt-4 text-xl pt-2'>Download For Android</p>
            <p className='mt-4 text-sm pt-2'>Get the Dupay wallet mobile app from the Playstore</p>
           </Link>
          {/* </a> */}
          <a href="https://chrome.google.com/webstore/" target="_blank" rel="noopener noreferrer" className="border p-4 rounded-lg shadow-lg h-64 bg-gray-50 pt-10 hover:scale-y-105">
            <h3 className="text-4xl font-semibold mb-2">
            <img 
                src='/images/chrome.png'   
                alt='Descriptive Alt Text' 
                className='w-[40px] h-[40px] object-cover' 
              />
            </h3>
            <p className='mt-4 text-xl pt-2'>Download for Chrome</p>
            <p className='mt-4 text-sm pt-2'>Get the Dupay wallet extension from the Chrome web store</p>
          </a>
          <a href="https://brave.com/" target="_blank" rel="noopener noreferrer" className="border p-4 rounded-lg shadow-lg h-64 bg-gray-50 pt-10 hover:scale-y-105">
            <h3 className="text-4xl font-semibold mb-2">
              <FaBrave color="#FB542B" />
            </h3>
            <p className='mt-4 text-xl pt-2'>Download For Brave</p>
            <p className='mt-4 text-sm pt-2'>Get the Dupay wallet extension from the Brave store</p>
          </a>
        </div>
      </div>
    </>
  )
}

export default Extension

