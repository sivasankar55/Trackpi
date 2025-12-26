import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrashIcon from '../assets/trash.png';
import EditIcon from '../assets/edit.png';
import LockIcon from '../assets/lock.png';
import SearchIcon from "../assets/search2.png";
import CourseImage from "../assets/course.png";

const ProgressTracking = ({ onEditAdmin }) => {
    const navigate = useNavigate();
    const itemsPerPage = 8;
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch admins from API
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

    // Filter admins based on search term
    const filteredAdmins = admins.filter(admin => 
        admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
    };

    return (
    
        <div className="admin-management p-6 text-black">
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                    Loading admin data...
                </div>
            )}

            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4">
                {/* Search Input with Icon on Right */}
                {/* <div className="relative" style={{ width: "330px", height: "44px" }}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-full pr-10 pl-[10px] py-[13px] rounded-[10px] border border-[#FFB300] bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#FFB300]"
                    />
                    <img
                        src={SearchIcon}
                        alt="Search Icon"
                        className="w-5 h-5 absolute right-[10px] top-1/2 transform -translate-y-1/2 pointer-events-none"
                    />
                </div> */}
                <div className="relative" style={{ width: "330px", height: "44px" }}>
  <input
    type="text"
    placeholder="Search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full h-full pr-10 pl-[10px] py-[13px] rounded-[10px] border border-[#FFB300] bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#FFB300]"
  />
  <button
    onClick={() => handleSearch(searchTerm)} // Optional if needed for trigger
    className="absolute right-[10px] top-1/2 transform -translate-y-1/2"
  >
    <img
      src={SearchIcon}
      alt="Search Icon"
      className="w-5 h-5"
    />
  </button>
</div>


                {/* Filter & Export Buttons */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-white border px-4 py-2 rounded hover:bg-gray-50"
                    >
                        Refresh
                    </button>

                    <button className="bg-white border px-4 py-2 rounded">Filter</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded shadow-md">Export</button>
                </div>
            </div>

            

     

            {/* Stats Cards Section */}
            <div className="flex gap-[58px] mt-8 justify-center">
                {/* Card 1: Total Users Enrolled */}
                <div 
                    style={{
                        width: '278px',
                        height: '90px',
                        borderRadius: '5px',
                        borderWidth: '1px',
                        paddingTop: '20px',
                        paddingRight: '40px',
                        paddingBottom: '20px',
                        paddingLeft: '40px',
                        gap: '10px',
                        background: '#FFF1CFCC',
                        border: '1px solid var(--dark-orange, #FF9D00)',
                        backdropFilter: 'blur(100px)',
                        boxShadow: '2px 2px 10px 0px #00000040, 1px 1px 10px 0px #FFB30080 inset'
                    }}
                    className="flex flex-col items-center justify-center"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-black mb-1">Total Users Enrolled</div>
                        <div className="text-2xl font-bold text-black">332</div>
                    </div>
                </div>

                {/* Card 2: Not Started Yet */}
                <div 
                    style={{
                        width: '278px',
                        height: '90px',
                        borderRadius: '5px',
                        borderWidth: '1px',
                        paddingTop: '20px',
                        paddingRight: '40px',
                        paddingBottom: '20px',
                        paddingLeft: '40px',
                        gap: '10px',
                        background: '#FFF1CFCC',
                        border: '1px solid #0066CC',
                        backdropFilter: 'blur(100px)',
                        boxShadow: '2px 2px 10px 0px #00000040, 1px 1px 10px 0px #FFB30080 inset'
                    }}
                    className="flex flex-col items-center justify-center"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center relative">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-0.5 bg-red-500 rotate-45"></div>
                                <div className="w-4 h-0.5 bg-red-500 -rotate-45 absolute"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-black mb-1">Not Started Yet</div>
                        <div className="text-2xl font-bold text-black">50</div>
                    </div>
                </div>

                {/* Card 3: Total Users Completed */}
                <div 
                    style={{
                        width: '278px',
                        height: '90px',
                        borderRadius: '5px',
                        borderWidth: '1px',
                        paddingTop: '20px',
                        paddingRight: '40px',
                        paddingBottom: '20px',
                        paddingLeft: '40px',
                        gap: '10px',
                        background: '#FFF1CFCC',
                        border: '1px solid #0066CC',
                        backdropFilter: 'blur(100px)',
                        boxShadow: '2px 2px 10px 0px #00000040, 1px 1px 10px 0px #FFB30080 inset'
                    }}
                    className="flex flex-col items-center justify-center relative"
                >
                    <div 
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            bottom: '10px',
                            border: '2px dotted #0066CC',
                            borderRadius: '3px'
                        }}
                        className="pointer-events-none"
                    ></div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-black mb-1">Total Users completed</div>
                        <div className="text-2xl font-bold text-black">332</div>
                    </div>
                </div>

                {/* Card 4: Total Users InProgress */}
                <div 
                    style={{
                        width: '278px',
                        height: '90px',
                        borderRadius: '5px',
                        borderWidth: '1px',
                        paddingTop: '20px',
                        paddingRight: '40px',
                        paddingBottom: '20px',
                        paddingLeft: '40px',
                        gap: '10px',
                        background: '#FFF1CFCC',
                        border: '1px solid var(--dark-orange, #FF9D00)',
                        backdropFilter: 'blur(100px)',
                        boxShadow: '2px 2px 10px 0px #00000040, 1px 1px 10px 0px #FFB30080 inset'
                    }}
                    className="flex flex-col items-center justify-center"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-black mb-1">Total Users InProgress</div>
                        <div className="text-2xl font-bold text-black">332</div>
                    </div>
                </div>
            </div>

            {/* Search Box Section */}
            <div className="flex justify-start mt-8">
                <div 
                    style={{
                        width: '539px',
                        height: '34px',
                        borderRadius: '2px',
                        borderWidth: '1px',
                        paddingTop: '9px',
                        paddingRight: '7px',
                        paddingBottom: '9px',
                        paddingLeft: '7px',
                        gap: '10px',
                        background: 'var(--dark-orange, #FF9D00)',
                        border: '1px solid var(--darker-orange, #BB6002)',
                        boxShadow: '2px 2px 10px 0px #00000040, 2px 2px 10px 0px #2CC19726 inset',
                        backdropFilter: 'blur(100px)'
                    }}
                    className="flex items-center"
                >
                    {/* Search Lens Icon */}
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center mr-2">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Search by student name, course…"
                        className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
                        style={{ 
                            border: 'none',
                            fontFamily: 'Poppins',
                            fontWeight: '300',
                            fontStyle: 'normal',
                            fontSize: '10px',
                            lineHeight: '100%',
                            letterSpacing: '2%'
                        }}
                    />
                </div>
            </div>

            {/* Course Cards Section */}
            <div className="mt-8">
                {/* Course Cards Grid */}
                <div className="grid grid-cols-5 gap-[36px] mb-[48px]">
                    {/* Generate 10 identical course cards */}
                    {[...Array(10)].map((_, index) => (
                        <div 
                            key={index}
                            style={{
                                width: '238px',
                                height: '319px',
                                borderRadius: '15px',
                                borderWidth: '1px',
                                paddingBottom: '10px',
                                background: '#FFF1CF',
                                border: '1px solid var(--dark-orange, #FF9D00)'
                            }}
                            className="flex flex-col"
                        >
                            {/* Top Section - Graphic/Image */}
                            <div className="flex-1 bg-gradient-to-br from-blue-900 to-black rounded-t-[15px] p-4 flex items-center justify-center">
                                <img 
                                    src={CourseImage} 
                                    alt="Course" 
                                    className="w-full h-full object-cover rounded-t-[15px]"
                                />
                            </div>

                            {/* Bottom Section - Course Details */}
                            <div className="p-4 bg-[#FFF1CF] rounded-b-[15px]">
                                {/* Course Name and Duration */}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-black text-sm">Course Name</span>
                                    <span className="text-black text-xs">5 Hours</span>
                                </div>
                                
                                {/* Progress Stats */}
                                <div className="space-y-1 mb-4">
                                    <div className="text-black text-xs">Completed: 10</div>
                                    <div className="text-black text-xs">InProgress: 8</div>
                                </div>
                                
                                {/* More Info Button */}
                                <div className="flex justify-center">
                                    <button
                                        style={{
                                            width: '93px',
                                            height: '34px',
                                            borderRadius: '20px',
                                            borderWidth: '1px',
                                            paddingTop: '10px',
                                            paddingRight: '20px',
                                            paddingBottom: '10px',
                                            paddingLeft: '20px',
                                            background: 'var(--Main-color, #FFB300)',
                                            border: '1px solid var(--dark-orange, #FF9D00)',
                                            boxShadow: '0px 0px 4px 1px #FF9D0080'
                                        }}
                                        className="text-white text-xs font-medium"
                                    >
                                        More Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Section */}
                <div className="flex justify-between items-center">
                    {/* Previous Button */}
                    <button
                        className="bg-[#FFF0CE] text-black rounded-lg px-6 py-2 font-medium"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 rounded-lg font-medium ${
                                    page === 1 
                                        ? 'bg-[#FFB300] text-white' 
                                        : 'text-black'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        className="bg-[#FFB300] text-white rounded-lg px-6 py-2 font-medium"
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProgressTracking;
