import React, { useContext} from 'react'
import followersAvatar from '../assets/followersAvatar.png'
import { Link, useNavigate} from 'react-router-dom';
import ProgressSVG from '../components/ProgressSVG';
import ProgressArrow from '../components/ProgressArrow';
import squreLock from '../assets/square-lock-02.png'
import { AuthContext } from '../context/AuthContext';

const StartCourse = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()




        
  return (
    <>
     <div className="w-full min-h-screen px-4 sm:px-5 md:px-10 lg:px-[60px]">

<section className="pt-5">
  {/* Heading */}
  <h1 className="text-white text-2xl font-semibold mb-4 ">Welcome,</h1>

  {/* Avatar Section – Responsive Layout */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-[15px]">

    {/* 🔹 Avatar Box */}
    <div
      className="p-[10px] rounded-[8px] flex items-center justify-between flex-grow"
      style={{
        background: 'linear-gradient(90deg, #373535 6.17%, #0A0A0A 72.67%)',
      }}
    >
      {/* Avatar + Name + Role */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Avatar Image */}
        {
          user && (
            <>
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-[49px] h-[49px] rounded-full object-cover shrink-0"
        />
        {/* Name + Role */}
        <div className="text-white truncate">
          <p className="font-medium roboto text-[20px] sm:text-[24px] leading-none truncate">
            {user.name}
          </p>
          <p className="text-white mt-1 roboto text-[14px] leading-none">Freelancer</p>
        </div>
            </>
          )
        }
        

        
      </div>

      {/* Date */}
      <p className="text-white roboto text-[14px] sm:text-[16px] font-medium text-right whitespace-nowrap ml-2 sm:ml-0">
        {new Date().toLocaleDateString('en-GB', {
    // weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>

    {/* 🔹 Followers */}
    <div className="flex items-center gap-[10px] mt-3 sm:mt-0">
      <img
        src={followersAvatar}
        alt="Followers"
        className="w-[130px] h-[40px] object-contain"
      />
      <p className="text-white font-medium text-[15px] roboto">1000+ Freelancers</p>
    </div>
  </div>
</section>

<div className='flex justify-between items-center mt-[50px] '>
    <p className='font-bold text-[18px] sm:text-3xl leading-[100%] text-white roboto'>24 Hours Cycle</p>
    <div className='flex items-center gap-[10px]'>
    <button className='py-3 px-5 sm:px-7.5 rounded-[40px] bg-[#FF9D00] font-medium text-[12px] sm:text-base cursor-pointer text-white roboto' >Company Brochure</button>
    <button className='py-3 px-5 sm:px-7.5 rounded-[40px] font-medium text-[12px] sm:text-base cursor-pointer text-white roboto' style={{ backgroundColor: 'rgba(255, 157, 0, 0.5)', border: '1px solid rgba(255, 157, 0, 0.5)' }}>Watch Testimonials</button>
    </div>
  </div>

  <section className="w-full flex flex-col items-center ">
  <h2 className="text-white text-2xl font-normal mb-1 itim">Course Completion Level</h2>
  <div className="w-full flex flex-row items-center justify-center gap-2 relative" style={{maxWidth: '1400px'}}>
    {/* Step 1: Signup */}
    <button className='h-[59px] px-12.5 rounded-[30px] border-1 border-[#FF9D00] text-white text-2xl font-normal itim cursor-pointer'>Signup</button>
    {/* Arrow */}
    <div className="flex items-center ">
      <ProgressArrow />
    </div>
    {/* Step 2: My Course */}
    <button className='px-7.5 h-[59px] rounded-[30px] border-1 border-[#FF9D00] text-white text-[22px] font-normal itim cursor-pointer'>My Course</button>
    {/* Arrow */}
    <div className="flex items-center ">
      <ProgressArrow />
    </div>
    {/* Step 3: Progress Circle */}
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col items-center justify-center" style={{width: 201, height: 232}}>
        {/* progress svg */}
        <ProgressSVG />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-[#FF9D00] itim"></span>
        </div>
      </div>
    </div>
        {/* Arrow */}
    <div className="flex items-center ">
      <ProgressArrow />
    </div>
    {/* Step 4: Start Onboarding Process */}
    <div className="flex flex-col items-center relative group">
      <div className="flex flex-col rounded-[30px] border-2 border-[#FF9D00] px-7.5 py-2.5 text-white text-xl itim bg-black/60 shadow-lg opacity-70 cursor-pointer" style={{minWidth: 171, minHeight: 59, display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#FF9D00'}}>
        <p>Start Onboarding </p>
        <p>Process</p>
      </div>
      {/* Tooltip */}
      <div className="absolute w-[320px] top-full mt-2 bg-black text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
      Begin with pre-boarding activities like sending a welcome email, gathering paperwork, and setting up the workspace, followed by a structured orientation, training, and integration into the team and company culture.
      </div>
    </div>
    {/* Right-side text */}
    <div className="flex flex-col items-center ml-6">
      <span className="text-white text-lg roboto">Fill in offer letter details</span>
      <span className="text-white text-lg roboto">and get Approved</span>
    </div>
  </div>
</section>

{/* start course and earn money */}
<section className="w-full flex flex-col items-center">
    <Link to='/course-section' className='py-5 px-12.5 rounded-[30px] text-white text-2xl font-bold k2d cursor-pointer'
    style={{
        background: 'linear-gradient(103.71deg, #FF9D00 49.37%, #FFC100 49.39%)',
        borderWidth: '1px',
      }}>
        Start Course
    </Link>
    <div className="relative">
        <p className='text-white text-6xl font-extrabold k2d mt-5'
        style={{letterSpacing: '0.05em', opacity: '0.5', backdropFilter: 'blur(10px)'}}>EARN MONEY</p>
        <img src={squreLock} alt="square lock" className='w-[46px] h-[45px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
    </div>
</section>




    </div>
    </>
  )
}

export default StartCourse