import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '../assets/search2.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExportProgressPopup from './ExportProgressPopup';

const CourseProgressDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get('courseId');

    const [activeTab, setActiveTab] = useState('completed'); // 'completed' or 'inprogress'
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all'); // 'all', 'suspended', 'latest', 'oldest'
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterRef = useRef(null);
    const [sortOption, setSortOption] = useState('none'); // 'none', 'ascending', 'descending'
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allData, setAllData] = useState([]);
    const [showExport, setShowExport] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchProgress = async () => {
            if (!courseId) {
                setError('No course selected');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/enrollments/course/${courseId}/users-progress`, {
                    withCredentials: true
                });
                setAllData(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching course progress:', err);
                setError('Failed to load progress data');
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [courseId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredData = allData
        .filter(item => {
            const matchesSearch = (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.username?.toLowerCase().includes(searchTerm.toLowerCase()));
            const isCompleted = item.progress === 100 && item.passedAssessment;
            const matchesTab = activeTab === 'completed' ? isCompleted : !isCompleted;
            const matchesFilter = filterOption === 'suspended' ? item.status === 'suspended' : true;
            return matchesSearch && matchesTab && matchesFilter;
        })
        .sort((a, b) => {
            // Priority 1: Name Sort (Ascending/Descending)
            if (sortOption === 'ascending') {
                return (a.name || '').localeCompare(b.name || '');
            }
            if (sortOption === 'descending') {
                return (b.name || '').localeCompare(a.name || '');
            }

            // Priority 2: Filter-based sorting (Latest/Oldest)
            if (filterOption === 'latest') {
                return new Date(b.rawDate) - new Date(a.rawDate);
            }
            if (filterOption === 'oldest') {
                return new Date(a.rawDate) - new Date(b.rawDate);
            }
            return 0;
        });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFB300]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-[#FFB300] text-white rounded-lg font-bold"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 text-black min-h-screen font-['Poppins']">
            {/* Top Search and Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full h-11 pr-12 pl-4 rounded-xl border border-[#FFB300] bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-[#FFB300] focus:outline-none transition-all shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <img src={SearchIcon} alt="Search" className="w-5 h-5 opacity-50" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 relative">
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="px-6 py-2 rounded-lg border border-[#FFB300] bg-white hover:bg-yellow-50 text-black font-medium transition-colors flex items-center gap-2"
                        >
                            Filter
                            <span className="text-[10px] bg-[#FFB300] text-white px-1.5 rounded-full capitalize">{filterOption}</span>
                        </button>

                        {showFilterDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#FFB300] rounded-xl shadow-xl z-50 overflow-hidden">
                                {[
                                    { id: 'all', label: 'All Users' },
                                    { id: 'suspended', label: 'Suspended' },
                                    { id: 'latest', label: 'Latest Joined' },
                                    { id: 'oldest', label: 'Oldest Joined' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setFilterOption(option.id);
                                            setShowFilterDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FFF1CF] transition-colors ${filterOption === option.id ? 'bg-[#FFB300] text-white' : 'text-black'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Closing div for filter relative container was missing or implied? No, I'll just wrap the button. */}

                    <div className="relative" ref={sortRef}>
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="px-6 py-2 rounded-lg border border-[#FFB300] bg-white hover:bg-yellow-50 text-black font-medium transition-colors flex items-center gap-2"
                        >
                            Sort
                            {sortOption !== 'none' && (
                                <span className="text-[10px] bg-[#FFB300] text-white px-1.5 rounded-full capitalize">{sortOption}</span>
                            )}
                        </button>

                        {showSortDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#FFB300] rounded-xl shadow-xl z-50 overflow-hidden">
                                {[
                                    { id: 'none', label: 'Default' },
                                    { id: 'ascending', label: 'Ascending (A-Z)' },
                                    { id: 'descending', label: 'Descending (Z-A)' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSortOption(option.id);
                                            setShowSortDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FFF1CF] transition-colors ${sortOption === option.id ? 'bg-[#FFB300] text-white' : 'text-black'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setShowExport(true)}
                        className="px-8 py-2 rounded-lg bg-[#D00000] text-white hover:bg-red-700 font-bold shadow-md transition-all"
                    >
                        Export
                    </button>
                </div>
            </div>

            {/* Export Popup */}
            {showExport && (
                <ExportProgressPopup
                    onClose={() => setShowExport(false)}
                    data={filteredData}
                    courseName={allData[0]?.courseName}
                />
            )}

            {/* Tabs */}
            <div className="flex w-full">
                <button
                    onClick={() => { setActiveTab('completed'); setCurrentPage(1); }}
                    className={`flex-1 py-4 text-center text-lg font-bold rounded-t-2xl transition-all duration-300 ${activeTab === 'completed'
                        ? 'bg-[#FFB300] text-white shadow-[-4px_0_10px_rgba(0,0,0,0.05)]'
                        : 'bg-[#FFF9E5] text-black/40 border-b border-[#FFB300]/30 hover:bg-[#FFF1CF]'
                        }`}
                >
                    Completed users ({allData.filter(d => d.progress === 100 && d.passedAssessment).length})
                </button>
                <button
                    onClick={() => { setActiveTab('inprogress'); setCurrentPage(1); }}
                    className={`flex-1 py-4 text-center text-lg font-bold rounded-t-2xl transition-all duration-300 ${activeTab === 'inprogress'
                        ? 'bg-[#FFB300] text-white shadow-[4px_0_10px_rgba(0,0,0,0.05)]'
                        : 'bg-[#FFF9E5] text-black/40 border-b border-[#FFB300]/30 hover:bg-[#FFF1CF]'
                        }`}
                >
                    In Progress users ({allData.filter(d => !(d.progress === 100 && d.passedAssessment)).length})
                </button>
            </div>

            {/* Table Container */}
            <div className="w-full bg-[#FFF1CF] border border-[#FFB300] rounded-b-2xl p-6 min-h-[500px] shadow-lg">

                {/* Table Header */}
                <div className="bg-[#FF9D00] text-white grid grid-cols-5 px-6 py-4 rounded-xl mb-4 font-bold text-sm uppercase tracking-wider text-center shadow-md">
                    <div className="text-left flex items-center gap-3">
                        <div className="w-4 h-4 rounded-md border-2 border-white/50"></div>
                        Name
                    </div>
                    <div>User Email</div>
                    <div>Course Name</div>
                    <div>Start Date</div>
                    <div>Status / Progress</div>
                </div>

                {/* Table Body */}
                <div className="space-y-3">
                    {currentData.length > 0 ? currentData.map((item, index) => (
                        <div
                            key={item.userId || index}
                            onClick={() => navigate(`/admin/user-details/${item.userId}`)}
                            className="bg-white border border-[#FFB300]/30 rounded-xl grid grid-cols-5 px-6 py-4 items-center text-center hover:bg-white/80 hover:scale-[1.005] transition-all shadow-sm cursor-pointer group"
                        >
                            <div className="text-left flex items-center gap-3">
                                <div className="w-4 h-4 rounded-md border-2 border-[#FFB300] group-hover:bg-[#FFB300]"></div>
                                <span className="font-bold text-black border-b border-transparent group-hover:border-[#FFB300] group-hover:text-[#FF9D00] transition-all">{item.name}</span>
                            </div>
                            <div className="text-gray-600 truncate px-2">{item.username}</div>
                            <div className="text-gray-600 italic">{item.courseName}</div>
                            <div className="text-gray-500 text-sm">{item.startDate}</div>
                            <div className="flex justify-center flex-col items-center">
                                <span className={`font-bold text-xs px-3 py-1 rounded-full ${item.progress === 100 && item.passedAssessment ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {item.progress === 100 && item.passedAssessment ? 'COMPLETED' : `${item.progress}% DONE`}
                                </span>
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${item.progress === 100 && item.passedAssessment ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${item.progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-[#FFB300]/20">
                            <p className="text-black/40 font-bold">No users found for this category</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-sm font-bold text-black/60 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF9D00]"></div>
                    Total count in this view: {filteredData.length}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
                <button
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-[#FFB300] rounded-xl text-black font-bold hover:bg-yellow-50 disabled:opacity-30 transition-all shadow-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>

                <div className="flex gap-3">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-sm transition-all ${currentPage === pageNum
                                ? 'bg-[#FF9D00] text-white scale-110'
                                : 'bg-white hover:bg-yellow-50 text-black border border-[#FFB300]/20'
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                <button
                    className="flex items-center gap-2 px-10 py-3 bg-[#FF9D00] rounded-xl text-white font-bold hover:bg-[#FF8C00] disabled:opacity-30 transition-all shadow-md shadow-[#FF9D00]/20"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                    Next
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default CourseProgressDetails;

