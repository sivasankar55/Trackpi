import React from 'react'
import { Outlet } from 'react-router-dom'
import FooterA from './FooterA'
import './css/LayoutA.css'
import HeaderA from './HeaderA'

const LayoutA = () => {
  return (
    <>
    <HeaderA />
    
    <main className='background-a'>
    <div className="glow-ellipse"></div>
        <Outlet />
        <FooterA />
    </main>
    </>
  )
}

export default LayoutA