import React, { useState } from 'react';
import logo from '../assets/targetpi logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlignJustify, X, Info, LogOut } from 'lucide-react';

const HeaderB = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); // Clear all storage or specific keys like 'token'
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path) => location.pathname === path;

  const getLinkClasses = (path) => {
    return isActive(path)
      ? "cursor-pointer text-[#FF9D00] font-bold text-lg hover:opacity-80 transition-opacity"
      : "cursor-pointer text-gray-300 font-medium text-lg hover:text-white transition-colors";
  };

  return (
    <>
      <header className='relative'>
        <nav className='flex justify-between items-center py-2.5 px-6 md:px-[50px]'>
          <img src={logo} alt="logo of trackpi" className='w-[85px] h-[50px]' />




          {/* Desktop Logout Button */}
          <button
            onClick={handleLogout}
            className='hidden md:block font-normal text-base text-white roboto cursor-pointer bg-transparent border-none hover:text-[#FF9D00] transition-colors'
          >
            Logout
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleSidebar}
            className='md:hidden text-white cursor-pointer'
          >
            <AlignJustify className="w-6 h-6" />
          </button>
        </nav>
        {/* Divider Line */}
        <div className="w-full h-[0.5px] bg-white/20"></div>

        {/* Mobile Sidebar Overlay */}
        <div className={`fixed inset-0 z-50 flex justify-end md:hidden transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className={`relative w-[250px] h-full bg-black flex flex-col pt-6 px-6 shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col gap-8 font-sans h-full">
              {/* Menu Items */}
              <div className="flex flex-col gap-6">
                <div
                  onClick={() => { navigate('/discover-us'); setIsSidebarOpen(false); }}
                  className={getLinkClasses('/discover-us')}
                >
                  Discover Us
                </div>
                <div
                  onClick={() => { navigate('/help-centre'); setIsSidebarOpen(false); }}
                  className={getLinkClasses('/help-centre')}
                >
                  Help Centre
                </div>
                <div
                  onClick={() => { navigate('/start-course/dashboard'); setIsSidebarOpen(false); }}
                  className={location.pathname.includes('/start-course')
                    ? "cursor-pointer text-[#FF9D00] font-bold text-lg hover:opacity-80 transition-opacity"
                    : "cursor-pointer text-gray-300 font-medium text-lg hover:text-white transition-colors"}
                >
                  Courses
                </div>
                <div
                  onClick={() => { navigate('/faq'); setIsSidebarOpen(false); }}
                  className={getLinkClasses('/faq')}
                >
                  FAQ
                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-auto mb-8 flex flex-col gap-6">
                <div
                  onClick={handleLogout}
                  className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-lg">Logout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default HeaderB