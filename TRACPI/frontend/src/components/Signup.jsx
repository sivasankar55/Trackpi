import React from 'react'
import googleLogo from '../assets/google.png';
import socialLogo from '../assets/group.png';
import sectionImage from '../assets/sectionImage.png';

const Signup = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  }
  return (
    <>
      <div

        className="relative min-h-screen w-full flex items-center justify-center px-4 py-10 overflow-hidden bg-cover bg-center  "
        style={{ backgroundImage: `url(${sectionImage})` }}
      >
        {/* NO MORE <Background /> */}

        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-10 text-white relative z-10">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-2xl lg:text-5xl font-bold font-roboto mb-6">
              Freelancer Community
            </h1>

            <img
              src={socialLogo}
              alt="Freelancer Illustration"
              className="w-[300px] lg:w-[450px] h-auto mb-6"
            />

            <h2 className="text-[36px] font-medium font-roboto text-center mb-4 px-2">
              What does Kerala's Biggest Freelancer Community mean?
            </h2>

            <p className="text-[24px] font-normal font-roboto text-center leading-[140%] text-gray-200 max-w-[634px] mx-auto px-2">
              It represents a network of freelancers in Kerala who collaborate, share opportunities,
              and grow together in the <span className="text-yellow-400 font-medium">freelancing industry</span>.
            </p>

            <div className="flex items-center justify-center space-x-2 mt-6 lg:mt-10 mx-auto">
              <span className="w-[10px] h-[10px] rounded-[200px] bg-yellow-400"></span>
              <span className="w-[10px] h-[10px] rounded-[200px] bg-gray-600"></span>
              <span className="w-[10px] h-[10px] rounded-[200px] bg-yellow-400"></span>
            </div>
          </div>
          {/* RIGHT SIDE: LOGIN BOX */}
          <div
            className="w-full max-w-[550px] rounded-[40px] px-8 py-10 flex flex-col items-center text-center shadow-lg border border-transparent bg-opacity-80"
            style={{

              background: 'linear-gradient(117.87deg, #171717 -19.96%, rgba(23, 23, 23, 0.8) 96.5%)',
            }}
          >
            <h2 className="text-2xl font-semibold mb-6">
              Welcome To <span className="text-[#FF9D00]">TrackPi</span>
            </h2>


            {/* Google Login Button */}

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 border border-gray-400 px-12 py-3 rounded-full text-white font-semibold text-sm hover:bg-white hover:text-black transition cursor-pointer">
              <img src={googleLogo} alt="Google" className="w-5 h-5 object-contain" />
              Login with Google
            </button>


            <p className="text-xs text-gray-300 mt-4">
              Don’t have an Account? <span className="underline cursor-pointer text-blue-400">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup