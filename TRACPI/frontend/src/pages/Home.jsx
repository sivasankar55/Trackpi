import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Signup from '../components/Signup';
import freeLancer from '../assets/freelancer.png';
import hero from '../assets/hero.png';
import group2 from '../assets/group2.png';
import luminar from '../assets/luminar.png';
import IIDM from '../assets/IIDM.jpg';
import tech from '../assets/tech.jpg';
import trade from '../assets/trade.png';
import group3 from '../assets/group3.png';
import group4 from '../assets/group4.png';
import { Play, Volume2, VolumeX } from 'lucide-react';
import FloatingIcons from '../components/FloatingIcons';

function Home() {
  const companyArray = [luminar, IIDM, tech, trade];
  const location = useLocation();
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [isFloating, setIsFloating] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle floating only when scrolled past the entire hero section height
      if (heroRef.current && window.scrollY > heroRef.current.offsetHeight) {
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state && location.state.scrollToSignup) {
      const section = document.getElementById('signup-section');
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 500); // Delay as requested
      }
    }
  }, [location]);

  useEffect(() => {
    // Delay video playback by 3 seconds to show thumbnail
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#09060E] via-[#2D1D29] to-[#694230]">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative w-full max-w-[1728px] mx-auto h-[223px] sm:h-[320px] md:h-[500px] lg:h-screen flex items-center text-white overflow-hidden transition-all duration-500 ease-in-out`}
      >

        {/* Floating Video Container */}
        <div
          className={`transition-all duration-700 ease-in-out z-50 overflow-hidden bg-black
            ${isFloating
              ? 'fixed top-24 right-5 w-[280px] h-[158px] md:w-[400px] md:h-[225px] rounded-xl shadow-2xl border-2 border-white/20'
              : 'absolute top-0 left-0 w-full h-full rounded-none border-0'
            }`}
        >
          <video
            ref={videoRef}
            poster={hero}
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>

          {/* Mute/Unmute Button - Moves with video */}
          <div
            onClick={() => setIsMuted(!isMuted)}
            className={`absolute z-10 flex items-center justify-center cursor-pointer bg-[#492F30]/80 rounded-full text-white hover:bg-[#492F30] transition-colors
              ${isFloating ? 'bottom-2 right-2 w-8 h-8 scale-75' : 'bottom-4 right-4 sm:bottom-10 sm:right-6 w-8 h-8 sm:w-12 sm:h-12'}
            `}
          >
            {isMuted ? <VolumeX size={isFloating ? 20 : 24} /> : <Volume2 size={isFloating ? 20 : 24} />}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-20 mt-10">
        {/* Header */}
        <h2 className="text-center text-white font-extrabold text-3xl md:text-5xl libre-franklin leading-tight tracking-wide">
          People’s Interest, Our Interest
        </h2>

        {/* Description */}
        <p className="libre-franklin font-semibold text-base md:text-xl text-justify text-white my-10 max-w-5xl mx-auto">
          We are building Kerala’s largest freelancer community, a platform where independent professionals can connect,
          collaborate, and grow together. Whether you're a beginner or an expert, our community offers resources, training,
          and networking opportunities to help you thrive.
        </p>

        {/* Flex Section: Text + Image */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-24">
          {/* Text */}
          <div className="flex flex-col gap-7 w-full md:w-100%">
            <h2 className="libre-franklin text-white font-extrabold text-2xl md:text-5xl text-center md:text-left">
              Become a Freelancer in 24 Hours
            </h2>

            <p className="libre-franklin text-white font-semibold text-lg md:text-xl text-justify md:text-justify leading-snug max-w-[783px] mx-auto">
              Are you ready to start your freelancing journey today? Gain control over <br />your career? We make it easy for you to start.
            </p>

            <p className="libre-franklin text-white font-semibold text-[20px] leading-[100%] text-justify max-w-[595px] mx-auto">
              You can become a freelancer in just 24 hours.
            </p>

            <p
              className="libre-franklin text-white font-semibold text-[25px] leading-[1] text-center px-[18.75px] py-[9.37px] rounded-[3.75px] max-w-[334.5px] mx-auto"
            >
              Join us to know more
            </p>

          </div>

          {/* Image */}
          <img src={freeLancer} alt="freelancer art" className="w-full md:w-[400px] object-contain" />
        </div>

        {/* Bottom full-width image */}
        <img src={group2} alt="section visual" className="w-full mt-10 rounded-lg object-cover" />
      </section>


      <section className="banner my-10">
        <div className="overflow-hidden w-full bg-gradient-to-r from-[#FFC100] to-[#FF9D00] py-5">
          <div className="whitespace-nowrap scroll-animation flex gap-5 px-4">
            {/* Render enough copies to fill wide screens */}
            {[...Array(10)].map((_, i) => (
              companyArray.map((img, index) => (
                <img key={`${i}-${index}`} src={img} alt={`company-${i}-${index}`} className="w-[150px] h-[60px] inline-block object-contain" />
              ))
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-5 px-4 md:px-20 mt-10">
        {/* Card 1 - Compact (40%) */}
        <div className="md:col-span-2 bg-black rounded-[15px] p-15 flex flex-col justify-between text-white shadow-md">
          <p className="text-base md:text-xl leading-relaxed">
            "TrackPi is a platform that helps freelancers manage their projects. Our goal is to make freelancing seamless and profitable for everyone."
          </p>
          <p className="text-[#FFC727] font-extrabold text-3xl mt-4">What is TrackPi?</p>
        </div>

        {/* Card 2 - Wide (60%) */}
        <div className="md:col-span-3 bg-black rounded-[15px] p-15 flex flex-col justify-between text-white shadow-md">
          <p className="text-base md:text-xl leading-relaxed">
            "Freelancing is a way of working where individuals offer their skills and services on a project basis rather than being employed full-time by a single company. It allows for flexibility, independence, and diverse work opportunities."
          </p>
          <p className="text-[#FFC727] font-extrabold text-3xl mt-4">What is Freelancing?</p>
        </div>

        {/* Card 3 - Wide (60%) */}
        <div className="md:col-span-3 bg-black rounded-[15px] p-15 flex flex-col justify-between text-white shadow-md">
          <p className="text-base md:text-xl leading-relaxed">
            Access to high-quality projects from verified clients. A supportive network of like-minded freelancers. Free training courses to upskill and grow. Secure and timely payments for your work.
          </p>
          <p className="text-[#FFC727] font-extrabold text-3xl mt-4">Why Join TrackPi's Freelancer Community?</p>
        </div>

        {/* Card 4 - Compact (40%) */}
        <div className="md:col-span-2 bg-black rounded-[15px] p-15 flex flex-col justify-between text-white shadow-md">
          <p className="text-base md:text-xl leading-relaxed">
            Gain essential freelancing knowledge by Complete Training. Unlock the Freelancer Marketplace – Start receiving project offers. Work & Get Paid – Deliver quality work and earn.
          </p>
          <p className="text-[#FFC727] font-extrabold text-3xl mt-4">How It Works?</p>
        </div>
      </section>


      <section className='px-4 md:px-10 mt-20'>
        <h2 className='libre-franklin font-bold text-4xl md:text-6xl text-center text-white mb-10 tracking-wide'>High-Resolution Benefits</h2>

        <div className='flex flex-col md:flex-row items-center gap-10 md:gap-32 mb-12 md:mb-32'>
          <div className='flex flex-col justify-center gap-5 md:w-1/2'>
            <h3 className='libre-franklin text-white font-extrabold text-3xl md:text-5xl text-center'>Who We Are?</h3>
            <p className='urbanist font-normal text-lg md:text-2xl text-justify text-white'>
              We’re here to change how the world works—from business as usual to brave new work. It takes an unusual person to disrupt decades of tradition and guide hundreds or thousands of people through an experience that demands their bravery, vulnerability, and curiosity. It takes conviction to join a decentralized, self-managing, public benefit corporation where reputation matters more than position.
            </p>
          </div>
          <img src={group3} alt="group image" className='w-[300px] h-[200px] md:w-[500px] md:h-[400px] rounded-[10px] object-cover' />
        </div>


        <div className='flex flex-col md:flex-row-reverse items-center gap-10 md:gap-32 mb-20'>
          <div className='flex flex-col justify-center gap-5 md:w-1/2'>
            <h3 className='libre-franklin text-white font-extrabold text-3xl md:text-5xl text-center'>Who We Are?</h3>
            <p className='urbanist font-normal text-lg md:text-2xl text-justify text-white'>
              The people who make up The Ready are specialists in the ways of organizational culture and transformation. Yet within that world we are generalists drawing freely from the principles and practices of dozens of theories and hundreds of iconoclastic firms. We are coaches, facilitators, academics, psychologists, technologists, and corporate veterans who have found each other in our quest to make work better. Our backgrounds are varied but our ambition is united.
            </p>
          </div>
          <img src={group4} alt="group image" className="w-[300px] h-[200px] md:w-[500px] md:h-[400px] rounded-[10px] object-cover" />
        </div>

      </section>

      <div id="signup-section">
        <Signup />
      </div>
      <FloatingIcons />
    </div>
  );
}

export default Home;
