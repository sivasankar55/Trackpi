import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddCourse from './AddCourse';

// Icons
import DashboardIcon from '../assets/dashboard.png';
import SearchIcon from '../assets/search2.png';
import BellIcon from '../assets/bell.png';
import UserIcon from '../assets/user.png';
import CourseImage from '../assets/course.png';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStats, setTotalStats] = useState({
    courses: 0,
    sections: 0,
    units: 1000,
    hours: '23:58',
    students: 538
  });

  const coursesPerPage = 8;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const [coursesRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/courses', {
          withCredentials: true
        }),
        axios.get('http://localhost:5000/api/courses/stats', {
          withCredentials: true
        })
      ]);

      setCourses(coursesRes.data);
      setTotalStats({
        courses: statsRes.data.totalCourses,
        sections: statsRes.data.totalSections,
        units: statsRes.data.totalUnits,
        hours: statsRes.data.totalHours,
        students: statsRes.data.currentStudents
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses and stats:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    navigate('/admin/add-course');
  };

  // Filtering
  const filteredCourses = courses.filter((course) =>
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const StatsCard = ({ title, value }) => (
    <div className="flex-1 min-w-[150px] sm:min-w-[180px] h-[65px] sm:h-[75px] bg-[#FFF8E7] border border-[#FFD9A0] rounded-[10px] sm:rounded-[12px] flex flex-col justify-center items-center shadow-[0px_4px_12px_rgba(255,183,0,0.1)] transition-all hover:-translate-y-0.5">
      <span className="text-gray-800 font-bold text-[12px] sm:text-[14px] tracking-tight whitespace-nowrap px-2">
        {title}: <span className="font-extrabold ml-1 text-black">{value}</span>
      </span>
    </div>
  );

  return (
    <div className="min-h-full bg-white w-full font-['Poppins'] pb-12 relative">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-[1000] flex justify-between items-center px-4 sm:px-10 py-4 sm:py-5 bg-white shadow-md">
        {/* Left: Dashboard Title + Search */}
        <div className="flex items-center gap-8 flex-1">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#333]"></div>
            </div>
            <span className="text-xl sm:text-[24px] font-bold text-[#333] hidden sm:block tracking-tighter">
              Dashboard
            </span>
          </div>

          {/* Navbar Search Bar */}
          <div className="relative w-full max-w-[200px] sm:max-w-[320px]">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-[36px] sm:h-[40px] pl-5 sm:pl-6 pr-8 sm:pr-10 rounded-full border border-gray-200 bg-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#FFB300] transition-all"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 opacity-30"
            />
          </div>
        </div>

        {/* Right side icons/buttons */}
        <div className="flex items-center gap-2 sm:gap-6 ml-2 sm:ml-4">
          <button
            onClick={handleAddCourse}
            className="bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold px-3 sm:px-8 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[12px] shadow-sm transition-all text-[11px] sm:text-[14px] whitespace-nowrap active:scale-95"
          >
            + Add
          </button>

          <div className="relative group cursor-pointer hidden sm:block">
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50">
              <img
                src={BellIcon}
                alt="Notifications"
                className="w-5 h-5 opacity-70"
              />
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/profile')}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm cursor-pointer hover:border-[#FFB300] transition-colors overflow-hidden"
          >
            <img
              src={UserIcon}
              alt="Profile"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 mt-6 sm:mt-8 space-y-8 sm:space-y-10 max-w-[1600px] mx-auto">
        {/* Stats Row */}
        <div className="flex flex-wrap gap-3 sm:gap-6">
          <StatsCard title="Total Courses" value={totalStats.courses} />
          <StatsCard title="Total Sections" value={totalStats.sections} />
          <StatsCard title="Total Units" value={totalStats.units} />
          <StatsCard title="Total Hours" value={totalStats.hours} />
          <StatsCard title="Current students" value={totalStats.students} />
        </div>

        {/* Big Orange Search Bar */}
        <div className="w-full">
          <div className="w-full h-[45px] sm:h-[54px] bg-[#FF9D00] rounded-[12px] sm:rounded-[15px] flex items-center px-4 sm:px-6 shadow-md transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-orange-200">
            <img
              src={SearchIcon}
              alt="Search"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 brightness-0 invert opacity-100"
            />
            <input
              type="text"
              placeholder="search for student name, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-white/90 ml-3 sm:ml-5 w-full text-sm sm:text-base font-semibold tracking-wide"
            />
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-40 w-full">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-100 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-[#FF9D00] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-40 w-full text-center">
            <div className="text-red-500 font-bold text-xl mb-4">
              Error: {error}
            </div>
            <button
              onClick={fetchCourses}
              className="bg-[#FF9D00] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#E68E00] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-40 w-full text-center">
            <div className="text-gray-400 font-bold text-xl mb-4">
              No courses found
            </div>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or add a new course.
            </p>
            <button
              onClick={handleAddCourse}
              className="bg-[#FF9D00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#E68E00] shadow-md transition-all active:scale-95"
            >
              + Add Your First Course
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-10 min-h-[600px]">
              {paginatedCourses.map((course) => {
                const unitCount =
                  course.sections?.reduce(
                    (acc, section) => acc + (section.units?.length || 0),
                    0
                  ) || 0;
                const totalMinutes = unitCount * 15;
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                const durationStr =
                  hours > 0 ? `${hours}h ${mins}m` : `${totalMinutes} MINUTES`;

                return (
                  <div
                    key={course._id}
                    className="bg-[#FFF8E7] rounded-[35px] overflow-hidden border border-[#FFD9A0] shadow-[0px_4px_25px_rgba(0,0,0,0.04)] flex flex-col h-[520px] transition-all hover:shadow-[0px_8px_35px_rgba(255,183,0,0.15)] group"
                  >
                    {/* Thumbnail Container */}
                    <div className="p-5">
                      <div className="h-[200px] w-full rounded-[25px] overflow-hidden bg-white shadow-inner">
                        <img
                          src={course.thumbnail || CourseImage}
                          alt={course.courseName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/400x250?text=Course';
                          }}
                        />
                      </div>
                    </div>

                    <div className="px-7 pt-4 flex flex-col flex-1">
                      {/* Title & Duration Row */}
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="font-black text-[#333] text-[18px] uppercase tracking-tight truncate max-w-[150px]">
                          {course.courseName}
                        </h3>
                        <span className="text-[12px] text-[#888] font-bold uppercase tracking-tight">
                          {durationStr}
                        </span>
                      </div>

                      {/* Stats Section */}
                      <div className="space-y-2 mb-10">
                        <div className="text-[14px] text-[#333] font-bold">
                          Sections:{' '}
                          <span className="ml-1">
                            {course.sections?.length || 0}
                          </span>
                        </div>
                        <div className="text-[14px] text-[#333] font-bold">
                          Units: <span className="ml-1">{unitCount}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 mt-auto mb-8">
                        <button className="flex-1 bg-[#FFB300] hover:bg-[#FFA000] text-white text-[14px] font-black py-4 rounded-[15px] shadow-md transition-all active:scale-95 uppercase tracking-widest">
                          EDIT
                        </button>
                        <button className="flex-1 bg-[#FF4B4B] hover:bg-[#E63939] text-white text-[14px] font-black py-4 rounded-[15px] shadow-md transition-all active:scale-95 uppercase tracking-widest">
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centered Pagination perfectly matched to visual design */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 mt-16 mb-4 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 px-3 py-3 rounded-[20px] shadow-sm w-full sm:w-auto">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-full sm:w-auto px-8 py-2.5 rounded-[12px] bg-[#FFF8E7] text-gray-400 font-bold text-sm shadow-sm transition-all border border-[#FFD9A0]/50 ${
                    currentPage === 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-[#FFF3D0] hover:text-[#FF9D00]'
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-2 overflow-x-auto max-w-[300px] sm:max-w-none justify-center">
                  {Array.from({ length: totalPages || 5 }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-[15px] font-bold transition-all shadow-sm flex-shrink-0 ${
                          currentPage === pageNum
                            ? 'bg-[#FF9D00] text-white shadow-orange-200'
                            : 'bg-white text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-full sm:w-auto px-10 py-2.5 rounded-[12px] bg-[#FF9D00] text-white font-bold text-sm shadow-md transition-all ${
                    currentPage === totalPages
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-[#E68E00] active:scale-95'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
