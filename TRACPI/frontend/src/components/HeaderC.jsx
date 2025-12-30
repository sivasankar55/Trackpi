import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
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
  const { logout } = useContext(AdminAuthContext);

  const isCourseActive = location.pathname.startsWith('/admin/course-management') || location.pathname.startsWith('/admin/add-course');
  const isUserManagementActive = location.pathname.startsWith('/admin/user-management');

  return (
    <div className="w-[315px] h-screen sticky top-0 bg-[#FFF8E7] border-r border-[#FF9D00] flex flex-col pt-10 font-['Poppins'] flex-shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex justify-center mb-12">
        <img src={Logo} alt="TrackPi" className="w-[120px] h-auto object-contain" />
      </div>

      {/* Main Nav Links */}
      <div className="flex flex-col gap-4 px-6 flex-1">
        {[
          { icon: <MdDashboard size={22} />, label: 'Dashboard', path: '/admin-dashboard' },
          { icon: <FaUserCog size={22} />, label: 'Admin Management', path: '/admin/admin-management' },
          { icon: <FaUsers size={22} />, label: 'User Management', path: '/admin/user-management' },
          { icon: <FaChalkboardTeacher size={22} />, label: 'Course Management', path: '/admin/course-management' },
          { icon: <FaChartBar size={22} />, label: 'Progress Tracking', path: '/admin/progress-tracking' },
          { icon: <FaCommentDots size={22} />, label: 'Feedback', path: '/feedback' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-4 px-6 py-3 rounded-[15px] transition-all duration-300 ${(item.path === '/admin/user-management' && isUserManagementActive) || (item.path !== '/admin/user-management' && location.pathname === item.path) || (item.label === 'Course Management' && isCourseActive)
              ? 'bg-[#FF9D00] text-white shadow-md'
              : 'text-gray-700 hover:bg-[#FFB30020]'
              }`}
          >
            <span className={item.path === location.pathname || (item.path === '/admin/user-management' && isUserManagementActive) ? 'text-white' : 'text-gray-600'}>
              {item.icon}
            </span>
            <span className={`text-[15px] font-medium tracking-wide ${(item.path === '/admin/user-management' && isUserManagementActive) || (item.path !== '/admin/user-management' && location.pathname === item.path) ? 'text-white' : 'text-gray-700'
              }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Bottom Nav Links */}
      <div className="px-6 flex flex-col gap-4 pb-10 border-t border-gray-100 pt-8">
        {[
          { icon: <FaUser size={20} />, label: 'Profile', path: '/admin/profile' },
          { icon: <FaCog size={20} />, label: 'Settings', path: '/admin/settings' },
          { icon: <FaSignOutAlt size={20} />, label: 'Log Out', action: logout },
        ].map((item) => (
          item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-2.5 rounded-[15px] transition-all duration-300 ${location.pathname === item.path
                ? 'bg-[#FF9D00] text-white shadow-md'
                : 'text-gray-700 hover:bg-[#FFB30020]'
                }`}
            >
              <span className={location.pathname === item.path ? 'text-white' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className="text-[15px] font-medium">{item.label}</span>
            </Link>
          ) : (
            <div
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-4 px-6 py-2.5 text-gray-700 hover:text-[#FF9D00] cursor-pointer group transition-all"
            >
              <span className="text-gray-500 group-hover:text-[#FF9D00] transition-colors">
                {item.icon}
              </span>
              <span className="text-[15px] font-medium">{item.label}</span>
            </div>
          )
        ))}

        {/* Backup Info */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Last backuped</p>
          <p className="text-[11px] text-gray-400 font-semibold mt-1">June 03 2025, 12:45pm</p>
        </div>
      </div>
    </div>
  );
};


export default HeaderC;
