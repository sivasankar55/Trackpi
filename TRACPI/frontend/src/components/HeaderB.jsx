import React from 'react'
import logo from '../assets/targetpi logo.png';
import { useNavigate } from 'react-router-dom';

const HeaderB = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all storage or specific keys like 'token'
    navigate('/');
  };

  return (
    <>
      <header>
        <nav className='flex justify-between items-center py-2.5 px-[50px]'>
          <img src={logo} alt="logo of trackpi" className='w-[85px] h-[50px]' />
          <button onClick={handleLogout} className='font-normal text-base text-white roboto cursor-pointer bg-transparent border-none'>Logout</button>
        </nav>
      </header>
    </>
  )
}

export default HeaderB