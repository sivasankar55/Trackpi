import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Users, UserX, UserCheck, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseImage from '../assets/course.png';

const ProgressTracking = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalStats, setGlobalStats] = useState({
    totalEnrolled: 0,
    notStarted: 0,
    completed: 0,
    inProgress: 0
  });
  const [courses, setCourses] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const response = await axios.get('http://localhost:5000/api/courses/stats-with-courses', {
          withCredentials: true
        });
        setGlobalStats(response.data.globalStats);
        setCourses(response.data.courses);
        setError('');
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load live data. Please try again later.');
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    fetchData();
    // Background polling every 30 seconds for live data reflection
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9D00]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#FDFDFD] font-['Poppins']">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Users Enrolled', count: globalStats.totalEnrolled, icon: <Users size={20} className="text-black" /> },
          { label: 'Not Started Yet', count: globalStats.notStarted, icon: <UserX size={20} className="text-black" /> },
          { label: 'Total Users completed', count: globalStats.completed, icon: <UserCheck size={20} className="text-black" /> },
          { label: 'Total Users InProgress', count: globalStats.inProgress, icon: <PlayCircle size={20} className="text-black" /> }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-[#FFF1CF] border border-[#FF9D00] rounded-xl p-6 flex flex-col items-center justify-center shadow-[0px_4px_10px_rgba(0,0,0,0.05)] relative overflow-hidden transition-all hover:scale-105"
          >
            <div className="bg-black/5 p-3 rounded-full mb-3">
              {stat.icon}
            </div>
            <div className="text-sm font-medium text-black mb-1 text-center">{stat.label}</div>
            <div className="text-3xl font-bold text-black">{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Search Bar Section */}
      <div className="mb-10 w-full max-w-sm">
        <div className="relative flex items-center w-full h-12 bg-[#FF9D00] rounded-lg px-4 shadow-md overflow-hidden group">
          <Search className="w-5 h-5 text-white mr-3 transition-transform group-focus-within:scale-110" />
          <input
            type="text"
            placeholder="Search by student name, course..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent border-none text-white placeholder-white/70 focus:ring-0 text-sm font-light outline-none"
          />
        </div>
      </div>

      {/* Course Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-12">
        {currentCourses.map((course, index) => (
          <div
            key={course._id || index}
            className="bg-[#FFF1CF] border border-[#FF9D00] rounded-[24px] overflow-hidden flex flex-col h-full shadow-[0px_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0px_12px_30px_rgba(255,157,0,0.15)] transition-all duration-300 group"
          >
            {/* Card Image Area with Animation */}
            <div className="h-44 bg-gradient-to-br from-[#1a1c2c] to-[#4a1942] p-0 flex items-center justify-center relative overflow-hidden">
              <img
                src={course.courseImage || CourseImage}
                alt={course.courseName}
                className="w-full h-full object-cover z-10 transform group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              {/* Decorative background overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-black text-sm line-clamp-2 leading-tight pr-2">{course.courseName}</h3>
                <span className="text-[10px] font-semibold text-black/60 bg-black/5 px-2 py-1 rounded-full shrink-0">{course.duration || '5 Hours'}</span>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center text-[12px] text-black/80 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                  Completed: {course.stats?.completed || 0}
                </div>
                <div className="flex items-center text-[12px] text-black/80 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                  InProgress: {course.stats?.inProgress || 0}
                </div>
              </div>

              <div className="flex justify-center mt-auto">
                <button
                  onClick={() => navigate(`/admin/progress-tracking/details?courseId=${course._id}`)}
                  className="bg-[#FF9D00] text-white text-[12px] font-bold py-2.5 px-8 rounded-full border-none shadow-[0px_4px_10px_rgba(255,157,0,0.3)] hover:shadow-[0px_6px_15px_rgba(255,157,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  More Info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-black/5 rounded-3xl border-2 border-dashed border-[#FF9D00]/20">
          <Search size={48} className="text-[#FF9D00]/20 mb-4" />
          <p className="text-black/40 font-medium font-['Poppins']">No courses found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Pagination Section */}
      {filteredCourses.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <button
            className="px-10 py-3 bg-[#FFF1CF] hover:bg-[#FF9D00] hover:text-white rounded-xl shadow-sm text-sm font-bold text-black border border-[#FF9D00]/30 transition-all disabled:opacity-40 disabled:hover:bg-[#FFF1CF] disabled:hover:text-black flex items-center gap-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex gap-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm transition-all ${currentPage === pageNum
                  ? 'bg-[#FF9D00] text-white scale-110'
                  : 'bg-[#FFF1CF] text-black hover:bg-black/5'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            className="px-10 py-3 bg-[#FF9D00] hover:bg-[#FF8C00] rounded-xl shadow-sm text-sm font-bold text-white border-none transition-all disabled:opacity-40 flex items-center gap-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;

