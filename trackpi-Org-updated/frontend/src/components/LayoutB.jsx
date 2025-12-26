import React from 'react'
import { Outlet } from 'react-router-dom'
import './css/LayoutB.css'
import HeaderB from './HeaderB'
import FooterB from './FooterB'

const LayoutB = () => {
  return (
    <>

      <main className='background-b'>
        <HeaderB />
        <Outlet />
        <FooterB />
      </main>
    </>
  )
}

export default LayoutB