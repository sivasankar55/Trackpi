import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './css/LayoutB.css'
import HeaderB from './HeaderB'
import FooterB from './FooterB'

const LayoutB = () => {
  const location = useLocation();
  const isVideoPage = location.pathname.includes('/sections/');

  return (
    <>

      <main className='background-b'>
        <HeaderB />
        <Outlet />
        {!isVideoPage && <FooterB />}
      </main>
    </>
  )
}

export default LayoutB