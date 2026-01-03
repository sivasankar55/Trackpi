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
  FaWpforms,
} from 'react-icons/fa';

import Logo from '../assets/targetpi logo.png'; // adjust if file is in different folder

const HeaderC = () => {
  const location = useLocation();
  const { logout } = useContext(AdminAuthContext);

  const isCourseActive = location.pathname.startsWith('/admin/course-management') || location.pathname.startsWith('/admin/add-course');
  const isUserManagementActive = location.pathname.startsWith('/admin/user-management');

  const navItems = [
    { icon: <MdDashboard size={22} />, label: 'Dashboard', path: '/admin-dashboard', isStatic: true },
    { icon: <FaUserCog size={22} />, label: 'Admin Management', path: '/admin/admin-management' },
    { icon: <FaUsers size={22} />, label: 'User Management', path: '/admin/user-management' },
    { icon: <FaChalkboardTeacher size={22} />, label: 'Course Management', path: '/admin/course-management' },
    { icon: <FaChartBar size={22} />, label: 'Progress Tracking', path: '/admin/progress-tracking' },
    { icon: <FaWpforms size={22} />, label: 'Form Management', path: '/admin/form-management' },
    { icon: <FaCommentDots size={22} />, label: 'Feedback', path: '/feedback' },
  ];

  const bottomItems = [
    { icon: <FaUser size={20} />, label: 'Profile', path: '/admin/profile' },
    { icon: <FaCog size={20} />, label: 'Settings', path: '/admin/settings' },
    { icon: <FaSignOutAlt size={20} />, label: 'Log Out', action: logout },
  ];

  return (
    <div className="w-[315px] h-screen sticky top-0 bg-[#FFF3D0] flex flex-col pt-12 font-['Poppins'] flex-shrink-0">
      {/* Logo */}
      <div className="flex justify-center mb-16">
        <img src={Logo} alt="TrackPi" className="w-[110px] h-auto object-contain" />
      </div>

      {/* Main Nav Links */}
      <div className="flex flex-col gap-2 px-6 flex-1">
        {navItems.map((item) => {
          const isActive = (item.path === '/admin/user-management' && isUserManagementActive) ||
            (item.path !== '/admin/user-management' && location.pathname === item.path) ||
            (item.label === 'Course Management' && isCourseActive);

          if (item.isStatic) {
            return (
              <div
                key={item.label}
                className={`flex items-center gap-4 px-6 py-3.5 rounded-[15px] transition-all duration-300 ${isActive
                  ? 'bg-[#FF9D00] text-white shadow-[0px_4px_10px_rgba(255,157,0,0.3)]'
                  : 'text-gray-700'
                  } cursor-default`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-600'}>
                  {item.icon}
                </span>
                <span className={`text-[15px] font-semibold tracking-wide ${isActive ? 'text-white' : 'text-gray-700'
                  }`}>
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path || '#'}
              className={`flex items-center gap-4 px-6 py-3.5 rounded-[15px] transition-all duration-300 ${isActive
                ? 'bg-[#FF9D00] text-white shadow-[0px_4px_10px_rgba(255,157,0,0.3)]'
                : 'text-gray-700 hover:bg-[#FFB30020]'
                }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-600'}>
                {item.icon}
              </span>
              <span className={`text-[15px] font-semibold tracking-wide ${isActive ? 'text-white' : 'text-gray-700'
                }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Nav Links */}
      <div className="px-6 flex flex-col gap-2 pb-8">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.path) {
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-3 rounded-[15px] transition-all duration-300 ${isActive
                  ? 'bg-[#FF9D00] text-white shadow-md'
                  : 'text-gray-700 hover:bg-[#FFB30020]'
                  }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span className={`text-[15px] font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </Link>
            );
          } else {
            return (
              <div
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:text-[#FF9D00] cursor-pointer group transition-all"
              >
                <span className="text-gray-500 group-hover:text-[#FF9D00] transition-colors">
                  {item.icon}
                </span>
                <span className="text-[15px] font-semibold">{item.label}</span>
              </div>
            );
          }
        })}

        {/* Backup Info */}
        <div className="text-center mt-6">
          <p className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.2em]">Last Backup</p>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">April 03 2025, 12:45pm</p>
        </div>
      </div>
    </div>
  );
};


export default HeaderC;
