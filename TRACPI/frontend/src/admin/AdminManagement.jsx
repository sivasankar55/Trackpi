import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import AddAdmin from './AddAdmin';
import DeleteAdminPopup from './DeleteAdminPopup';
import EditAdminPopup from './EditAdminPopup';
import SuspendAdminPopup from './SuspendAdminPopup';
import ExportAdminPopup from './ExportAdminPopup';

// Icons
import PlusIcon from '../assets/plus.png';
import TrashIcon from '../assets/trash.png';
import EditIcon from '../assets/edit.png';
import LockIcon from '../assets/lock.png';
import BellIcon from '../assets/bell.png';
import UserIcon from '../assets/user.png';
import DashboardIcon from '../assets/dashboard.png';
import SearchIcon from '../assets/search2.png';

const AdminManagement = () => {
  const navigate = useNavigate();
  const { logout, adminInfo } = useContext(AdminAuthContext);
  const currentUserRole = adminInfo?.adminType?.toLowerCase();

  // Popup States
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showDeleteAdmin, setShowDeleteAdmin] = useState(false);
  const [showEditAdmin, setShowEditAdmin] = useState(false);
  const [showSuspendAdmin, setShowSuspendAdmin] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [adminToSuspend, setAdminToSuspend] = useState(null);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [popupKey, setPopupKey] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filterRef = useRef(null);

  // Table Data States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 8;

  // Fetch admins
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
  }, [refreshKey]);

  // Cleanup for popups
  useEffect(() => {
    if (!showDeleteAdmin && !deletePopupVisible) {
      setTimeout(() => {
        const popupElements = document.querySelectorAll(
          '.delete-popup-container, .fixed.inset-0'
        );
        popupElements.forEach((element) => {
          if (element && element.parentNode) {
            element.remove();
          }
        });
      }, 100);
    }
  }, [showDeleteAdmin, deletePopupVisible]);

  // Handlers
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleAddAdmin = () => {
    if (currentUserRole === 'editor') return;
    setShowAddAdmin(true);
  };
  const handleCloseAddAdmin = () => setShowAddAdmin(false);

  const handleEditAdmin = (admin) => {
    const canManage =
      currentUserRole === 'super admin' ||
      (currentUserRole === 'admin' &&
        admin.adminType?.toLowerCase() === 'editor');
    if (!canManage) return;
    setAdminToEdit(admin);
    setShowEditAdmin(true);
  };

  const handleCloseEditAdmin = () => {
    setShowEditAdmin(false);
    setAdminToEdit(null);
  };

  const handleDeleteAdmin = (admin) => {
    const canManage =
      currentUserRole === 'super admin' ||
      (currentUserRole === 'admin' &&
        admin.adminType?.toLowerCase() === 'editor');
    if (!canManage) return;
    setAdminToDelete(admin);
    setShowDeleteAdmin(true);
    setDeletePopupVisible(true);
  };

  const handleCloseDeleteAdmin = () => {
    setShowDeleteAdmin(false);
    setDeletePopupVisible(false);
    setAdminToDelete(null);
    setPopupKey((prev) => prev + 1);
    setTimeout(() => {
      const allPopups = document.querySelectorAll(
        '.fixed.inset-0, .delete-popup-container'
      );
      allPopups.forEach((element) => {
        if (element && element.parentNode) {
          element.remove();
        }
      });
    }, 50);
  };

  const handleSuspendAdmin = (admin) => {
    const canManage =
      currentUserRole === 'super admin' ||
      (currentUserRole === 'admin' &&
        admin.adminType?.toLowerCase() === 'editor');
    if (!canManage) return;
    setAdminToSuspend(admin);
    setShowSuspendAdmin(true);
  };

  const handleCloseSuspendAdmin = () => {
    setShowSuspendAdmin(false);
    setAdminToSuspend(null);
  };

  const handleOpenExport = () => setShowExportPopup(true);
  const handleCloseExport = () => setShowExportPopup(false);

  // Filter Logic
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Suspended') return admin.status === 'suspended';

    // Match role (case insensitive for super admin etc)
    const roleTarget = selectedFilter.toLowerCase();
    return admin.adminType?.toLowerCase() === roleTarget;
  });

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Top Navigation Bar - Hidden when any popup is active */}
      {!showAddAdmin &&
        !showEditAdmin &&
        !showDeleteAdmin &&
        !showSuspendAdmin &&
        !showExportPopup && (
          <div className="sticky top-0 z-[1000] flex justify-between items-center px-6 py-4 shadow-md bg-white">
            <div className="flex items-center gap-2">
              <img
                src={DashboardIcon}
                alt="Dashboard Icon"
                className="w-6 h-6 object-contain"
              />
              <span className="font-bold text-xl text-black">Dashboard</span>

              <div className="flex items-center border border-gray-400 px-3 py-1 rounded ml-4 bg-white">
                <input
                  type="text" 
                  placeholder="Search"  
                  value={searchTerm}    
                  onChange={(e) => handleSearch(e.target.value)}   
                  className="outline-none text-sm placeholder-gray-600 text-black bg-white w-48"  
                />  
                <img  
                  src={SearchIcon} 
                  alt="Search Icon"  
                  className="w-4 h-4 ml-2" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification & Profile */}
              <button className="bg-[#FFF0CE] rounded-[1rem] border-2 border-[#FFB300] p-2 hover:bg-[#ffe2b5] transition">
                <img src={BellIcon} alt="Notification" className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/admin/profile')}
                className="bg-[#FFF0CE] rounded-full border-2 border-[#FFB300] p-2 hover:bg-[#ffe2b5] transition-colors"
                title="Profile"
              >
                <img src={UserIcon} alt="Profile" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      {/* Main Content Area */}
      <div className="w-full p-6 flex flex-col items-center">
        <div
          style={{
            width: '100%',
            maxWidth: '1334px',
            minHeight: '600px',
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
          {/* Inner Search & Filters */}
          <div className="flex items-center justify-between mb-6 px-6">
            <div
              className="relative"
              style={{ width: '330px', height: '44px' }}
            >
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-full pr-10 pl-[10px] py-[13px] rounded-[10px] border border-[#FFB300] bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FFB300]"
              />
              <div className="absolute right-[10px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                <img src={SearchIcon} alt="Search Icon" className="w-5 h-5" />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className="bg-white border text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition"
              >
                Refresh
              </button>
              {currentUserRole !== 'editor' && (
                <button
                  onClick={handleAddAdmin}
                  className="bg-[#FF9D00] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#FF8A00] transition-colors font-bold flex items-center gap-2"
                >
                  <img
                    src={PlusIcon}
                    alt="Add"
                    className="w-4 h-4 brightness-0 invert"
                  />
                  <span>Add Admin</span>
                </button>
              )}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`bg-white border text-gray-700 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2 ${
                    selectedFilter !== 'All'
                      ? 'border-[#FFB300] bg-[#FFF8E7]'
                      : ''
                  }`}
                >
                  Filter {selectedFilter !== 'All' && `(${selectedFilter})`}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isFilterOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#FFB300] rounded-xl shadow-xl z-[100] overflow-hidden">
                    {['All', 'Suspended', 'Super Admin', 'Editor', 'Admin'].map(
                      (filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setSelectedFilter(filter);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-[#FFF1CF] transition-colors border-b border-gray-100 last:border-0 ${
                            selectedFilter === filter
                              ? 'bg-[#FFF1CF] font-bold text-[#FF8200]'
                              : 'text-gray-700'
                          }`}
                        >
                          {filter}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleOpenExport}
                className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors font-semibold"
              >
                Export
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Admins Table */}
          {!loading && (
            <div className="overflow-x-auto px-6">
              <table
                className="w-full text-left"
                style={{ borderSpacing: '0 15px', borderCollapse: 'separate' }}
              >
                <thead>
                  <tr className="bg-[#FFB300] text-white h-[60px]">
                    <th className="px-4 py-2 rounded-l-[10px] font-semibold pl-6">
                      User Name
                    </th>
                    <th className="px-4 py-2 font-semibold">Admin Name</th>
                    <th className="px-4 py-2 font-semibold">Email ID</th>
                    <th className="px-4 py-2 font-semibold">Admin Role</th>
                    <th className="px-4 py-2 font-semibold">Last Login</th>
                    <th className="px-4 py-2 rounded-r-[10px] text-center font-semibold pr-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No admins found
                      </td>
                    </tr>
                  ) : (
                    currentAdmins.map((admin, idx) => {
                      const isEven = idx % 2 === 0;
                      const rowStyle = isEven
                        ? {
                            background: '#FFF1CF',
                            border: '1px solid #FFB300'
                          }
                        : {
                            background: '#FFFFFF',
                            border: '1px solid #FFB300'
                          };

                      return (
                        <tr
                          key={admin._id || idx}
                          className="h-[64px]"
                          style={{ ...rowStyle, borderRadius: '10px' }}
                        >
                          <td className="px-4 py-2 rounded-l-[10px] border-l border-t border-b border-[#FFB300] pl-6">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="adminSelect"
                                className="accent-black w-4 h-4 cursor-pointer"
                              />
                              <span className="font-medium text-gray-800">
                                {admin.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 border-t border-b border-[#FFB300] text-gray-800">
                            {admin.fullname}
                          </td>
                          <td className="px-4 py-2 border-t border-b border-[#FFB300] text-gray-600">
                            {admin.email}
                          </td>
                          <td className="px-4 py-2 border-t border-b border-[#FFB300]">
                            {admin.status === 'suspended' ? (
                              <div className="flex flex-col items-center">
                                <span className="bg-[#FFD9D9] border border-[#FF0000] px-3 py-0.5 rounded-full text-[10px] font-bold text-[#FF0000] uppercase tracking-tighter">
                                  Suspended
                                </span>
                                <span className="text-[9px] text-gray-500 font-medium">
                                  ({admin.adminType})
                                </span>
                              </div>
                            ) : (
                              <span className="bg-[#FFB30080] px-3 py-1 rounded-full text-xs font-semibold text-black uppercase tracking-wide">
                                {admin.adminType}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 border-t border-b border-[#FFB300]">
                            <span className="bg-[#FFC33480] px-3 py-1 rounded-full text-xs font-semibold text-black">
                              {admin.lastLogin || 'Never'}
                            </span>
                          </td>
                          <td className="px-4 py-2 rounded-r-[10px] border-r border-t border-b border-[#FFB300] pr-6">
                            <div className="flex justify-center items-center gap-4">
                              {(() => {
                                const targetRole =
                                  admin.adminType?.toLowerCase();
                                const canManage =
                                  currentUserRole === 'super admin' ||
                                  (currentUserRole === 'admin' &&
                                    targetRole === 'editor');

                                if (!canManage)
                                  return (
                                    <span className="text-gray-400 text-xs">
                                      No Actions
                                    </span>
                                  );

                                return (
                                  <>
                                    <button
                                      className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity"
                                      onClick={() => handleDeleteAdmin(admin)}
                                      title="Delete"
                                    >
                                      <img
                                        src={TrashIcon}
                                        alt="Delete"
                                        className="w-full h-full object-contain"
                                      />
                                    </button>
                                    <button
                                      className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity"
                                      onClick={() => handleEditAdmin(admin)}
                                      title="Edit"
                                    >
                                      <img
                                        src={EditIcon}
                                        alt="Edit"
                                        className="w-full h-full object-contain"
                                      />
                                    </button>
                                    <button
                                      className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity"
                                      onClick={() => handleSuspendAdmin(admin)}
                                      title="Suspend"
                                    >
                                      <img
                                        src={LockIcon}
                                        alt="Lock"
                                        className="w-full h-full object-contain"
                                      />
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Count */}
          {!loading && (
            <div className="px-6 mt-4 text-gray-600 font-medium text-sm">
              No of Users - {currentAdmins.length} out of{' '}
              {filteredAdmins.length}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex items-center justify-between mt-8 w-full max-w-[1334px]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all hover:bg-[#ffe0a0]"
              style={{
                width: '158px',
                height: '40px',
                borderRadius: '6px',
                background: '#FFF0CE',
                fontWeight: '600',
                color: '#333'
              }}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                      currentPage === pageNum
                        ? 'bg-[#FFB300] text-white'
                        : 'bg-[#FFF0CE] text-gray-700 hover:bg-[#ffe0a0]'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all hover:opacity-90"
              style={{
                width: '158px',
                height: '40px',
                borderRadius: '6px',
                background: '#FF9D00',
                border: '1px solid #FF9D00',
                fontWeight: '600',
                color: '#000'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Popups */}
      {showAddAdmin && (
        <AddAdmin
          onClose={handleCloseAddAdmin}
          onAdminAdded={() => setRefreshKey((prev) => prev + 1)}
          currentUserRole={currentUserRole}
        />
      )}

      {showDeleteAdmin && deletePopupVisible && (
        <div
          className="delete-popup-container"
          key={`delete-popup-${popupKey}`}
        >
          <DeleteAdminPopup
            adminToDelete={adminToDelete}
            onClose={handleCloseDeleteAdmin}
            onAdminDeleted={() => {
              setShowDeleteAdmin(false);
              setDeletePopupVisible(false);
              setAdminToDelete(null);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        </div>
      )}

      {showSuspendAdmin && (
        <SuspendAdminPopup
          adminToSuspend={adminToSuspend}
          onClose={handleCloseSuspendAdmin}
          onAdminSuspended={() => {
            setShowSuspendAdmin(false);
            setAdminToSuspend(null);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      )}

      {showEditAdmin && adminToEdit && (
        <EditAdminPopup
          onClose={handleCloseEditAdmin}
          onAdminEdited={() => {
            setShowEditAdmin(false);
            setAdminToEdit(null);
            setRefreshKey((prev) => prev + 1);
          }}
          adminToEdit={adminToEdit}
        />
      )}

      {showExportPopup && (
        <ExportAdminPopup onClose={handleCloseExport} data={filteredAdmins} />
      )}
    </div>
  );
};

export default AdminManagement;
