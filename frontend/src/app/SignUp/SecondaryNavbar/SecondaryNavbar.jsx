'use client';

const SecondaryNavbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white text-black p-4 flex justify-between items-center shadow-md z-50">
      <div className="flex-1">
        <a href="#" className="text-blue-600 no-underline text-2xl font-medium">Dupay</a>
      </div>
      <div className="flex items-center mr-4">
        <button className="bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] text-white border-none py-2 px-4 text-lg cursor-pointer rounded-full transition-colors duration-300 hover:bg-blue-800" onClick={() => window.location.href = '/signin'}>
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
