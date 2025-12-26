import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderC from './HeaderC'

const LayoutC = () => {
  return (
    <>
    <main className='flex'>
      <HeaderC />
      <Outlet />

    </main>
    
    </>
  )
}

export default LayoutC