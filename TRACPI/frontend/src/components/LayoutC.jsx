import React from 'react';
import HeaderC from './HeaderC';
import { Outlet } from 'react-router-dom';

const LayoutC = () => {
  return (
    <>
      <main className='flex h-screen overflow-hidden'>
        <HeaderC />
        <div className='flex-1 overflow-y-auto bg-white'>
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default LayoutC;