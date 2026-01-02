import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Components
import DeleteUserPopup from './DeleteUserPopup';
import SuspendUserPopup from './SuspendUserPopup';
import AddUserPopup from './AddUserPopup';
import ExportUserPopup from './ExportUserPopup';

// Icons
import PlusIcon from '../assets/plus.png';
import TrashIcon from '../assets/trash.png';
import LockIcon from '../assets/lock.png';
import BellIcon from '../assets/bell.png';
import UserIcon from '../assets/user.png';
import SearchIcon from '../assets/search2.png';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [innerSearchTerm, setInnerSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const itemsPerPage = 8;
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Popups state
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showSuspendUser, setShowSuspendUser] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showExportUser, setShowExportUser] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users', {
        withCredentials: true
      });
      setUsers(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleInnerSearch = (term) => {
    setInnerSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user => {
    const matchesTopSearch = (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesInnerSearch = (
      user.name?.toLowerCase().includes(innerSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(innerSearchTerm.toLowerCase())
    );

    if (!matchesTopSearch || !matchesInnerSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Suspended') return user.status === 'suspended';
    if (selectedFilter === 'Active') return user.status === 'active';
    if (selectedFilter === 'Inactive') return user.enrollmentCount > 0 && user.maxProgress < 10;
    if (selectedFilter === 'Completed') return user.maxProgress === 100;
    if (selectedFilter === 'Don\'t Start') return !user.enrollmentCount || user.enrollmentCount === 0;
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (selectedSort === 'Ascending') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (selectedSort === 'Descending') {
      return (b.name || '').localeCompare(a.name || '');
    }
    if (selectedSort === 'Newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (selectedSort === 'Oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  // Close filter or sort when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length && currentUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user._id));
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-white w-full font-['Poppins'] pb-10">

      {/* Main Content Box */}
      <div className="px-4 sm:px-10 mt-6 sm:mt-8">
        <div className="border border-[#FFB30080] rounded-[20px] sm:rounded-[30px] bg-white p-4 sm:p-8 shadow-[0px_4px_30px_rgba(0,0,0,0.02)] min-h-[500px] sm:min-h-[680px] flex flex-col">
          {/* Inner Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6 sm:mb-8 gap-5 lg:gap-0">
            <div className="relative w-full lg:w-[340px] h-[44px]">
              <input
                type="text"
                placeholder="search"
                value={innerSearchTerm}
                onChange={(e) => handleInnerSearch(e.target.value)}
                className="w-full h-full pl-4 pr-12 rounded-[12px] border border-[#FFB300] focus:outline-none bg-white text-sm text-gray-700 placeholder-gray-400"
              />
              <img src={SearchIcon} alt="Search" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 w-full lg:w-auto">
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-[#FF9D00] text-white px-6 sm:px-8 py-2.5 rounded-[12px] text-[13px] sm:text-[14px] font-bold shadow-md hover:bg-[#FF8A00] transition-colors flex items-center gap-2"
              >
                <img src={PlusIcon} alt="Add" className="w-3.5 h-3.5 sm:w-4 sm:h-4 brightness-0 invert" />
                <span>Add User</span>
              </button>

              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`bg-white border text-gray-600 px-6 sm:px-8 py-2.5 rounded-[12px] text-[13px] sm:text-[14px] font-medium hover:bg-gray-50 transition-all flex items-center gap-2 sm:gap-4 ${selectedFilter !== 'All' ? 'border-[#FFB300] bg-[#FFF8E7]' : 'border-gray-300'
                    }`}
                >
                  Filter {selectedFilter !== 'All' && `(${selectedFilter})`}
                  <svg className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-[#FFB300] rounded-2xl shadow-2xl z-[100] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {['All', 'Active', 'Suspended', 'Inactive', 'Completed', 'Don\'t Start'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setIsFilterOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-5 py-3.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${selectedFilter === filter
                          ? 'bg-[#FFF1CF] font-bold text-[#FF8200]'
                          : 'text-gray-700 hover:bg-[#FFF8E7]'
                          }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`bg-white border text-gray-600 px-6 sm:px-8 py-2.5 rounded-[12px] text-[13px] sm:text-[14px] font-medium hover:bg-gray-50 transition-all flex items-center gap-2 sm:gap-4 ${selectedSort !== 'Newest' ? 'border-[#FFB300] bg-[#FFF8E7]' : 'border-gray-300'
                    }`}
                >
                  Sort {selectedSort !== 'Newest' && `(${selectedSort})`}
                  <svg className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-[#FFB300] rounded-2xl shadow-2xl z-[100] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {['Ascending', 'Descending', 'Newest', 'Oldest'].map((sort) => (
                      <button
                        key={sort}
                        onClick={() => {
                          setSelectedSort(sort);
                          setIsSortOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-5 py-3.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${selectedSort === sort
                          ? 'bg-[#FFF1CF] font-bold text-[#FF8200]'
                          : 'text-gray-700 hover:bg-[#FFF8E7]'
                          }`}
                      >
                        {sort}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowExportUser(true)}
                className="bg-[#E20000] text-white px-8 sm:px-10 py-2.5 rounded-[12px] text-[13px] sm:text-[14px] font-bold shadow-md hover:bg-[#C10000] transition-colors uppercase tracking-wider"
              >
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto pb-4">
            <table className="w-full border-separate border-spacing-y-3 sm:border-spacing-y-4 min-w-[1000px]">
              <thead className="bg-[#FFB300]">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 rounded-tl-[15px] rounded-bl-[15px] text-left">
                    <div className="flex items-center gap-3 sm:gap-4 text-white font-bold text-[16px] sm:text-[18px]">
                      <button
                        onClick={handleSelectAll}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center ${selectedUsers.length === currentUsers.length && currentUsers.length > 0
                          ? 'bg-white border-white'
                          : 'border-white bg-transparent'
                          }`}
                      >
                        {selectedUsers.length === currentUsers.length && currentUsers.length > 0 && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>
                        )}
                      </button>
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-white font-bold text-[16px] sm:text-[18px]">User Name</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-white font-bold text-[16px] sm:text-[18px]">Email ID</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-white font-bold text-[16px] sm:text-[18px]">Phone Number</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-white font-bold text-[16px] sm:text-[18px]">Joined</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center text-white font-bold text-[16px] sm:text-[18px]">Courses Enrolled</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center text-white font-bold text-[16px] sm:text-[18px]">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 rounded-tr-[15px] rounded-br-[15px] text-center text-white font-bold text-[16px] sm:text-[18px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="text-center py-20 text-gray-400">Loading users...</td></tr>
                ) : currentUsers.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-20 text-gray-400 italic">No users available</td></tr>
                ) : (
                  currentUsers.map((user, idx) => (
                    <tr key={user._id} className={`group hover:shadow-lg transition-all duration-300 shadow-[0px_2px_15px_rgba(0,0,0,0.05)] rounded-[15px] ${selectedUsers.includes(user._id) ? 'bg-[#FFF8E7]' : (idx % 2 === 0 ? 'bg-[#FFF9E1]' : 'bg-white')}`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 rounded-l-[15px] border-l border-t border-b border-gray-100 group-hover:border-[#FFB30040]">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button
                            onClick={() => toggleUserSelection(user._id)}
                            className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${selectedUsers.includes(user._id)
                              ? 'bg-[#FF9D00] border-[#FF9D00]'
                              : 'border-gray-300 group-hover:border-[#FFB300]'
                              }`}
                          >
                            {selectedUsers.includes(user._id) && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                            )}
                          </button>
                          <span
                            onClick={() => navigate(`/admin/user-details/${user._id}`)}
                            className="font-bold text-[#333] text-[14px] sm:text-[16px] whitespace-nowrap cursor-pointer hover:text-[#FF9D00] transition-colors"
                          >
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[14px] sm:text-[16px]">@{user.email.split('@')[0]}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[14px] sm:text-[16px] max-w-[200px] truncate" title={user.email}>{user.email}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[14px] sm:text-[16px]">{user.phoneNumber || '9966885555'}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[14px] sm:text-[16px] whitespace-nowrap">{dayjs(user.createdAt).format('D/M/YYYY')}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-center font-bold text-[#333] text-[14px] sm:text-[16px]">{user.enrollmentCount || 1}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-center">
                        <span className={`inline-block px-4 sm:px-6 py-1.5 rounded-full text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-white ${user.status === 'suspended' ? 'bg-[#FF0000]' : 'bg-[#00D100]'
                          }`}>
                          {user.status === 'suspended' ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 rounded-r-[15px] border-r border-t border-b border-gray-100 group-hover:border-[#FFB30040]">
                        <div className="flex justify-center items-center gap-3 sm:gap-4">
                          <button
                            onClick={() => { setUserToDelete(user); setShowDeleteUser(true); }}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-[10px] border border-red-100 hover:bg-red-50 transition-colors"
                          >
                            <img src={TrashIcon} alt="Delete" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" style={{ filter: 'invert(16%) sepia(89%) saturate(6054%) hue-rotate(358deg) brightness(97%) contrast(113%)' }} />
                          </button>
                          <button
                            onClick={() => { setUserToSuspend(user); setShowSuspendUser(true); }}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-[10px] border border-orange-100 hover:bg-orange-50 transition-colors"
                          >
                            <img src={LockIcon} alt="Suspend" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" style={{ filter: 'invert(59%) sepia(93%) saturate(1450%) hue-rotate(5deg) brightness(102%) contrast(106%)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Info */}
          <div className="mt-auto pt-6 text-[13px] sm:text-[15px] font-medium text-gray-600 opacity-80 text-center sm:text-left">
            No of Users - {sortedUsers.length} out of {users.length}
          </div>
        </div>
      </div>

      {/* Pagination Grid */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-10 mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center max-w-[1334px] mx-auto w-full gap-4 sm:gap-0">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto bg-[#F2F2F2] px-8 sm:px-10 py-3 sm:py-3.5 rounded-[12px] font-bold text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-2 sm:gap-4 overflow-x-auto max-w-full pb-2 sm:pb-0">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[8px] flex items-center justify-center font-bold text-base sm:text-lg transition-all flex-shrink-0 ${currentPage === num ? 'bg-[#FF9D00] text-white shadow-lg shadow-[#FF9D0040]' : 'bg-[#FFF8E1] text-gray-600 hover:bg-[#FFE082]'
                  }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto bg-[#FF9D00] px-8 sm:px-12 py-3 sm:py-3.5 rounded-[12px] font-bold text-white shadow-lg shadow-[#FF9D0040] hover:bg-[#FF8A00] transition-colors disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showDeleteUser && userToDelete && (
        <DeleteUserPopup
          userToDelete={userToDelete}
          onClose={() => { setShowDeleteUser(false); setUserToDelete(null); }}
          onUserDeleted={() => {
            setShowDeleteUser(false);
            setUserToDelete(null);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}

      {showSuspendUser && userToSuspend && (
        <SuspendUserPopup
          userToSuspend={userToSuspend}
          onClose={() => { setShowSuspendUser(false); setUserToSuspend(null); }}
          onUserSuspended={() => {
            setShowSuspendUser(false);
            setUserToSuspend(null);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}

      {showAddUser && (
        <AddUserPopup
          onClose={() => setShowAddUser(false)}
          onUserAdded={() => setRefreshKey(prev => prev + 1)}
        />
      )}

      {showExportUser && (
        <ExportUserPopup
          onClose={() => setShowExportUser(false)}
          data={sortedUsers}
        />
      )}
    </div>
  );
};

export default UserManagement;
