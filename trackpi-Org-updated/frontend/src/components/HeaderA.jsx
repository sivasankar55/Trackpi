import React, { useState } from 'react';
import logo from '../assets/targetpi logo.png';
import { Link, useLocation } from 'react-router-dom';
import { AlignJustify, X } from 'lucide-react';

const HeaderA = () => {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className='bg-black text-white'>
        <div className='flex justify-between items-center px-6 sm:px-10 py-4'>
          {/* Logo */}
          <img src={logo} alt="logo of trackpi" className='w-[120px] sm:w-[134px] h-auto' />

          {/* Desktop Nav */}
          <nav className='hidden md:flex gap-16 items-center'>
            <Link to="/" className={`font-medium text-[17px] hover:text-[#FFC100] ${location.pathname === '/' ? "border-b-3 border-b-[#FF9D00]" : ""} `}>HOME</Link>
            <Link to="/about"  className={`font-medium text-[17px] hover:text-[#FFC100] ${location.pathname === '/about' ? "border-b-3 border-b-[#FF9D00]" : ""} `}>ABOUT</Link>
            <Link to="/connect-us" className={`font-medium text-[17px] hover:text-[#FFC100] ${location.pathname === '/about' ? "border-b-3 border-b-[#FF9D00]" : ""} `}>CONNECT US</Link>
          </nav>

          {/* Desktop Button */}
          <button className='hidden md:flex rounded-[21px] border-2 border-[#FF9D00] py-2.5 px-6 bg-[#FFC100] text-black font-medium text-[17px] hover:bg-[#ffb300]'>
            Login/Signup
          </button>

          {/* Mobile Hamburger */}
          <button className='md:hidden' onClick={toggleMenu}>
            {isOpen ? <X className='w-6 h-6' /> : <AlignJustify className='w-6 h-6' />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className='md:hidden flex flex-col px-6 pb-4 gap-3 bg-black border-t border-white/10'>
            <Link to="/" className='font-medium text-[16px] py-2 border-b border-gray-700 hover:text-[#FFC100]'>HOME</Link>
            <Link to="about" className='font-medium text-[16px] py-2 border-b border-gray-700 hover:text-[#FFC100]'>ABOUT</Link>
            <Link to="connect-us" className='font-medium text-[16px] py-2 border-b border-gray-700 hover:text-[#FFC100]'>CONNECT US</Link>
            <button className='mt-2 rounded-[21px] border-2 border-[#FF9D00] py-2.5 px-6 bg-[#FFC100] text-black font-medium text-[17px] hover:bg-[#ffb300]'>
              Login/Signup
            </button>
          </div>
        )}
      </header>
    </>
  );
};

export default HeaderA;
