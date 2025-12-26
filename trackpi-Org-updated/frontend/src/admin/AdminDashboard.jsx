import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from '../context/AdminAuthContext';

import AdminManagement from './AdminManagement';
import AddAdmin from './AddAdmin';
import DeleteAdminPopup from './DeleteAdminPopup';
import EditAdminPopup from './EditAdminPopup';
import PlusIcon from '../assets/plus.png';
import TrashIcon from '../assets/trash.png';
import LockIcon from '../assets/lock.png';
import BellIcon from '../assets/bell.png';
import UserIcon from '../assets/user.png';
import DashboardIcon from '../assets/dashboard.png';
import SearchIcon from '../assets/search2.png';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout, adminInfo } = useContext(AdminAuthContext);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [showDeleteAdmin, setShowDeleteAdmin] = useState(false);
    const [showEditAdmin, setShowEditAdmin] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [adminToEdit, setAdminToEdit] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [popupKey, setPopupKey] = useState(0);
    const forceUpdateRef = useRef(0);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    
    // Monitor state changes and force DOM updates
    useEffect(() => {
        if (!showDeleteAdmin && !deletePopupVisible) {
            // Clean up any remaining popup elements safely
            setTimeout(() => {
                const popupElements = document.querySelectorAll('.delete-popup-container, .fixed.inset-0');
                popupElements.forEach(element => {
                    if (element && element.parentNode) {
                        element.remove();
                        console.log('Cleanup: removed popup element');
                    }
                });
            }, 100);
        }
    }, [showDeleteAdmin, deletePopupVisible]);
    
    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const handleAddAdmin = () => {
        setShowAddAdmin(true);
    };

    const handleCloseAddAdmin = () => {
        setShowAddAdmin(false);
    };

    const handleEditAdmin = (admin) => {
        setAdminToEdit(admin);
        setShowEditAdmin(true);
    };

    const handleCloseEditAdmin = () => {
        setShowEditAdmin(false);
        setAdminToEdit(null);
    };

    const handleDeleteAdmin = () => {
        setShowDeleteAdmin(true);
        setDeletePopupVisible(true);
    };

    const handleCloseDeleteAdmin = () => {
        console.log('handleCloseDeleteAdmin called, current showDeleteAdmin:', showDeleteAdmin);
        
        // Update React state FIRST to prevent React errors
        setShowDeleteAdmin(false);
        setDeletePopupVisible(false);
        setSelectedAdmin(null);
        
        // Force a complete re-render
        setPopupKey(prev => prev + 1);
        
        // Then safely remove from DOM after React state update
        setTimeout(() => {
            const allPopups = document.querySelectorAll('.fixed.inset-0, .delete-popup-container');
            allPopups.forEach(element => {
                if (element && element.parentNode) {
                    element.remove();
                    console.log('Safe DOM removal applied');
                }
            });
        }, 50);
        
        console.log('setShowDeleteAdmin(false) called');
    };
    
    return (
        <div className="min-h-screen bg-white">
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center px-6 py-4 shadow-md">

                <div className="flex items-center gap-2">
                    <img
                        src={DashboardIcon}
                        alt="Dashboard Icon"
                        className="w-6 h-6 object-contain"
                    />
                    <span className="font-bold text-xl text-black">Dashboard</span>

                    <div className="flex items-center border border-gray-400 px-3 py-1 rounded ml-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="outline-none text-sm placeholder-gray-600 text-black bg-white"
                        />
                        <img
                            src={SearchIcon}
                            alt="Search Icon"
                            className="w-4 h-4 mr-2"
                        />

                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Grouped Buttons */}
                    <div className="flex gap-3 bg-[#FFF0CE] rounded-[1rem] border-2 border-[#FFB300] px-4 py-2">
                        <button onClick={handleAddAdmin}>
                            <img src={PlusIcon} alt="Plus" className="w-5 h-5" />
                        </button>
                        <button
                            className="w-5 h-5"
                            onClick={handleDeleteAdmin}>
                            <img src={TrashIcon} alt="Delete" className="w-full h-full object-contain" />
                        </button>
                        <button>
                            <img src={LockIcon} alt="Lock" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Separate Buttons */}
                    <button className="bg-[#FFF0CE] rounded-[1rem] border-2 border-[#FFB300] p-2">
                        <img src={BellIcon} alt="Notification" className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="bg-[#FFF0CE] rounded-full border-2 border-[#FFB300] p-2 hover:bg-yellow-100 transition-colors"
                        title="Logout"
                    >
                        <img src={UserIcon} alt="Profile" className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* Admin Table Section */}
            <AdminManagement 
                key={refreshKey} 
                onEditAdmin={handleEditAdmin}
            />

            {/* Add Admin Popup */}
            {showAddAdmin && (
                <AddAdmin onClose={handleCloseAddAdmin} onAdminAdded={() => {
                    // Refresh the admin list
                    setRefreshKey(prev => prev + 1);
                }} />
            )}

            {/* Delete Admin Popup */}
            {console.log('Render check - showDeleteAdmin:', showDeleteAdmin, 'deletePopupVisible:', deletePopupVisible)}
            {showDeleteAdmin && deletePopupVisible ? (
                <div className="delete-popup-container" key={`delete-popup-${popupKey}`}>
                    {console.log('Rendering DeleteAdminPopup, showDeleteAdmin:', showDeleteAdmin)}
                    <DeleteAdminPopup 
                        onClose={handleCloseDeleteAdmin}
                        onAdminDeleted={() => {
                            console.log('Admin deleted, refreshing...');
                            // Close the popup and refresh the admin list
                            setShowDeleteAdmin(false);
                            setDeletePopupVisible(false);
                            setSelectedAdmin(null);
                            // Force a re-render of AdminManagement
                            setRefreshKey(prev => prev + 1);
                        }}
                    />
                </div>
            ) : null}

            {/* Edit Admin Popup */}
            {showEditAdmin && adminToEdit && (
                <EditAdminPopup 
                    onClose={handleCloseEditAdmin}
                    onAdminEdited={() => {
                        console.log('Admin edited, refreshing...');
                        // Close the popup and refresh the admin list
                        setShowEditAdmin(false);
                        setAdminToEdit(null);
                        // Force a re-render of AdminManagement
                        setRefreshKey(prev => prev + 1);
                    }}
                    adminToEdit={adminToEdit}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
