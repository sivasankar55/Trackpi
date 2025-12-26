import React from 'react'
import logo from '../assets/targetpi logo.png';
import { Link } from 'react-router-dom';

const HeaderB = () => {
  return (
    <>
    <header>
        <nav className='flex justify-between items-center py-2.5 px-[50px]'>
            <img src={logo} alt="logo of trackpi" className='w-[85px] h-[50px]' />
            <Link className='font-normal text-base text-white roboto'>Logout</Link>
        </nav>
    </header>
    </>
  )
}

export default HeaderB