import React, { useRef } from 'react';
import Signup from '../components/Signup';
import hero from '../assets/hero.png';
import freeLancer from '../assets/freelancer.png';
import group2 from '../assets/group2.png';
import luminar from '../assets/luminar.png';
import IIDM from '../assets/IIDM.jpg';
import tech from '../assets/tech.jpg';
import trade from '../assets/trade.png';
import group3 from '../assets/group3.png';
import group4 from '../assets/group4.png';
import { Play, Volume2 } from 'lucide-react';

function Home() {
  const companyArray = [luminar, IIDM, tech, trade];

  return (
    <div className="bg-gradient-to-br from-[#09060E] via-[#2D1D29] to-[#694230]">
      {/* Hero Section */}
      <section className="relative h-[100vh] md:h-[630px] flex items-center text-white overflow-hidden">
        <img
          src={hero}
          alt="Hero background"
          className="absolute top-0 left-0 w-full h-full object-cover -scale-x-100"
        />
        <div className="relative z-10 text-center px-4 md:px-[48px] max-w-[993px] mx-auto">
          <h1 className="text-white font-bold leading-[1.1] text-[8vw] sm:text-[4vw] drop-shadow-md">
            Kerala's Biggest Freelancer<br className="block sm:hidden" /> Community
          </h1>
          <p className="text-white mt-4 text-base sm:text-lg">
            Welcome to TrackPi Private Limited – Your Strategic Growth Partner.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-[8px] font-semibold cursor-pointer roboto transition-all duration-300">
            ▶ Watch Now
          </button>
        </div>

        <div className='absolute bottom-10 right-6 z-10 w-12 h-12 bg-[#492F30] rounded-full flex items-center justify-center cursor-pointer'>
          <Volume2 className='' />
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
              Are you ready to start your freelancing journey today? Gain control over <br/>your career? We make it easy for you to start.
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
            {companyArray.map((img, index) => (
              <img key={index} src={img} alt={`company-${index}`} className="w-[150px] h-[60px] inline-block object-contain" />
            ))}
            {companyArray.map((img, index) => (
              <img key={`copy-${index}`} src={img} alt={`company-copy-${index}`} className="w-[150px] h-[60px] inline-block object-contain" />
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

        <div className='flex flex-col md:flex-row gap-30 mb-30'>
          <div className='flex flex-col justify-center gap-5 md:w-1/2'>
            <h3 className='libre-franklin text-white font-extrabold text-3xl md:text-5xl text-center'>Who We Are?</h3>
            <p className='urbanist font-normal text-lg md:text-2xl text-justify text-white'>
              We’re here to change how the world works—from business as usual to brave new work. It takes an unusual person to disrupt decades of tradition and guide hundreds or thousands of people through an experience that demands their bravery, vulnerability, and curiosity. It takes conviction to join a decentralized, self-managing, public benefit corporation where reputation matters more than position.
            </p>
          </div>
          <img src={group3} alt="group image" className='w-[300px] h-[200px] md:w-[500px] md:h-[400px] rounded-[10px] object-cover' />
        </div>
        

        <div className='flex flex-col md:flex-row-reverse gap-30 mb-20'>
          <div className='flex flex-col justify-center gap-5 md:w-1/2'>
            <h3 className='libre-franklin text-white font-extrabold text-3xl md:text-5xl text-center'>Who We Are?</h3>
            <p className='urbanist font-normal text-lg md:text-2xl text-justify text-white'>
              The people who make up The Ready are specialists in the ways of organizational culture and transformation. Yet within that world we are generalists drawing freely from the principles and practices of dozens of theories and hundreds of iconoclastic firms. We are coaches, facilitators, academics, psychologists, technologists, and corporate veterans who have found each other in our quest to make work better. Our backgrounds are varied but our ambition is united.
            </p>
          </div>
          <img src={group4} alt="group image" className="w-[300px] h-[200px] md:w-[500px] md:h-[400px] rounded-[10px] object-cover" />
        </div>
        
      </section>

      <Signup />
    </div>
  );
}

export default Home;
