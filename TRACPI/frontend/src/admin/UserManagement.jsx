import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Components
import DeleteUserPopup from './DeleteUserPopup';
import SuspendUserPopup from './SuspendUserPopup';

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
    return true;
  });

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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-white w-full font-['Poppins'] pb-10">

      {/* Main Content Box */}
      <div className="px-10 mt-6">
        <div className="border border-[#FFB300] rounded-[30px] bg-[#FDFDFD] p-8 shadow-[0px_4px_30px_rgba(0,0,0,0.02)] min-h-[680px] flex flex-col">
          {/* Inner Controls */}
          <div className="flex justify-between items-center mb-10">
            <div className="relative w-[340px] h-[44px]">
              <input
                type="text"
                placeholder="Search"
                value={innerSearchTerm}
                onChange={(e) => handleInnerSearch(e.target.value)}
                className="w-full h-full pl-4 pr-12 rounded-[12px] border border-gray-300 focus:outline-none focus:border-[#FFB300] text-sm text-gray-700 placeholder-gray-400"
              />
              <img src={SearchIcon} alt="Search" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-black" />
            </div>

            <div className="flex gap-4">
              <button className="bg-white border border-gray-300 text-gray-800 px-8 py-2.5 rounded-[12px] text-[15px] font-medium hover:bg-gray-50 transition-colors">Filter</button>
              <button className="bg-white border border-gray-300 text-gray-800 px-8 py-2.5 rounded-[12px] text-[15px] font-medium hover:bg-gray-50 transition-colors">Sort</button>
              <button className="bg-[#E20000] text-white px-10 py-2.5 rounded-[12px] text-[15px] font-bold shadow-md hover:bg-[#C10000] transition-colors uppercase tracking-wider">Export</button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4 min-w-[1100px]">
              <thead className="bg-[#FFB300]">
                <tr>
                  <th className="px-6 py-5 rounded-tl-[15px] rounded-bl-[15px] text-left">
                    <div className="flex items-center gap-4 text-white font-bold text-[18px]">
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
                  <th className="px-6 py-5 text-left text-white font-bold text-[18px]">User Name</th>
                  <th className="px-6 py-5 text-left text-white font-bold text-[18px]">Email ID</th>
                  <th className="px-6 py-5 text-left text-white font-bold text-[18px]">Phone Number</th>
                  <th className="px-6 py-5 text-left text-white font-bold text-[18px]">Joined</th>
                  <th className="px-6 py-5 text-center text-white font-bold text-[18px]">Courses Enrolled</th>
                  <th className="px-6 py-5 text-center text-white font-bold text-[18px]">Status</th>
                  <th className="px-6 py-5 rounded-tr-[15px] rounded-br-[15px] text-center text-white font-bold text-[18px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="text-center py-20 text-gray-400">Loading users...</td></tr>
                ) : currentUsers.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-20 text-gray-400 italic">No users available</td></tr>
                ) : (
                  currentUsers.map((user, idx) => (
                    <tr key={user._id} className={`group hover:shadow-lg transition-all duration-300 shadow-[0px_2px_15px_rgba(0,0,0,0.05)] rounded-[15px] ${selectedUsers.includes(user._id) ? 'bg-[#FFF8E7]' : 'bg-white'}`}>
                      <td className="px-6 py-4 rounded-l-[15px] border-l border-t border-b border-gray-100 group-hover:border-[#FFB30040]">
                        <div className="flex items-center gap-4">
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
                          <span className="font-bold text-[#333] text-[16px] whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[16px]">@{user.email.split('@')[0]}</td>
                      <td className="px-6 py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[16px]">{user.email}</td>
                      <td className="px-6 py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[16px]">{user.phoneNumber || '9966885555'}</td>
                      <td className="px-6 py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-gray-600 font-medium text-[16px]">{dayjs(user.createdAt).format('D/M/YYYY')}</td>
                      <td className="px-6 py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-center font-bold text-[#333] text-[16px]">{user.enrollmentCount || 1}</td>
                      <td className="px-6 py-4 border-t border-b border-gray-100 group-hover:border-[#FFB30040] text-center">
                        <span className={`inline-block px-6 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider text-white ${user.status === 'suspended' ? 'bg-[#FF0000]' : 'bg-[#00D100]'
                          }`}>
                          {user.status === 'suspended' ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 rounded-r-[15px] border-r border-t border-b border-gray-100 group-hover:border-[#FFB30040]">
                        <div className="flex justify-center items-center gap-6">
                          <button
                            onClick={() => { setUserToDelete(user); setShowDeleteUser(true); }}
                            className="hover:scale-110 transition-transform"
                          >
                            <img src={TrashIcon} alt="Delete" className="w-[18px] h-[18px]" style={{ filter: 'opacity(0.8) contrast(1.2)' }} />
                          </button>
                          <button
                            onClick={() => { setUserToSuspend(user); setShowSuspendUser(true); }}
                            className="hover:scale-110 transition-transform"
                          >
                            <img src={LockIcon} alt="Suspend" className="w-[18px] h-[18px] opacity-40" />
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
          <div className="mt-auto pt-6 text-[15px] font-medium text-gray-600 opacity-80">
            No of Users - {filteredUsers.length} out of {users.length}
          </div>
        </div>
      </div>

      {/* Pagination Grid */}
      {totalPages > 1 && (
        <div className="px-10 mt-10 flex justify-between items-center max-w-[1334px] mx-auto w-full">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#F2F2F2] px-10 py-3.5 rounded-[12px] font-bold text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-11 h-11 rounded-[8px] flex items-center justify-center font-bold text-lg transition-all ${currentPage === num ? 'bg-[#FF9D00] text-white shadow-lg shadow-[#FF9D0040]' : 'bg-[#FFF8E1] text-gray-600 hover:bg-[#FFE082]'
                  }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-[#FF9D00] px-12 py-3.5 rounded-[12px] font-bold text-white shadow-lg shadow-[#FF9D0040] hover:bg-[#FF8A00] transition-colors disabled:opacity-40"
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
    </div>
  );
};

export default UserManagement;
