// import React from 'react'
// import { Link } from 'react-router-dom'

// const FooterB = () => {
//   return (
//     <>
//       <footer className='w-[669px] h-[53px] rounded-[50px] bg-[#1A1A1A] mx-auto mt-10'>
//         <nav className='w-full  py-2 px-7.5 flex justify-between items-center gap-10'>
//           <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >Discover Us</Link>
//           <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >Help Centre</Link>
//           <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >Courses</Link>
//           <Link to="#" className='poppins font-semibold text-[22px] text-[#909090]' >FAQ</Link>
//         </nav>
//       </footer>
//     </>
//   )
// }

// export default FooterB



// import React from 'react'
// import { Link } from 'react-router-dom'

// const FooterB = () => {
//   return (
//     <footer className="w-[669px] h-[53px] rounded-[50px] bg-[#1A1A1A] mx-auto mt-auto mb-8">
//       <nav className="w-full py-2 px-7.5 flex justify-between items-center gap-10">
//         <Link to="/discover-us" className="poppins font-semibold text-[22px] text-[#909090]">Discover Us</Link>
//         <Link to="/help-centre" className="poppins font-semibold text-[22px] text-[#909090]">Help Centre</Link>
//         <Link to="/start-course/dashboard" className="poppins font-semibold text-[22px] text-[#909090]">Courses</Link>
//         <Link to="/faq" className="poppins font-semibold text-[22px] text-[#909090]">FAQ</Link>
//       </nav>
//     </footer>
//   )
// }

// export default FooterB




import { NavLink } from 'react-router-dom';

const FooterB = () => {
  const linkClasses = ({ isActive }) =>
    `poppins font-semibold text-[22px] transition-colors duration-300 ${isActive ? 'text-[#FFB200]' : 'text-[#909090]'
    }`;

  return (
    <footer className="hidden md:flex w-[669px] h-[53px] rounded-[50px] bg-[#1A1A1A] mx-auto mt-auto mb-8 justify-center items-center">
      <nav className="w-full py-2 px-8 flex justify-between items-center gap-10">
        <NavLink to="/discover-us" className={linkClasses}>
          Discover Us
        </NavLink>

        <NavLink to="/help-centre" className={linkClasses}>
          Help Centre
        </NavLink>

        <NavLink to="/start-course/dashboard" className={linkClasses}>
          Courses
        </NavLink>

        <NavLink to="/faq" className={linkClasses}>
          FAQ
        </NavLink>
      </nav>
    </footer>
  );
};

export default FooterB;
