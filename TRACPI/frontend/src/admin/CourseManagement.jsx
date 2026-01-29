import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddCourse from './AddCourse';

import DeleteCoursePopup from './DeleteCoursePopup';

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

  // Popup States
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleOpenDeletePopup = (course) => {
    setCourseToDelete(course);
    setDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseToDelete._id}`, {
        withCredentials: true
      });
      // Refresh courses and stats
      await fetchCourses();
      setDeletePopupOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    } finally {
      setDeleteLoading(false);
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


      <div className="px-4 sm:px-10 mt-6 sm:mt-8 space-y-8 sm:space-y-10 max-w-[1600px] mx-auto">
        {/* Stats Row */}
        <div className="flex flex-wrap gap-3 sm:gap-6">
          <StatsCard title="Total Courses" value={totalStats.courses} />
          <StatsCard title="Total Sections" value={totalStats.sections} />
          <StatsCard title="Total Units" value={totalStats.units} />
          <StatsCard title="Total Hours" value={totalStats.hours} />
          <StatsCard title="Current students" value={totalStats.students} />
        </div>

        {/* Search & Add Course Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-full sm:w-[450px] h-[45px] sm:h-[54px] bg-[#FF9D00] rounded-[12px] sm:rounded-[15px] flex items-center px-4 sm:px-6 shadow-md transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-orange-200">
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

          <button
            onClick={handleAddCourse}
            className="h-[45px] sm:h-[54px] px-8 bg-[#FF9D00] text-white rounded-[12px] sm:rounded-[15px] font-bold text-sm sm:text-base shadow-md hover:bg-[#E68E00] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="text-xl">+</span> Add Course
          </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 min-h-[400px]">
              {paginatedCourses.map((course) => {
                const unitCount =
                  course.sections?.reduce(
                    (acc, section) => acc + (section.units?.length || 0),
                    0
                  ) || 0;
                const durationStr = course.duration || '0 Mins';

                return (
                  <div
                    key={course._id}
                    className="bg-[#FFF7E7] rounded-[25px] overflow-hidden border border-[#FFD18B] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col h-[380px] transition-all hover:shadow-[0px_8px_30px_rgba(255,183,0,0.12)] group"
                  >
                    {/* Thumbnail Container */}
                    <div className="p-3 pb-0">
                      <div className="h-[165px] w-full rounded-[20px] overflow-hidden bg-white shadow-sm relative">
                        <img
                          src={course.courseImage || CourseImage}
                          alt={course.courseName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/400x250?text=Course';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>

                    <div className="px-5 pt-4 flex flex-col flex-1">
                      {/* Title & Duration Row */}
                      <div className="flex justify-between items-baseline mb-4">
                        <h3 className="font-extrabold text-[#111] text-[17px] truncate max-w-[130px]">
                          {course.courseName}
                        </h3>
                        <span className="text-[12px] text-gray-500 font-medium">
                          {durationStr}
                        </span>
                      </div>

                      {/* Stats Section */}
                      <div className="space-y-1.5 mb-6">
                        <div className="text-[14px] text-gray-500 font-semibold">
                          Sections: <span className="text-gray-700 ml-1">{course.sections?.length || 0}</span>
                        </div>
                        <div className="text-[14px] text-gray-500 font-semibold">
                          Units: <span className="text-gray-700 ml-1">{unitCount}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-auto mb-5">
                        <button
                          onClick={() => navigate(`/admin/edit-course/${course._id}`)}
                          className="flex-1 bg-[#FFB300] hover:bg-[#FFA000] text-white text-[13px] font-bold py-2.5 rounded-[10px] shadow-md transition-all active:scale-95">
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenDeletePopup(course)}
                          className="flex-1 bg-[#FF4238] hover:bg-[#E63939] text-white text-[13px] font-bold py-2.5 rounded-[10px] shadow-md transition-all active:scale-95">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Redesigned Pagination - Matches Provided Image */}
            <div className="flex justify-between items-center mt-20 mb-10 w-full px-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-10 py-3 rounded-[10px] bg-gray-50/50 text-gray-400 font-bold text-sm transition-all border border-gray-100 ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm'
                  }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-4">
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[15px] font-bold transition-all ${currentPage === pageNum
                        ? 'bg-[#FF9D00] text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-800'
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
                className={`px-12 py-3 rounded-[10px] bg-[#FF9D00] text-white font-bold text-sm shadow-md transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#E68E00] active:scale-95'
                  }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {deletePopupOpen && (
        <DeleteCoursePopup
          courseName={courseToDelete?.courseName}
          onClose={() => setDeletePopupOpen(false)}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default CourseManagement;
