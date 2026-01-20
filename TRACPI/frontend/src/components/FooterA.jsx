import React from 'react';
import logo from '../assets/targetpi logo.png';
import { FaFacebookF, FaYoutube, FaInstagram, FaMediumM, FaLinkedinIn, FaSearch, FaBloggerB } from "react-icons/fa";
import { FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6"; // Usage of fa6 for newer icons if available, or just stick to fa for consistency if needed. specific imports are safer.
import { HiLocationMarker } from "react-icons/hi"; // Alternative for location if fa6 fails or similar.
// Actually standard Fa icons are usually safe.

const FooterA = () => {
    return (
        <div>
            <footer className="bg-[#0A0A0A] w-full py-8 px-5 lg:px-10 rounded-lg">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20">

                    {/* Left Column (Mobile: Top) */}
                    <div className="w-full lg:w-[400px] flex flex-col items-center lg:items-start gap-6">
                        {/* Logo */}
                        <div className="w-[200px] md:w-[270px]">
                            <img
                                src={logo}
                                alt="TrackPi Logo"
                                className="w-full h-auto object-contain"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-white text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-center lg:text-left font-urbanist-500">
                            Empowering businesses to succeed through expert guidance and personalized solutions. Unlocking potential and achieving success.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 sm:gap-6 mt-2">
                            {[
                                { Icon: FaFacebookF, href: "#" },
                                { Icon: FaYoutube, href: "#" },
                                { Icon: FaInstagram, href: "#" },
                                { Icon: FaMediumM, href: "#" },
                                { Icon: FaLinkedinIn, href: "#" },
                                { Icon: FaSearch, href: "#" },
                                { Icon: FaBloggerB, href: "#" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#FFB200] text-[#FFB200] hover:bg-[#FFB200] hover:text-black transition-all duration-300"
                                >
                                    <social.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Columns (Mobile: Bottom List) */}
                    <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 text-left">

                        {/* Links */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white text-[24px] font-semibold font-urbanist-600">Links</h3>
                            <ul className="flex flex-col gap-3">
                                {["Home", "About", "Connect Us", "Creators", "Terms & Conditions"].map((item, i) => (
                                    <li key={i}>
                                        <a href="#" className="text-white text-[16px] md:text-[18px] font-urbanist-500 hover:text-[#FFB200] transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white text-[24px] font-semibold font-urbanist-600">Services</h3>
                            <ul className="flex flex-col gap-3">
                                {["Software development", "Sales training", "Operations training", "Software development", "Sales training", "Operations training"].map((item, i) => (
                                    <li key={i}>
                                        <a href="#" className="text-white text-[16px] md:text-[18px] font-urbanist-500 hover:text-[#FFB200] transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white text-[24px] font-semibold font-urbanist-600">Contact</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FFB200] text-black shrink-0 mt-1">
                                        <FaLocationDot className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-white text-[16px] md:text-[18px] leading-[26px]">
                                        Trackpi Private Limited, 10E BCG Tower, Opp. CSEZ, Seaport-Airport Rd, Kakkanad, Kochi, Kerala - 682037, India
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FFB200] text-black shrink-0">
                                        <FaPhone className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-white text-[16px] md:text-[18px]">+91 9538610745</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FFB200] text-black shrink-0">
                                        <FaEnvelope className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-white text-[16px] md:text-[18px] break-all">operations@trackpi.in</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 mt-12 pt-6 text-center">
                    <p className="text-gray-400 text-[14px]">
                        &copy; 2024 TrackPi Private Limited. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default FooterA;
