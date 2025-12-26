import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(8);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users', {
        withCredentials: true
      });
      setUsers(response.data);
      console.log(response.data);
      setTotalUsers(response.data.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredUsers);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="w-full">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            </div>
            
            {/* Search Bar and Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Action Buttons */}
              <button className="w-10 h-10 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Container with Custom CSS */}
        <div 
          style={{
            width: '1333px',
            height: '828px',
            opacity: 1,
            margin: '0 auto',
            borderRadius: '20px',
            borderWidth: '1px',
            paddingTop: '20px',
            paddingBottom: '20px',
            background: '#F2F2F266',
            border: '1px solid #FFB300'
          }}
          className="relative"
        >
          {/* Table Controls */}
          <div className="flex items-center justify-between mb-4 px-6">
            {/* Search Box - Left Side */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Filter, Sort, Export - Right Side */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Filter</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sort</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Export</button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto px-6">
            <table className="w-full" style={{ borderSpacing: '0 20px', borderCollapse: 'separate' }}>
                             <thead>
                 <tr style={{ background: '#FFB300' }} className="border-b border-gray-200">
                   <th className="text-center py-3 px-4 text-white">
                     <input
                       type="checkbox"
                       checked={selectedUsers.length === users.length && users.length > 0}
                       onChange={handleSelectAll}
                       className="w-4 h-4 text-white rounded focus:ring-white"
                     />
                   </th>
                   <th className="text-center py-3 px-4 font-semibold text-white">Name</th>
                   <th className="text-center py-3 px-4 font-semibold text-white">User Name</th>
                   <th className="text-center py-3 px-4 font-semibold text-white">Email ID</th>
                   <th className="text-center py-3 px-4 font-semibold text-white">Phone Number</th>
                   <th className="text-center py-3 px-4 font-semibold text-white">Joined</th>
                   <th className="text-center py-3 px-4 font-semibold text-white">Courses Enrolled</th>
                   <th className="text-center py-3 px-4 font-semibold text-white">Status</th>
                   <th className="text-center py-3 px-4 font-semibold text-white">Action</th>
                 </tr>
               </thead>
              <tbody>
                {paginatedUsers.map((user, index) => {
                  const isOdd = (index + 1) % 2 === 1;
                  const rowStyle = isOdd ? {
                    borderWidth: '1px',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '5px',
                    borderBottomLeftRadius: '5px',
                    background: '#FFF1CF',
                    border: '1px solid #97A795'
                  } : {
                    borderRadius: '5px',
                    borderWidth: '1px',
                    background: '#FFFFFF',
                    border: '1px solid #FFB300'
                  };
                  
                                     return (
                     <tr key={user._id} style={rowStyle} className="hover:bg-gray-50">
                       <td className="py-3 px-4 text-center" style={{ paddingRight: '10px' }}>
                         <input
                           type="checkbox"
                           checked={selectedUsers.includes(user._id)}
                           onChange={() => handleSelectUser(user._id)}
                           className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                         />
                       </td>
                       <td className="py-3 px-4 font-medium text-center" style={{ paddingRight: '10px' }}>{user.name || 'N/A'}</td>
                       <td className="py-3 px-4 text-gray-600 text-center" style={{ paddingRight: '10px' }}>{user.username || 'N/A'}</td>
                       <td className="py-3 px-4 text-gray-600 text-center" style={{ paddingRight: '10px' }}>{user.email || 'N/A'}</td>
                       <td className="py-3 px-4 text-gray-600 text-center" style={{ paddingRight: '10px' }}>{user.phoneNumber || 'N/A'}</td>
                       <td className="py-3 px-4 text-gray-600 text-center" style={{ paddingRight: '10px' }}>
                         {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                       </td>
                       <td className="py-3 px-4 text-gray-600 text-center" style={{ paddingRight: '10px' }}>1</td>
                       <td className="py-3 px-4 text-center" style={{ paddingRight: '10px' }}>
                         <span 
                           style={{
                             width: '70px',
                             height: '22px',
                             borderRadius: '10px',
                             paddingTop: '2px',
                             paddingRight: '12px',
                             paddingBottom: '2px',
                             paddingLeft: '12px',
                             background: '#10C500',
                             color: 'white',
                             display: 'inline-block',
                             textAlign: 'center',
                             fontSize: '12px',
                             fontWeight: '500'
                           }}
                         >
                           Active
                         </span>
                       </td>
                       <td className="py-3 px-4 text-center">
                         <div className="flex items-center justify-center space-x-2">
                           <button className="w-8 h-8 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                           </button>
                           <button className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                           </button>
                         </div>
                       </td>
                     </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
          
          {/* User Count at Bottom Left */}
          <div className="flex justify-start px-6 mt-4">
            <div className="text-gray-600 font-medium">
              No of Users - {paginatedUsers.length} out of {totalUsers}
            </div>
          </div>
        </div>
        
        {/* Pagination - At the bottom of the page */}
        <div className="flex items-center justify-between mt-6 bg-white rounded-lg shadow-sm p-6">
          {/* Previous Button - Left */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              width: '158px',
              height: '40px',
              borderRadius: '6px',
              paddingTop: '10px',
              paddingRight: '48px',
              paddingBottom: '10px',
              paddingLeft: '48px',
              background: '#FFF0CE',
              boxShadow: '0px 0px 6px 0px #0000004D'
            }}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
                     {/* Page Numbers - Center */}
           <div className="flex items-center space-x-2">
             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
               const pageNum = i + 1;
               return (
                 <button
                   key={pageNum}
                   onClick={() => setCurrentPage(pageNum)}
                   className={`px-3 py-2 rounded-lg ${
                     currentPage === pageNum
                       ? 'bg-orange-500 text-white'
                       : 'border border-gray-300 hover:bg-gray-50'
                   }`}
                 >
                   {pageNum}
                 </button>
               );
             })}
           </div>
          
          {/* Next Button - Right */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              width: '158px',
              height: '40px',
              borderRadius: '6px',
              paddingTop: '10px',
              paddingRight: '63px',
              paddingBottom: '10px',
              paddingLeft: '63px',
              borderWidth: '1px',
              background: '#FF9D00',
              border: '1px solid #FFF1CF',
              boxShadow: '0px 1px 5px 0px #0000004D'
            }}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
