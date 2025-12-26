import React from 'react'
import { Link } from 'react-router-dom'

const FooterB = () => {
  return (
    <>
    <footer className='w-[669px] h-[53px] rounded-[50px] bg-[#1A1A1A] mx-auto mt-10'>
        <nav className='w-full  py-2 px-7.5 flex justify-between items-center gap-10'>
            <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >Discover Us</Link>
            <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >Help Centre</Link>
            <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >Courses</Link>
            <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >FAQ</Link>
        </nav>
    </footer>
    </>
  )
}

export default FooterB