import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import {
  FaUserCog,
  FaUsers,
  FaChalkboardTeacher,
  FaChartBar,
  FaCommentDots,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

import Logo from '../assets/targetpi logo.png'; // adjust if file is in different folder

const HeaderC = () => {
  const location = useLocation();
  
  return (
    <div className="flex font-[Poppins] h-[960px]">

      {/* Sidebar */}
      <div className="w-[315px] h-[960px] bg-[#FFF0CE] border-r-[2px] border-[#FF9D00] rounded-tr-[20px] rounded-br-[20px] pt-[40px] flex flex-col gap-[54px] overflow-hidden">

        {/* Logo */}
        <div className="flex justify-center">
          <img src={Logo} alt="Logo" className="w-[108.8px] h-[64px]" />
        </div>

        {/* Main Nav Links */}
        <div className="flex flex-col gap-[20px] px-4">

          {/* Dashboard */}
          <Link 
            to="/admin-dashboard" 
            className={`flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] cursor-pointer ${
              location.pathname === '/admin-dashboard' ? 'bg-[#FFB300]' : 'hover:bg-[#FFE29D]'
            }`}
          >
            <MdDashboard className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Dashboard
            </span>
          </Link>

          {/* Admin Management */}
          <Link 
            to="/admin/admin-management" 
            className={`flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] cursor-pointer ${
              location.pathname === '/admin/admin-management' ? 'bg-[#FFB300]' : 'hover:bg-[#FFE29D]'
            }`}
          >
            <FaUserCog className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Admin Management
            </span>
          </Link>

          {/* User Management */}
          <Link 
            to="/admin/user-management" 
            className={`flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] cursor-pointer ${
              location.pathname === '/admin/user-management' ? 'bg-[#FFB300]' : 'hover:bg-[#FFE29D]'
            }`}
          >
            <FaUsers className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              User Management
            </span>
          </Link>

          {/* Course Management */}
          <div className="flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] hover:bg-[#FFE29D] cursor-pointer">
            <FaChalkboardTeacher className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Course Management
            </span>
          </div>

          {/* Progress Tracking */}
          <div className="flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] hover:bg-[#FFE29D] cursor-pointer">
            <FaChartBar className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Progress Tracking
            </span>
          </div>

          {/* Feedback */}
          <div className="flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] hover:bg-[#FFE29D] cursor-pointer">
            <FaCommentDots className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Feedback
            </span>
          </div>
        </div>

        {/* Bottom Nav Links + Backup Info */}
        <div className="mt-auto px-4 flex flex-col gap-[20px]">

          {/* Profile */}
          <div className="flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] hover:bg-[#FFE29D] cursor-pointer">
            <FaUser className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Profile
            </span>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] hover:bg-[#FFE29D] cursor-pointer">
            <FaCog className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Settings
            </span>
          </div>

          {/* Logout */}
          <div className="flex items-center gap-[15px] px-[43px] py-[10px] h-[44px] rounded-[18px] hover:bg-[#FFE29D] cursor-pointer">
            <FaSignOutAlt className="w-[24px] h-[24px] text-[#0A0A0A]" />
            <span className="text-[#0A0A0A] text-[16px] font-[400] tracking-[0.02em] leading-[100%]">
              Log Out
            </span>
          </div>

          {/* Last Backup Info */}
          <div className="text-center mt-5 pb-4">
            <p className="text-[10px] font-medium opacity-70 tracking-[0.02em] text-[#0A0A0A] leading-[100%]">
              Last backuped
            </p>
            <p className="text-[10px] font-normal opacity-70 tracking-[0.02em] text-[#0A0A0A] leading-[100%]">
              June 08 2025, 11:45pm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderC;
