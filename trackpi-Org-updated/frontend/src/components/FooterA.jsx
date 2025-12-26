import React from 'react'
import logo from '../assets/targetpi logo.png'
import facebookLogo from '../assets/facebook.png'
import youtubeLogo from '../assets/youtube.png'
import instagramLogo from '../assets/instagram.png'
import MLogo from '../assets/mLogo.png'
import linkedinLogo from '../assets/linkedIn.png'
import searchIcon from '../assets/search.png'
import lastIcon from '../assets/last.png'
import Phone from '../assets/phone.png'
import Mail from '../assets/mail.png'
import Location from '../assets/location.png'

const FooterA=()=> {
  return (
    <div>
        <footer className="bg-[#0A0A0A]  w-full py-6 px-4 md:px-5 lg:px-5 rounded-lg">
            <div className="mt-[20px] max-w-7xl mx-5 flex flex-col items-center gap-5 justify-between h-auto md:h-72 lg:flex-row lg:items-start lg:h-auto pb-4">

                {/* Subcontainer 1: Logo, Paragraph, Social Media */}
                <div className="w-full lg:w-[430px] flex flex-col items-center lg:items-start gap-6 mb-8 lg:mb-0">
                    {/* Frame 741: Image */}
                    <div className="w-[270px] h-[87px]">
                        <img
                            src={logo} 
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Paragraph */}
                    <p className="text-white text-[18px] leading-[28px] text-center lg:text-left max-w-sm font-urbanist-500">
                        Empowering businesses to succeed through expert guidance and personalized solutions. Unlocking potential and achieving success.
                    </p>

                    {/* Social Media Logo Container - Using Local PNGs */}
                    <div className="flex gap-6 mt-4 text-white">
                        {/* Facebook PNG */}
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full  hover:border-gray-400 overflow-hidden">
                            <img
                                src={facebookLogo}
                                alt="Facebook"
                                className="w-6 h-auto object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/000000/FFFFFF?text=F" }} // Fallback
                            />
                        </a>
                        {/* YouTube PNG */}
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full  hover:border-gray-400 overflow-hidden">
                            <img
                                src={youtubeLogo}
                                alt="YouTube"
                                className="w-6 h-auto  object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/000000/FFFFFF?text=Y" }} // Fallback
                            />
                        </a>
                        {/* Instagram PNG */}
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full  hover:border-gray-400 overflow-hidden">
                            <img
                                src={instagramLogo}
                                alt="Instagram"
                                className="w-6 h-auto  object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/000000/FFFFFF?text=I" }} // Fallback
                            />
                        </a>
                         {/* M PNG */}
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full  hover:border-gray-400 overflow-hidden">
                            <img
                                src={MLogo}
                                alt="Twitter"
                                className="w-6 h-auto  object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/000000/FFFFFF?text=T" }} // Fallback
                            />
                        </a>
                        {/* LinkedIn PNG */}
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full  hover:border-gray-400 overflow-hidden">
                            <img
                                src={linkedinLogo}
                                alt="LinkedIn"
                                className="w-6 h-auto  object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/000000/FFFFFF?text=L" }} // Fallback
                            />
                        </a>
                       
                        {/* Search/Generic PNG (assuming a generic search icon like 'la_search.png') */}
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full hover:border-gray-400 overflow-hidden">
                            <img
                                src={searchIcon}
                                alt="Search"
                                className="w-6 h-auto object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/000000/FFFFFF?text=S" }} // Fallback
                            />
                        </a>
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full hover:border-gray-400 overflow-hidden">
                            <img
                                src={lastIcon}
                                alt="Search"
                                className="w-6 h-auto  object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/000000/FFFFFF?text=S" }} // Fallback
                            />
                        </a>
                        
                    </div>
                </div>

                {/* Subcontainer 2: Links, Services, Contact */}
                <div className="w-full lg:w-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mt-8 lg:mt-0 text-center md:text-left">

                    {/* Link Container */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-[24px] leading-[100%] font-urbanist-600 mb-2">Links</h3>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Home</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">About</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Connect Us</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Creators</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Terms and Condition</a></li>
                        </ul>
                    </div>

                    {/* Services Container */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-[24px] leading-[100%] font-urbanist-600 mb-2">Services</h3>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Software development</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Sales training</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Operation training</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Software development</a></li>
                            <li><a href="#" className="text-white text-[18px] leading-[100%] font-urbanist-500 hover:underline">Sales training</a></li>
                            <li><a href="#" className="text-[18px] leading-[100%] font-urbanist-500 hover:underline">Operation training</a></li>
                        </ul>
                    </div>

                    {/* Contact Container */}
                    {/* Contact Container */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-[24px] leading-[100%] font-urbanist-600 mb-2">Contact</h3>
                        <div className="flex flex-col gap-3 items-center md:items-start">
                            <div className="flex items-start gap-3">
                                {/* Location icon as PNG */}
                                <img
                                    src={Location} // Path relative to public folder root
                                    alt="Location"
                                    className="w-6 h-6 mt-1" // Tailwind classes for sizing and margin-top
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/24x24/000000/FFFFFF?text=L" }} // Fallback
                                />
                                <p className="text-white text-[18px] leading-[28px] max-w-[218px] text-center md:text-left font-urbanist-500">
                                    Trackpi Private Limited, IOE BCG Tower, Opp. CSEZ Seaport-Airport Rd, Kakkanad, Kochi, Kerala - 682037, India
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Phone icon as PNG */}
                                <img
                                    src={Phone} // Path relative to public folder root
                                    alt="Phone"
                                    className="w-6 h-6" // Tailwind classes for sizing
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/24x24/000000/FFFFFF?text=P" }} // Fallback
                                />
                                <p className="text-white text-[18px] leading-[100%] font-urbanist-500">+91 9538610745</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Mail icon as PNG */}
                                <img
                                    src={Mail} // Path relative to public folder root
                                    alt="Email"
                                    className="w-6 h-6" // Tailwind classes for sizing
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/24x24/000000/FFFFFF?text=M" }} // Fallback
                                />
                                <p className="text-white text-[18px] leading-[100%] font-urbanist-500">operations@trackpi.in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal line and copyright text */}
            <div className="border-t border-gray-700 pt-4 mt-8">
                <p className="text-white text-[14px] leading-[100%] text-center font-urbanist-500">
                    &copy;2025 TrackPi Private Limited. All rights reserved.
                </p>
            </div>
        </footer>
    </div>
  )
}

export default FooterA
