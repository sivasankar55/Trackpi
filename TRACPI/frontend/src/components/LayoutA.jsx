import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import FooterA from './FooterA'
import './css/LayoutA.css'
import HeaderA from './HeaderA'

const LayoutA = () => {
  const location = useLocation();
  const isFormFocused = location.pathname === '/connect-us' && location.hash === '#contact-form';

  return (
    <>
      {!isFormFocused && <HeaderA />}

      <main className={`background-a ${isFormFocused ? 'min-h-0' : 'min-h-screen'}`} style={isFormFocused ? { minHeight: 'auto' } : {}}>
        {!isFormFocused && <div className="glow-ellipse"></div>}
        <Outlet />
        {!isFormFocused && <FooterA />}
      </main>
    </>
  )
}

export default LayoutA
