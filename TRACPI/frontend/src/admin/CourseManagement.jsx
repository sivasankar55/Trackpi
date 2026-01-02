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
    const [showAddCourse, setShowAddCourse] = useState(false);

    // Derived stats
    const [totalSections, setTotalSections] = useState(0);

    const coursesPerPage = 8;

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/courses', {
                withCredentials: true
            });
            const data = response.data;
            setCourses(data);

            // Calculate total sections
            const sectionsCount = data.reduce((acc, course) => acc + (course.sections?.length || 0), 0);
            setTotalSections(sectionsCount);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses');
            setLoading(false);
        }
    };

    const handleAddCourse = () => {
        navigate('/admin/add-course');
    };

    const handleCloseAddCourse = () => {
        setShowAddCourse(false);
    };

    const handleCourseAdded = () => {
        fetchCourses();
    };

    // Filtering
    const filteredCourses = courses.filter(course =>
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

    // Stats Card Component
    const StatsCard = ({ title, value }) => (
        <div className="flex-1 h-[90px] bg-[#FFF8E7] border border-[#FFB300] rounded-[15px] flex flex-col justify-center items-center shadow-sm min-w-[200px]">
            <span className="text-gray-800 font-bold text-lg tracking-wide">{title}: <span className="text-black font-extrabold">{value}</span></span>
        </div>
    );

    return (
        <div className="min-h-full bg-white w-full font-['Poppins'] pb-12 relative">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-[1000] flex justify-between items-center px-4 sm:px-10 py-4 sm:py-5 bg-white shadow-md">
                {/* Left: Dashboard Title + Search */}
                <div className="flex items-center gap-8 flex-1">
                    <div className="flex items-center gap-3">
                        <img src={DashboardIcon} alt="Dashboard" className="w-6 h-6 object-contain" />
                        <span className="text-[28px] font-bold text-[#333]">Dashboard</span>
                    </div>

                    {/* Top Search Bar */}
                    <div className="relative w-[400px]">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full h-[45px] pl-6 pr-10 rounded-[12px] border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-600 shadow-sm"
                        />
                        <img src={SearchIcon} alt="Search" className="absolute right-4 top-3.5 w-5 h-5 opacity-40" />
                    </div>
                </div>

                {/* Right: Add Course + Icons */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={handleAddCourse}
                        className="bg-[#FFB300] hover:bg-[#FF9900] text-white font-semibold px-6 py-2.5 rounded-[12px] shadow-sm transition-all text-sm"
                    >
                        Add Course
                    </button>

                    <button className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <img src={BellIcon} alt="Notifications" className="w-6 h-6 object-contain" />
                    </button>

                    <button
                        onClick={() => navigate('/admin/profile')}
                        className="w-11 h-11 rounded-full border border-[#FFB300] flex items-center justify-center hover:bg-[#FFF0CE] bg-[#FFF8E7] transition-colors cursor-pointer"
                        title="Profile"
                    >
                        <img src={UserIcon} alt="Profile" className="w-6 h-6 object-contain" />
                    </button>
                </div>
            </div>

            <div className="px-10 pb-10 mt-12">
                {/* Stats Row */}
                <div className="flex justify-between gap-6 mb-10 w-full">
                    <StatsCard title="Total Courses" value={courses.length} />
                    <StatsCard title="Total Sections" value={totalSections} />
                    <StatsCard title="Total Units" value="1000" /> {/* Mock Data */}
                    <StatsCard title="Total Hours" value="23:58" /> {/* Mock Data */}
                    <StatsCard title="Current students" value="538" /> {/* Mock Data */}
                </div>

                {/* Orange Search Bar */}
                <div className="w-full h-[55px] bg-[#FF9900] rounded-[10px] flex items-center px-6 mb-10 shadow-md">
                    <img src={SearchIcon} alt="Search" className="w-5 h-5 text-white brightness-0 invert opacity-90" />
                    <input
                        type="text"
                        placeholder="Search by student name, course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white placeholder-white/70 ml-4 w-full text-base font-light tracking-wide"
                    />
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 mb-12">
                        {paginatedCourses.map((course) => (
                            <div key={course._id} className="bg-[#FFF8E7] rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#FFE0B2] flex flex-col h-[340px]">
                                {/* Course Image */}
                                <div className="h-[160px] w-full bg-gray-200 relative">
                                    <img
                                        src={CourseImage}
                                        alt={course.courseName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Course'; }}
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-[17px] text-gray-900 leading-tight w-[75%] line-clamp-2">{course.courseName}</h3>
                                        <span className="text-[11px] text-gray-600 font-semibold whitespace-nowrap mt-1">5 Hours</span>
                                    </div>

                                    <div className="mt-auto space-y-1 mb-5">
                                        <p className="text-[13px] text-gray-700 font-medium">Sections: <span className="font-bold text-gray-900 ml-1">{course.sections?.length || 0}</span></p>
                                        <p className="text-[13px] text-gray-700 font-medium">Units: <span className="font-bold text-gray-900 ml-1">8</span></p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 mt-1">
                                        <button className="flex-1 bg-[#FFC107] hover:bg-[#FFB300] text-white text-[13px] font-bold py-2 rounded-[8px] transition-all shadow-sm">
                                            Edit
                                        </button>
                                        <button className="flex-1 bg-[#FF3D00] hover:bg-[#E63900] text-white text-[13px] font-bold py-2 rounded-[8px] transition-all shadow-sm">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && courses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-xl font-semibold mb-2">No Courses Found</p>
                        <p className="mb-6">Get started by adding a new course to the platform.</p>
                        <button
                            onClick={handleAddCourse}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Add First Course
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {courses.length > 0 && (
                    <div className="flex justify-between items-center mt-4 px-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-8 py-2.5 rounded-[8px] bg-[#FFF8E7] text-gray-500 font-medium text-sm shadow-sm transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFF0CE] hover:text-gray-700'}`}
                        >
                            Previous
                        </button>

                        <div className="flex gap-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-9 h-9 rounded-[8px] flex items-center justify-center text-sm font-bold transition-all ${currentPage === pageNum
                                        ? 'bg-orange-500 text-white shadow-md scale-105'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-10 py-2.5 rounded-[8px] bg-[#FFA000] text-white font-medium text-sm shadow-sm transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF8F00] hover:shadow-md'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Popups */}
            {showAddCourse && (
                <AddCourse onClose={handleCloseAddCourse} onCourseAdded={handleCourseAdded} />
            )}
        </div>
    );
};

export default CourseManagement;
