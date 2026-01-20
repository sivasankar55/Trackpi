import React, { useContext, useEffect, useState } from 'react'
import followersAvatar from '../assets/followersAvatar.png'
import { Link, useNavigate } from 'react-router-dom';
import ProgressSVG from '../components/ProgressSVG';
import ProgressArrow from '../components/ProgressArrow';
import VerticalArrow from '../components/VerticalArrow';
import CurvedArrow from '../components/CurvedArrow';
import squreLock from '../assets/square-lock-02.png'
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';
import axios from 'axios';

const StartCourse = () => {
  const { user, token } = useContext(AuthContext)
  const { progressVersion } = useContext(ProgressContext)
  const navigate = useNavigate()
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      console.log("Fetching progress for StartCourse dashboard...");
      if (!token) {
        console.log("No token found, skipping progress fetch.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/progress/courses-status', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("API courses-status response:", res.data);
        const courses = Array.isArray(res.data) ? res.data : [];

        if (courses.length > 0) {
          // Calculate aggregate progress across all courses
          const totalVideos = courses.reduce((sum, c) => sum + (c.totalVideosCount || 0), 0);
          const completedVideos = courses.reduce((sum, c) => sum + (c.completedVideosCount || 0), 0);

          const p = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

          console.log(`Aggregate percentage: ${p.toFixed(1)}% (${completedVideos}/${totalVideos} total videos completed)`);
          setPercentage(p);
        }
      } catch (error) {
        console.error("Error fetching progress in StartCourse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [token, progressVersion]);






  return (
    <>
      <div className="w-full min-h-screen px-4 sm:px-5 md:px-10 lg:px-[60px]">

        <section className="pt-5">
          {/* Heading */}
          <h1 className="text-white text-2xl font-semibold mb-4 ">Welcome,</h1>

          {/* Avatar Section – Responsive Layout */}
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between xl:gap-[15px]">

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
                        <p className="font-medium roboto text-[20px] xl:text-[24px] leading-none truncate">
                          {user.name}
                        </p>
                        <p className="text-white mt-1 roboto text-[14px] leading-none">Freelancer</p>
                      </div>
                    </>
                  )
                }



              </div>

              {/* Date */}
              <p className="text-white roboto text-[14px] xl:text-[16px] font-medium text-right whitespace-nowrap ml-2 xl:ml-0">
                {new Date().toLocaleDateString('en-GB', {
                  // weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* 🔹 Followers */}
            <div className="flex items-center gap-[10px] mt-3 xl:mt-0">
              <img
                src={followersAvatar}
                alt="Followers"
                className="w-[130px] h-[40px] object-contain"
              />
              <p className="text-white font-medium text-[15px] roboto">1000+ Freelancers</p>
            </div>
          </div>
        </section>

        <div className='flex justify-between items-center mt-[30px] xl:mt-[50px] '>
          <p className='font-bold text-[18px] xl:text-3xl leading-[100%] text-white roboto'>24 Hours Cycle</p>
          <div className='flex flex-col xl:flex-row items-end xl:items-center gap-[10px]'>
            <button className='py-2 xl:py-3 px-4 xl:px-5 2xl:px-7.5 rounded-[40px] bg-[#FF9D00] font-medium text-[12px] xl:text-base cursor-pointer text-white roboto whitespace-nowrap' >Company Brochure</button>
            <button className='py-2 xl:py-3 px-4 xl:px-5 2xl:px-7.5 rounded-[40px] font-medium text-[12px] xl:text-base cursor-pointer text-white roboto whitespace-nowrap' style={{ backgroundColor: 'rgba(255, 157, 0, 0.5)', border: '1px solid rgba(255, 157, 0, 0.5)' }}>Watch Testimonials</button>
          </div>
        </div>

        <section className="w-full flex flex-col items-center mt-10 mb-10">
          <h2 className="text-white text-2xl font-normal mb-8 xl:mb-1 itim text-center">Course Completion Level</h2>

          <div className="flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-2 relative w-full" style={{ maxWidth: '1400px' }}>

            {/* Mobile Top Row Wrapper: Signup -> Arrow -> My Course */}
            <div className="flex flex-row items-center justify-center gap-2 xl:contents">
              {/* Step 1: Signup */}
              <button className='h-[59px] px-12.5 rounded-[30px] border-1 border-[#FF9D00] text-white text-2xl font-normal itim cursor-pointer'>Signup</button>

              {/* Arrow (Horizontal on both Mobile Top Row and Desktop) */}
              <div className="flex items-center justify-center">
                {/* Mobile: Orange Arrow */}
                <div className="xl:hidden">
                  <ProgressArrow color="#FF9D00" />
                </div>
                {/* Desktop: Default Grey Arrow */}
                <div className="hidden xl:block">
                  <ProgressArrow />
                </div>
              </div>

              {/* Step 2: My Course */}
              <button className='px-7.5 h-[59px] rounded-[30px] border-1 border-[#FF9D00] text-white text-[22px] font-normal itim cursor-pointer'>My Course</button>
            </div>

            {/* Mobile Only: Curved Arrow connecting My Course to Progress */}
            <div className="flex xl:hidden w-full justify-center pl-40 -mt-6 -mb-6">
              <CurvedArrow />
            </div>

            {/* Desktop Only: Horizontal Arrow */}
            <div className="hidden xl:flex items-center justify-center">
              <ProgressArrow />
            </div>

            {/* Step 3: Progress Circle */}
            <div className="flex flex-col items-center my-2 xl:my-0">
              <div className="relative flex flex-col items-center justify-center scale-90 xl:scale-100">
                {/* progress svg */}
                <ProgressSVG percentage={percentage} />
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="hidden xl:block"><ProgressArrow /></div>
              <div className="block xl:hidden"><VerticalArrow /></div>
            </div>

            {/* Step 4: Start Onboarding Process */}
            <div className="flex flex-col items-center relative group">
              <div className="flex flex-col rounded-[30px] border-2 border-[#FF9D00] px-7.5 py-2.5 text-white text-xl itim bg-black/60 shadow-lg opacity-70 cursor-pointer text-center" style={{ minWidth: 171, minHeight: 59, display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#FF9D00' }}>
                <p>Start Onboarding </p>
                <p>Process</p>
              </div>
              {/* Tooltip */}
              <div className="absolute w-[320px] top-full mt-2 bg-black text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Begin with pre-boarding activities like sending a welcome email, gathering paperwork, and setting up the workspace, followed by a structured orientation, training, and integration into the team and company culture.
              </div>
            </div>

            {/* Right-side text (Mobile: Below Onboarding) */}
            <div className="flex flex-col items-center ml-0 xl:ml-6 mt-4 xl:mt-0 text-center">
              <span className="text-white text-lg roboto">Fill in offer letter details</span>
              <span className="text-white text-lg roboto">and get Approved</span>
            </div>
          </div>

          {/* Mobile Only Arrow connecting to Earn Money */}
          <div className="flex xl:hidden items-center justify-center mt-4">
            <VerticalArrow />
          </div>

        </section>

        {/* start course and earn money */}
        <section className="w-full flex flex-col items-center pb-20">

          {/* Mobile Order: Text First, then Button */}
          <div className="flex flex-col-reverse xl:flex-col items-center gap-5 xl:gap-0">

            {/* Button */}
            <Link to='/course-section' className='py-5 px-12.5 rounded-[30px] text-white text-2xl font-bold k2d cursor-pointer z-10'
              style={{
                background: 'linear-gradient(103.71deg, #FF9D00 49.37%, #FFC100 49.39%)',
                borderWidth: '1px',
              }}>
              Start Course
            </Link>

            {/* Text */}
            <div className="relative md:mt-5">
              <p className='text-white text-4xl sm:text-6xl font-extrabold k2d text-center'
                style={{ letterSpacing: '0.05em', opacity: '0.5', backdropFilter: 'blur(10px)' }}>EARN MONEY</p>
              <img src={squreLock} alt="square lock" className='w-[36px] h-[35px] sm:w-[46px] sm:h-[45px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
            </div>

          </div>
        </section>

      </div>
    </>
  )
}

export default StartCourse