import React from 'react'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import Background2 from '../components/Background2'

const Aboutpage = () => {
  return (

<div className="bg-gradient-to-br from-[#09060E] via-[#2D1D29] to-[#694230] min-h-screen">
      <div className="relative w-full min-h-screen">
        {/* TOP HERO SECTION */}
        <div className="relative w-full">
          {/* Hero Section */}
          <div className="relative w-full h-[223px] sm:h-[320px] md:h-[500px] lg:h-screen overflow-hidden">
            <img
              src="/about main.png"
              alt="Background"
              className="w-full h-full object-cover bg-transparent"
              style={{ backgroundColor: 'transparent' }}
            />
            <div className="absolute inset-0 bg-/50 z-10" />
            <div className="absolute z-20 w-full flex justify-center bottom-[10px] sm:inset-0 sm:items-center sm:justify-center">
              <h1 className="text-white text-center font-[800] leading-[100%] tracking-[0.05em] font-libre text-[24px] sm:text-[68px] w-[90%] sm:w-[472px] sm:h-[82px] whitespace-nowrap">
                Who We Are?
              </h1>   
            </div>
            <div className="hidden sm:flex absolute bottom-[10px] left-0 right-0 justify-center z-20">
              <h2 className="text-white text-center font-[800] text-[60px] leading-[100%] tracking-normal font-libre w-[1728px] h-[73px]">
                About Our Company
              </h2>
            </div>
          </div>
          <div className="sm:hidden flex justify-center mt-2">
            <h2 className="text-white text-center font-[800] text-[20px] leading-[100%] tracking-normal font-libre">
              About Our Company
            </h2>
          </div>
        </div>

        {/* About Our Company – for mobile only */}
        <div className="sm:hidden flex justify-center mt-2">
          <h2 className="text-white text-center font-[800] text-[20px] leading-[100%] tracking-normal font-libre">
            About Our Company
          </h2>
        </div>
      </div>

      {/* MAIN SECTION BELOW HERO */}
      <div className="flex flex-col w-full max-w-[1728px] mx-auto px-[20px] md:px-[90px] gap-[60px] pt-[40px]">

        {/* TEXT + IMAGE SECTION */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[500px] gap-[20px] md:gap-[80px] px-[5px] md:px-0 mt-0 md:mt-[36px] mx-auto">

          {/* Left */}
          <div className="flex flex-col items-center w-[310px] md:w-full md:max-w-[898px] gap-[15px] md:gap-[30px] mx-auto">
            <h1 className="text-[24px] md:text-[50px] leading-[100%] tracking-[0.05em] font-[800] font-libre text-white text-center">
              We are Trackpi
            </h1>
            <p className="text-[12px] md:text-[24px] leading-[16px] md:leading-[36px] font-urbanist font-[500] text-white text-justify w-full md:max-w-[898px] md:h-[180px] overflow-hidden">
              Trackpi is one of the best business consulting firms in Kerala. We have a highly experienced team that develops strategies to promote growth and development. With our expert consulting services, we help businesses thrive in a competitive environment. Our customer-focused strategy guarantees customized solutions that promote effectiveness and sustained success.
            </p>
          </div>

          {/* Right - Image */}
          <div className="w-full md:w-[590px] h-auto md:h-[500px] flex justify-center items-center md:mt-[-90px]">
            <img
              src="/aboutimg1.png"
              alt="About Trackpi"
              className="w-[270px] h-[170px] md:w-[590px] md:h-[500px] rounded-[10px] md:rounded-xl object-contain"
            />
          </div>
        </div>

        {/* JOIN US SECTION */}
        <div className="w-full max-w-[1728px] h-auto md:h-[626px] flex flex-col-reverse md:flex-row gap-[40px] md:gap-[80px] mx-auto px-[16px] md:px-0 mt-0 md:-mt-[200px]">

          {/* Left Side - Image */}
          <div className="w-full flex justify-center md:justify-start">
            <div className="w-full max-w-[270px] h-auto max-h-[170px] md:max-w-[600px] md:max-h-[500px] rounded-[10px] md:rounded-xl overflow-hidden">
              <img
                src="/aboutimg2.png"
                alt="About Trackpi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>


          {/* Right Side - Text */}
          <div className="flex flex-col w-full md:max-w-[888px] h-auto md:h-[548px] gap-[15px] md:gap-[30px] justify-start md:justify-center">
            <h2 className="text-[20px] leading-[28px] font-extrabold font-libre text-white text-center md:text-left md:text-[40px] md:leading-[48px]">
              <span className="block">Join Us – The Largest</span>
              <span className="block">Freelancers Community in Kerala</span>
            </h2>
            <p className="text-[12px] leading-[16px] font-urbanist font-medium tracking-[0em] text-white text-justify w-full md:w-[888px] md:text-[24px] md:leading-[36px] md:h-[144px]">
              Trackpi invites you to explore freelancing—no prior experience required. Whether you're seeking side income or a flexible career, we provide the support and tools you need. All it takes is commitment and curiosity. Begin your journey with Trackpi today.
            </p>
            <p className="text-[12px] leading-[16px] font-urbanist font-medium tracking-[0em] text-white text-justify w-full md:w-[888px] md:text-[24px] md:leading-[36px] md:h-[216px]">
              Our platform welcomes everyone—students, professionals, and retirees looking to grow and connect. Trackpi offers flexibility, resources, and a network to thrive in today’s digital world. Build your skills, increase your income, and become part of something meaningful. Whether you're starting out or re-entering the workforce, Trackpi is your trusted partner. We’re here to support your progress. Join our vibrant freelance community now.
            </p>
          </div>
        </div>

        {/* FINAL SECTION */}
        <div className="flex flex-col md:flex-row w-full h-auto gap-[20px] md:gap-[80px] mt-[40px] md:mt-0 px-[16px] md:px-0">

          {/* Left */}
          <div className="flex flex-col items-center w-full md:max-w-[898px] h-auto md:h-[500px] gap-[15px] md:gap-[30px] mx-auto">
            <h1 className="text-[20px] md:text-[50px] leading-[100%] tracking-[0.05em] font-[800] font-libre text-white text-center">
              We are Trackpi
            </h1>
            <p className="text-[12px] leading-[16px] md:text-[24px] md:leading-[36px] font-[500] font-urbanist text-justify tracking-[0em] text-white w-full md:max-w-[898px]">
              Trackpi is one of the top business consulting firms in Kerala. Our experienced team designs tailored strategies for sustainable growth. We guide companies to succeed in competitive markets. Every solution is client-focused and result-driven. Our mission ensures value, impact, and long-term success.
            </p>
          </div>

          {/* Right - Image */}
          <div className="w-full md:w-[590px] h-auto md:h-[500px] flex justify-center items-center md:mt-[-90px]">
            <img
              src="/aboutimg3.png"
              alt="About Trackpi"
              className="w-[270px] h-[170px] md:w-[590px] md:h-[500px] rounded-[10px] md:rounded-xl object-contain"
            />
          </div>
        </div>
      </div>

    </div>

  )
}

export default Aboutpage
