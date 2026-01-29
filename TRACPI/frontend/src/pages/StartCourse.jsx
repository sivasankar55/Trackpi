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
import Arrow22 from '../assets/Arrow 22.png'
import Arrow19 from '../assets/Arrow 19.png'
import axios from 'axios';
import brochure from '../assets/Trackpi Brochure .pdf';


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

        <div className='flex justify-between xl:justify-end items-center mt-[30px] xl:mt-[50px] mb-14 xl:mb-24 w-full'>
          {/* Mobile Only: 24 Hours Cycle Heading */}
          <p className='xl:hidden font-extrabold text-[18px] sm:text-[24px] leading-[100%] text-white roboto'>24 Hours Cycle</p>

          <div className='flex flex-col xl:flex-row items-end xl:items-center gap-[6px] sm:gap-[10px]'>
            <a href={brochure} download="Trackpi Brochure.pdf">
              <button className='py-2 px-4 sm:px-5 rounded-[40px] bg-[#FFB700] font-medium text-[11px] sm:text-[14px] xl:text-base cursor-pointer text-white roboto whitespace-nowrap' >Company Brochure</button>
            </a>

            <button className='py-2 px-4 sm:px-5 rounded-[40px] font-medium text-[11px] sm:text-[14px] xl:text-base cursor-pointer text-white roboto whitespace-nowrap' style={{ backgroundColor: 'rgba(255, 157, 0, 0.5)', border: '1px solid rgba(255, 157, 0, 0.5)' }}>Watch Testimonials</button>
          </div>
        </div>

        <section className="w-full flex flex-col items-center mt-10 mb-20">


          <div className="flex flex-col xl:flex-row items-center xl:items-center justify-center gap-10 xl:gap-6 w-full h-full" style={{ maxWidth: '1400px' }}>

            {/* Left Side: Process Flow */}
            <div className="flex flex-col xl:flex-row items-center xl:items-center gap-4 xl:gap-2">

              {/* Mobile: Horizontal Flow (Signup -> Arrow -> My Course) */}
              <div className="flex flex-col xl:hidden items-center gap-4 sm:gap-4 mb-4 w-full">
                <h2 className="text-white text-xl sm:text-2xl font-normal itim text-center whitespace-nowrap">Course Completion Level</h2>
                <div className="flex items-center gap-1 sm:gap-3">
                  <button className='h-[45px] sm:h-[59px] min-w-[110px] sm:min-w-[140px] px-6 sm:px-8 rounded-[30px] border-1 border-[#FFB700] text-white text-base sm:text-xl font-normal itim cursor-pointer whitespace-nowrap'>Signup</button>
                  <div className="shrink-0">
                    <img src={Arrow19} alt="Arrow" className="w-[50px] sm:w-[70px] h-auto object-contain" />
                  </div>
                  <div className="relative">
                    <button className='h-[45px] sm:h-[59px] min-w-[110px] sm:min-w-[140px] px-6 sm:px-8 rounded-[30px] border-1 border-[#FFB700] text-white text-base sm:text-lg font-normal itim cursor-pointer whitespace-nowrap'>My Course</button>
                    {/* Mobile Only: Curved Arrow starting from exact center of My Course */}
                    <div className="absolute top-[105%] left-[-23%] z-0 pointer-events-none">
                      <CurvedArrow />
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Relative Wrapper (Signup Absolute above My Course) */}
              <div className="hidden xl:flex relative flex-col items-center">
                {/* Signup + Arrow Floating Above */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 pb-9">
                  <p className='font-bold text-3xl leading-[100%] text-white roboto mb-4 whitespace-nowrap'>24 Hours Cycle</p>
                  <button className='h-[59px] px-8 rounded-[30px] border-1 border-[#FFB700] text-white text-2xl font-normal itim cursor-pointer whitespace-nowrap'>Signup</button>
                  <div className="mt-10 mb-1">
                    <img src={Arrow19} alt="Arrow" className="w-[100px] h-auto object-contain rotate-90" />
                  </div>
                </div>
                {/* My Course (Static in Flow) */}
                <button className='h-[59px] px-7.5 rounded-[30px] border-1 border-[#FFB700] text-white text-[22px] font-normal itim cursor-pointer whitespace-nowrap'>My Course</button>
              </div>



              {/* Desktop Only: Arrow */}
              <div className="hidden xl:flex items-center justify-center">
                <img src={Arrow19} alt="Arrow" className="w-[90px] h-auto object-contain" />
              </div>

              {/* Step 3: Progress Circle */}
              <div className="relative flex flex-col items-center mt-2 mb-0 xl:my-0">
                <h2 className="hidden xl:block text-white text-2xl font-normal mb-8 xl:absolute xl:bottom-full xl:mb-10 xl:left-1/2 xl:-translate-x-1/2 itim text-center whitespace-nowrap">Course Completion Level</h2>
                <div className="relative flex flex-col items-center justify-center scale-90 xl:scale-100">
                  <ProgressSVG percentage={percentage} />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="hidden xl:block">
                  <img src={Arrow19} alt="Arrow" className="w-[90px] h-auto object-contain" />
                </div>
                <div className="block xl:hidden mt-[-35px]">
                  <img src={Arrow22} alt="Arrow" className="w-[30px] h-auto object-contain" />
                </div>
              </div>

              {/* Step 4: Start Onboarding Process */}
              <div className="relative flex flex-col items-center">
                <div className="relative group flex flex-col items-center">
                  <div
                    className={`flex flex-col rounded-[30px] border-2 border-[#FFB700] px-7.5 py-2.5 text-white text-xl itim bg-black/60 shadow-lg text-center transition-all duration-300
                    ${percentage >= 100 ? 'cursor-pointer opacity-100 hover:scale-105 hover:bg-black/80' : 'cursor-not-allowed opacity-70'}`}
                    style={{ minWidth: 171, minHeight: 59, display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#FFB700' }}
                    onClick={() => {
                      if (percentage >= 100) {
                        navigate('/phone-number/enter');
                      }
                    }}
                  >
                    <p>Start Onboarding </p>
                    <p>Process</p>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute w-[320px] top-full mt-2 bg-black text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    Begin with pre-boarding activities like sending a welcome email, gathering paperwork, and setting up the workspace, followed by a structured orientation, training, and integration into the team and company culture.
                  </div>
                </div>

                {/* Text under button */}
                <div className="flex flex-col items-center mt-4 text-center xl:absolute xl:top-full xl:left-1/2 xl:-translate-x-1/2 xl:w-max">
                  <span className="text-white text-lg roboto">Fill in offer letter details</span>
                  <span className="text-white text-lg roboto">and get Approved</span>
                  {/* Mobile Only: Arrow pointing to Earn Money section */}
                  <div className="block xl:hidden mt-4 mb-[-20px] relative z-20">
                    <img src={Arrow22} alt="Arrow" className="w-[30px] h-auto object-contain" />
                  </div>
                </div>
              </div>

            </div>



            {/* Right Side: Earn Money Text Only */}
            <div className="flex flex-col items-center mt-0 xl:mt-0">
              {/* Text */}
              <div className="relative">
                <p className='text-white text-4xl sm:text-6xl font-extrabold k2d text-center'
                  style={{ letterSpacing: '0.05em' }}>EARN MONEY</p>
              </div>
            </div>

          </div>
        </section>

        {/* Start Course Button Section (Moved back to bottom) */}
        <section className="w-full flex flex-col items-center pb-20">
          <Link to='/course-section' className='py-5 px-12.5 rounded-[30px] text-white text-2xl font-bold k2d cursor-pointer z-10'
            style={{
              background: 'linear-gradient(103.71deg, #FF9D00 49.37%, #FFC100 49.39%)',
              borderWidth: '1px',
            }}>
            Start Course
          </Link>
        </section>

      </div>
    </>
  )
}

export default StartCourse