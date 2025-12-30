import React, { useState } from 'react';
import SearchIcon from '../assets/search2.png';
import TrashIcon from '../assets/trash.png'; // Placeholder for icons if needed
import LockIcon from '../assets/lock.png';  // Placeholder
import { useNavigate } from 'react-router-dom';

const CourseProgressDetails = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('completed'); // 'completed' or 'inprogress'
    const [currentPage, setCurrentPage] = useState(1);

    // Dummy Data matching screenshot
    const dummyData = Array(8).fill({
        name: 'Amy',
        username: 'Amy@123',
        courseName: 'Python Basics',
        startDate: '14/2/2025',
        timeTaken: '6 hrs'
    });

    return (
        <div className="p-6 text-black min-h-screen">
            {/* Top Search and Controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-[330px] h-[44px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-full pr-10 pl-[10px] py-[13px] rounded-[10px] border border-[#FFB300] bg-white text-black placeholder-gray-500 focus:outline-none"
                    />
                    <button className="absolute right-[10px] top-1/2 transform -translate-y-1/2">
                        <img src={SearchIcon} alt="Search" className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-3">
                    <button className="px-6 py-2 rounded-[5px] border border-[#FFB300] bg-white hover:bg-yellow-50 text-black">
                        Filter
                    </button>
                    <button className="px-6 py-2 rounded-[5px] border border-[#FFB300] bg-white hover:bg-yellow-50 text-black">
                        Sort
                    </button>
                    <button className="px-6 py-2 rounded-[5px] bg-[#D00000] text-white hover:bg-red-700">
                        Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex w-full mb-0">
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`flex-1 py-4 text-center text-lg font-bold rounded-t-[10px] transition-colors ${activeTab === 'completed'
                            ? 'bg-[#FFB300] text-white'
                            : 'bg-[#FFF1CF] text-black border-b border-[#FFB300]'
                        }`}
                >
                    Completed courses
                </button>
                <button
                    onClick={() => setActiveTab('inprogress')}
                    className={`flex-1 py-4 text-center text-lg font-bold rounded-t-[10px] transition-colors ${activeTab === 'inprogress'
                            ? 'bg-[#FFB300] text-white'
                            : 'bg-[#FFF1CF] text-black border-b border-[#FFB300]'
                        }`}
                >
                    In Progress Course
                </button>
            </div>

            {/* Table Container */}
            <div className="w-full bg-[#FFF1CF] border border-[#FFB300] rounded-b-[10px] rounded-tl-[0px] p-4 min-h-[500px]">

                {/* Table Header */}
                <div className="bg-[#FFB300] text-white grid grid-cols-5 px-4 py-3 rounded-[10px] mb-2 font-bold text-center">
                    <div className="flex items-center gap-2 pl-4">
                        <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                        Name
                    </div>
                    <div>User Name</div>
                    <div>Course Name</div>
                    <div>Start Date</div>
                    <div>Time Taken</div>
                </div>

                {/* Table Body */}
                <div className="space-y-2">
                    {dummyData.map((item, index) => (
                        <div key={index} className="bg-white border border-[#FFB300] rounded-[10px] grid grid-cols-5 px-4 py-3 items-center text-center hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-2 pl-4">
                                <div className="w-4 h-4 rounded-full border-2 border-black"></div>
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="text-gray-700">{item.username}</div>
                            <div className="text-gray-700">{item.courseName}</div>
                            <div className="text-gray-700">{item.startDate}</div>
                            <div className="text-gray-700 font-medium">{item.timeTaken}</div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-sm text-gray-600 pl-2">
                    Users Completed - 10 out of 322
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    className="bg-gray-100 px-6 py-2 rounded-lg text-gray-500 hover:bg-gray-200"
                    disabled
                >
                    Previous
                </button>

                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-[#FFB300] text-white rounded-[5px]">1</button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-yellow-100 rounded-[5px]">2</button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-yellow-100 rounded-[5px]">3</button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-yellow-100 rounded-[5px]">4</button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-yellow-100 rounded-[5px]">5</button>
                </div>

                <button className="bg-[#FFB300] px-8 py-2 rounded-lg text-black font-medium hover:bg-orange-400">
                    Next
                </button>
            </div>
        </div>
    );
};

export default CourseProgressDetails;
