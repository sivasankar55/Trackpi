import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import CourseImage from '../assets/course.png';

const ProgressTracking = ({ onEditAdmin }) => {
  const navigate = useNavigate();
  const itemsPerPage = 10; // Updated to match grid size likely
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [admins, setAdmins] = useState([]); // Kept for potential future use or if this page evolves
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch admins from API (Kept as placeholder logic from original file)
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin', {
          withCredentials: true
        });
        setAdmins(response.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching admins:', err);
        setError('Failed to load admin data');
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const totalPages = 5; // Hardcoded for UI demo as per image

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Mock data for display to match image
  const courses = Array(10).fill({
    name: 'Course Name',
    duration: '3 Hours',
    completed: 10,
    inProgress: 8
  });

  return (
    <div className="p-6 md:p-8 min-h-screen bg-transparent font-['Poppins']">

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users Enrolled', count: '332', icon: 'users' },
          { label: 'Not Started Yet', count: '50', icon: 'clock' },
          { label: 'Total Users completed', count: '332', icon: 'check' },
          { label: 'Total Users InProgress', count: '332', icon: 'play' }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-[#FFF1CF] border border-[#FF9D00] rounded-lg p-6 flex flex-col items-center justify-center shadow-md relative overflow-hidden"
          >
            {/* Decorative Icons/Shapes mimicking the image */}
            <div className="flex gap-2 mb-3">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="text-sm font-medium text-black mb-1 text-center">{stat.label}</div>
            <div className="text-2xl font-bold text-black">{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Search Bar Section */}
      <div className="mb-8 w-full max-w-2xl">
        <div className="relative flex items-center w-full h-12 bg-[#FF9D00] rounded px-4 shadow-sm border border-[#e68e00]">
          <Search className="w-5 h-5 text-white mr-3" />
          <input
            type="text"
            placeholder="Search by student name, course..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent border-none text-white placeholder-white/80 focus:ring-0 text-sm font-light"
          />
        </div>
      </div>

      {/* Course Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-[#FFF1CF] border border-[#FF9D00] rounded-[15px] overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Card Image Area */}
            <div className="h-40 bg-gradient-to-br from-indigo-900 to-black p-4 flex items-center justify-center relative">
              {/* Placeholder for the illustration in the image */}
              <img src={CourseImage} alt="Course" className="w-full h-full object-contain" />
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-black text-sm">{course.name}</h3>
                <span className="text-[10px] text-black shrink-0 mt-0.5">{course.duration}</span>
              </div>

              <div className="space-y-1 mb-4 flex-1">
                <p className="text-[11px] text-black">Completed: {course.completed}</p>
                <p className="text-[11px] text-black">InProgress: {course.inProgress}</p>
              </div>

              <div className="flex justify-center mt-auto">
                <button
                  onClick={() => navigate('/admin/progress-tracking/details')}
                  className="bg-[#FFB300] text-white text-[10px] font-medium py-2 px-6 rounded-full border border-[#FF9D00] shadow-[0px_0px_4px_1px_rgba(255,157,0,0.5)] active:scale-95 transition-transform"
                >
                  More info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          className="px-8 py-2 bg-[#FFF0CE] rounded shadow-sm text-sm font-medium disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-colors ${currentPage === pageNum
                  ? 'bg-[#FF9D00] text-black'
                  : 'text-black hover:bg-black/5'
                }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          className="px-8 py-2 bg-[#FF9D00] rounded shadow-sm text-sm font-bold text-black disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default ProgressTracking;
