import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

// Icons
import PlusIcon from '../assets/plus.png';
import TrashIcon from '../assets/trash.png';
import LockIcon from '../assets/lock.png';
import BellIcon from '../assets/bell.png';
import UserIcon from '../assets/user.png';
import SearchIcon from '../assets/search2.png';
import DashboardIcon from '../assets/dashboard.png';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/users/${userId}/details`, {
                withCredentials: true
            });
            setUserData(response.data);
            if (response.data.courses.length > 0) {
                setSelectedCourse(response.data.courses[0]);
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to load user information');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
        </div>
    );

    if (error) return (
        <div className="flex h-screen items-center justify-center bg-white flex-col gap-4">
            <p className="text-red-500 font-bold text-xl">{error}</p>
            <button onClick={() => navigate('/admin/user-management')} className="bg-[#FF9D00] text-white px-8 py-2 rounded-xl">Go Back</button>
        </div>
    );

    if (!userData) return null;

    const { user, stats, courses } = userData;

    return (
        <div className="min-h-screen bg-white w-full font-['Poppins'] pb-10">
            <div className="p-4 sm:p-8 max-w-[1400px] mx-auto space-y-8">
                {/* User Header Section */}
                <div className="bg-[#FFF8E7] rounded-[20px] sm:rounded-[30px] border border-[#FFB300] p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-lg relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 sm:gap-8 relative z-10 w-full lg:w-auto">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center flex-shrink-0">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-3xl sm:text-4xl font-bold text-[#FFB300]">{user.name.charAt(0)}</div>
                            )}
                        </div>
                        <div className="space-y-1 overflow-hidden">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">{user.name}</h2>
                            <p className="text-gray-500 font-bold text-base sm:text-lg">@{user.email.split('@')[0]}</p>
                            <p className="text-gray-600 font-semibold text-sm sm:text-base truncate">{user.email}</p>
                            <p className="text-gray-600 font-semibold text-sm sm:text-base">{user.phoneNumber}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6 sm:pr-0 lg:pr-12 relative z-10 w-full lg:w-auto">
                        <div>
                            <p className="text-gray-500 font-bold text-[10px] sm:text-sm uppercase tracking-wider mb-1">Joined</p>
                            <p className="text-gray-800 font-bold text-lg sm:text-xl">{dayjs(stats.joined).format('DD MMM,YYYY')}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-bold text-[10px] sm:text-sm uppercase tracking-wider mb-1">Courses Completed</p>
                            <p className="text-gray-800 font-bold text-lg sm:text-xl">{stats.coursesCompleted}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-bold text-[10px] sm:text-sm uppercase tracking-wider mb-1">Upcoming Courses</p>
                            <p className="text-gray-800 font-bold text-lg sm:text-xl">{stats.upcomingCourses}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-bold text-[10px] sm:text-sm uppercase tracking-wider mb-1">Progress</p>
                            <p className="text-gray-800 font-bold text-lg sm:text-xl">{stats.overallProgress}%</p>
                        </div>
                    </div>
                    {/* Decorative Background Circles */}
                    <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full bg-[#FFB30010]"></div>
                    <div className="absolute bottom-[-40px] left-[200px] w-60 h-60 rounded-full bg-[#FFB30008]"></div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Course Table - Left side */}
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                            <div className="relative w-full sm:w-[340px] h-[44px]">
                                <input
                                    type="text"
                                    placeholder="search course"
                                    className="w-full h-full pl-4 pr-12 rounded-[12px] border border-[#FFB300] focus:outline-none bg-white text-sm text-gray-700 placeholder-gray-400 font-medium"
                                />
                                <img src={SearchIcon} alt="Search" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                            </div>
                        </div>

                        <div className="border border-[#FFB300] rounded-[20px] sm:rounded-[25px] overflow-hidden bg-white shadow-xl overflow-x-auto">
                            <table className="w-full border-separate border-spacing-0 min-w-[600px]">
                                <thead className="bg-[#FFB300] text-white">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-4 sm:py-5 text-left font-bold text-[15px] sm:text-[17px] tracking-wide">Course Name</th>
                                        <th className="px-4 sm:px-6 py-4 sm:py-5 text-left font-bold text-[15px] sm:text-[17px] tracking-wide">Completion Date</th>
                                        <th className="px-4 sm:px-6 py-4 sm:py-5 text-center font-bold text-[15px] sm:text-[17px] tracking-wide">Score</th>
                                        <th className="px-4 sm:px-6 py-4 sm:py-5 text-center font-bold text-[15px] sm:text-[17px] tracking-wide">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length === 0 ? (
                                        <tr><td colSpan="4" className="py-20 text-center text-gray-400 italic font-medium">No courses enrolled yet</td></tr>
                                    ) : (
                                        courses.map((course, idx) => (
                                            <tr
                                                key={course._id}
                                                onClick={() => setSelectedCourse(course)}
                                                className={`cursor-pointer group transition-all duration-200 hover:shadow-inner ${selectedCourse?._id === course._id ? 'bg-[#FFF1CF]' : idx % 2 === 0 ? 'bg-[#FFF9E1]' : 'bg-white'}`}
                                            >
                                                <td className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 group-hover:bg-[#FFF4D5]">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${selectedCourse?._id === course._id ? 'bg-[#FF9D00] border-[#FF9D00]' : 'border-[#FFB300]'}`}>
                                                            {selectedCourse?._id === course._id && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>}
                                                        </div>
                                                        <span className="font-bold text-gray-800 text-sm sm:text-[16px]">{course.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 sm:py-5 text-gray-600 font-bold border-b border-gray-100 group-hover:bg-[#FFF4D5] text-sm sm:text-base whitespace-nowrap">
                                                    {course.completionDate ? dayjs(course.completionDate).format('MMM DD,YYYY') : '-------'}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 sm:py-5 text-center font-black text-gray-800 border-b border-gray-100 group-hover:bg-[#FFF4D5] text-sm sm:text-base">
                                                    {course.score ? `${course.score}%` : '---'}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 sm:py-5 text-center text-gray-600 font-bold border-b border-gray-100 group-hover:bg-[#FFF4D5] text-sm sm:text-base whitespace-nowrap">
                                                    {course.duration}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center pt-4">
                            <button className="bg-[#E20000] text-white px-8 sm:px-12 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-[#C10000] transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-[11px] sm:text-sm">Print QUIZ</button>
                            <button className="bg-[#E20000] text-white px-8 sm:px-12 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-[#C10000] transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-[11px] sm:text-sm">Reset</button>
                        </div>
                    </div>

                    {/* Section Details - Right side */}
                    <div className="w-full xl:w-[450px] shrink-0">
                        <div className="bg-[#FFF8E7] rounded-[30px] sm:rounded-[40px] border border-[#FFB300] p-6 sm:p-10 shadow-xl h-full flex flex-col min-h-[500px] xl:min-h-[600px] relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 sm:mb-10 relative z-10 gap-4">
                                <h3 className="text-xl sm:text-3xl font-black text-gray-800 leading-tight truncate">{selectedCourse?.name || 'Select a Course'}</h3>
                                <div className="bg-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-base sm:text-xl font-black text-[#FF9D00] shadow-md border border-[#FFB30040] shrink-0">
                                    {selectedCourse ? `${selectedCourse.sections.filter(s => s.passed).length}/${selectedCourse.sections.length}` : '0/0'}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 sm:pr-4 custom-scrollbar relative z-10 overflow-x-hidden">
                                <table className="w-full border-separate border-spacing-y-3 sm:border-spacing-y-4">
                                    <thead className="sticky top-0 z-20">
                                        <tr>
                                            <th className="bg-[#FFB300] text-white px-3 sm:px-5 py-3 sm:py-4 rounded-l-xl sm:rounded-l-2xl text-left text-[10px] sm:text-[13px] font-black uppercase tracking-widest shadow-sm">Section</th>
                                            <th className="bg-[#FFB300] text-white px-2 py-3 sm:py-4 text-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest shadow-sm">Start</th>
                                            <th className="bg-[#FFB300] text-white px-2 py-3 sm:py-4 rounded-r-xl sm:rounded-r-2xl text-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest shadow-sm">End</th>
                                        </tr>
                                    </thead>
                                    <tbody className="pt-2 sm:pt-4">
                                        {!selectedCourse ? (
                                            <tr>
                                                <td colSpan="3" className="py-16 sm:py-20 text-center text-gray-400 font-bold italic border-2 border-dashed border-[#FFB30040] rounded-2xl sm:rounded-3xl">Please select a course</td>
                                            </tr>
                                        ) : selectedCourse.sections.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="py-16 sm:py-20 text-center text-gray-400 font-bold italic border-2 border-dashed border-[#FFB30040] rounded-2xl sm:rounded-3xl">No section records</td>
                                            </tr>
                                        ) : (
                                            selectedCourse.sections.map((section, idx) => (
                                                <tr key={idx} className="bg-[#FFF1CF] hover:bg-[#FFE8A3] transition-all duration-200 shadow-sm transform hover:scale-[1.01]">
                                                    <td className="px-3 sm:px-5 py-3 sm:py-4 rounded-l-xl sm:rounded-l-2xl border-l-2 border-t-2 border-b-2 border-[#FFB30030] font-black text-gray-800 text-xs sm:text-[15px]">{section.name || `Section ${idx + 1}`}</td>
                                                    <td className="px-1 sm:px-2 py-3 sm:py-4 border-t-2 border-b-2 border-[#FFB30030] text-center font-bold text-gray-700 text-[10px] sm:text-[14px] whitespace-nowrap">{dayjs(section.startTime).format('hh:mm A')}</td>
                                                    <td className="px-1 sm:px-2 py-3 sm:py-4 rounded-r-xl sm:rounded-r-2xl border-r-2 border-t-2 border-b-2 border-[#FFB30030] text-center font-bold text-gray-700 text-[10px] sm:text-[14px] whitespace-nowrap">{dayjs(section.endTime).format('hh:mm A')}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Decorative Background for right card */}
                            <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-[#FFB30005] rounded-tl-[100px]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #FFB30040;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #FFB30060;
                }
            ` }} />
        </div>
    );
};

export default UserDetails;
