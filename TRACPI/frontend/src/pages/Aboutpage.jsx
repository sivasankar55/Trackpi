import React from 'react';
import FloatingIcons from '../components/FloatingIcons';

const Aboutpage = () => {
  return (
    <div className="bg-[#2D1D29] min-h-screen font-sans text-white relative overflow-x-hidden">
      <FloatingIcons />
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#09060E] via-[#2D1D29] to-[#694230] opacity-90 z-0 pointer-events-none" />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full">

        {/* TOP HERO SECTION */}
        <div className="relative w-full h-[223px] sm:h-[320px] md:h-[500px] lg:h-screen">
          <img
            src="/about main.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">
              Who We Are?
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 flex flex-col gap-24 md:gap-32">

          {/* SECTION 1: About Our Company */}
          <div className="flex flex-col gap-12">
            {/* Display header centered on desktop */}
            <h2 className="text-white font-[800] text-3xl md:text-5xl font-libre text-center tracking-wide">
              About Our Company
            </h2>

            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-16">
              <div className="flex flex-col gap-6 text-center md:text-left flex-1">
                <h1 className="text-white font-[800] text-3xl md:text-4xl font-libre">
                  We are Trackpi
                </h1>
                <p className="font-urbanist font-[500] text-base md:text-lg text-white/90 text-justify leading-relaxed">
                  Trackpi is one of the best business consulting firms in Kerala. We have a highly experienced team that develops strategies to promote growth and development. With our expert consulting services, we help businesses thrive in a competitive environment. Our customer-focused strategy guarantees customized solutions that promote effectiveness and sustained success.
                </p>
              </div>
              {/* Image */}
              <div className="w-full md:w-1/2 max-w-[500px] mx-auto">
                <img
                  src="/aboutimg1.png"
                  alt="Team"
                  className="w-full h-auto rounded-xl shadow-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Join Us (With Decorative Circles) */}
          <div className="relative flex flex-col items-center gap-10 md:flex-row-reverse md:items-center md:gap-20">

            {/* Decorative Circles Container - Positioned to be behind the image on Desktop (Left side) */}
            <div className="absolute left-[-50px] top-1/2 -translate-y-1/2 flex flex-col gap-6 z-0 opacity-80 hidden md:flex pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#FFC100] to-[#FF9D00] blur-xl" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFC100] to-[#FF9D00] ml-12 blur-md" />
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#FFC100] to-[#FF9D00] -ml-6 blur-xl" />
            </div>

            {/* Mobile Decorative Circles */}
            <div className="absolute left-[-20px] top-[10%] flex flex-col gap-20 z-0 sm:hidden pointer-events-none opacity-60">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFC100] to-[#FF9D00] blur-md" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFC100] to-[#FF9D00] translate-x-12 blur-md" />
            </div>


            {/* Text Content */}
            <div className="flex flex-col gap-6 text-center md:text-left flex-1 relative z-10 p-2 md:p-0">
              <h1 className="text-white font-[800] text-3xl md:text-4xl font-libre leading-tight">
                Join Us – The Largest <br /> Freelancers Community in Kerala
              </h1>
              <div className="font-urbanist font-[500] text-base md:text-lg text-white/90 text-justify leading-relaxed space-y-6">
                <p>
                  Trackpi is excited to offer you an opportunity to join us, even without prior experience. If you’re looking to earn additional income, look no further—Trackpi provides the perfect platform to get started. All you need is passion and skills to embark on your journey.
                </p>
                <p>
                  Trackpi welcomes freelancers at various stages of life—students, working professionals, and even senior citizens seeking self-enhancement and accomplishment. Work from home and potentially earn more while being part of a thriving freelance community. Join us today to take advantage of opportunities that foster your growth and development while contributing to a diverse and dynamic community.
                </p>
              </div>
            </div>

            {/* Image - Left on Desktop via row-reverse */}
            <div className="w-full md:w-1/2 max-w-[500px] mx-auto relative z-10">
              <img
                src="/aboutimg2.png"
                alt="Community"
                className="w-full h-auto rounded-xl shadow-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* SECTION 3: We are Trackpi (Repeated Block) */}
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-16">
            <div className="flex flex-col gap-6 text-center md:text-left flex-1">
              <h1 className="text-white font-[800] text-3xl md:text-4xl font-libre">
                We are Trackpi
              </h1>
              <p className="font-urbanist font-[500] text-base md:text-lg text-white/90 text-justify leading-relaxed">
                Trackpi is one of the best business consulting firms in Kerala. We have a highly experienced team that develops strategies to promote growth and development. With our expert consulting services, we help businesses thrive in a competitive environment. Our customer-focused strategy guarantees customized solutions that promote effectiveness and sustained success.
              </p>
            </div>
            {/* Image */}
            <div className="w-full md:w-1/2 max-w-[500px] mx-auto">
              <img
                src="/aboutimg3.png"
                alt="Team Meeting"
                className="w-full h-auto rounded-xl shadow-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Aboutpage
