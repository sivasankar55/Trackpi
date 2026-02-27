import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './css/LayoutB.css'
import HeaderB from './HeaderB'
import FooterB from './FooterB'

const LayoutB = () => {
  const location = useLocation();
  const isVideoPage = location.pathname.includes('/sections/');
  const isFeedbackPage = location.pathname === '/feedback-form';

  return (
    <>

      <main className='background-b flex flex-col'>
        <HeaderB />
        <Outlet />
        {!isVideoPage && !isFeedbackPage && <FooterB />}
      </main>
    </>
  )
}

export default LayoutB