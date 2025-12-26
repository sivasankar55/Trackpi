import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteAdminPopup = ({ onClose = () => {}, onAdminDeleted }) => {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Fetch admins on component mount
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin', {
                    withCredentials: true
                });
                setAdmins(response.data || []);
            } catch (err) {
                setError('Failed to load admin data');
            }
        };
        fetchAdmins();
    }, []);

    const handleDelete = async () => {
        if (!selectedAdmin) {
            setError('Please select an admin to delete');
            return;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        if (!confirmDelete) {
            setError('Please confirm the deletion');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.delete(`http://localhost:5000/api/admin/${selectedAdmin._id}`, {
                data: { password },
                withCredentials: true
            });

            setSuccess('Admin deleted successfully!');
            
            // Notify parent component
            if (onAdminDeleted) {
                onAdminDeleted();
            }
            
            // Close popup after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="w-[608px] h-[563px] p-[50px] rounded-[10px] border border-[#FFB300] bg-[#FF8200]
             shadow-[4px_4px_50px_10px_rgba(0,0,0,0.25)] backdrop-blur-[100px] 
             shadow-inner shadow-[1px_1px_10px_0px_rgba(255,241,207,0.5)] text-white
             flex flex-col items-center justify-center gap-[30px] relative"
            >

                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Close button clicked');
                        
                        // Just call onClose - let React handle the cleanup
                        if (onClose) {
                            onClose();
                        } else {
                            console.log('onClose is not defined');
                        }
                    }}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
                >
                    ×
                </button>

                {/* Header */}
                <div
                    className="text-center mx-auto"
                    style={{
                        width: '508px',
                        height: '92px',
                        opacity: 1,
                    }}
                >
                    <div className="text-3xl font-semibold flex items-center justify-center gap-2 mb-2">
                        <span role="img" aria-label="alert">🔴</span>
                        Delete Admin
                    </div>
                    <p className="text-white text-base leading-tight">
                        Select an admin to delete and confirm the action
                    </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded text-green-300 text-sm">
                        {success}
                    </div>
                )}

                {/* Admin Selection */}
                <div className="w-full">
                    <label className="block text-lg font-semibold mb-2 text-center">
                        Select Admin to Delete
                    </label>
                    <select
                        value={selectedAdmin?._id || ''}
                        onChange={(e) => {
                            const admin = admins.find(a => a._id === e.target.value);
                            setSelectedAdmin(admin);
                        }}
                        className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white focus:outline-none"
                    >
                        <option value="">Select an admin...</option>
                        {admins.map((admin) => (
                            <option key={admin._id} value={admin._id}>
                                {admin.fullname} ({admin.username})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Highlighted User Info */}
                {selectedAdmin && (
                    <div
                        className="text-white text-[16px] leading-7"
                        style={{
                            width: '360px',
                            height: '92px',
                            gap: '10px',
                            opacity: 1,
                            borderRadius: '10px',
                            border: '2px solid #8F0000',
                            padding: '10px 30px',
                            background: '#FF000080',
                            backdropFilter: 'blur(100px)',
                            boxShadow: 'inset 4px 4px 10px 0px #FFA6A640',
                        }}
                    >
                        <p>UserName: <strong>{selectedAdmin.username}</strong></p>
                        <p>Email ID: <strong>{selectedAdmin.email}</strong></p>
                        <p>Admin Type: <strong>{selectedAdmin.adminType}</strong></p>
                    </div>
                )}

                {/* Password Input */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div
                        style={{
                            width: '300px',
                            height: '77px',
                            gap: '10px',
                            opacity: 1,
                        }}
                    >
                        <label className="block text-lg font-semibold mb-2 text-center">
                            Enter Your Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-[300px] h-[37px] rounded-[5px] border border-[#FFF1CF80] 
                            bg-[#FFB30080] text-white placeholder-white focus:outline-none 
                            px-[15px] pr-[169px] py-[8px]"
                        />
                    </div>
                </form>

                {/* Confirmation Checkbox */}
                <div className="w-[508px] h-[36px] flex items-center gap-[10px] opacity-100">
                    <input
                        type="checkbox"
                        id="confirmDelete"
                        checked={confirmDelete}
                        onChange={(e) => setConfirmDelete(e.target.checked)}
                        className="w-5 h-5 accent-[#FFB300]"
                    />
                    <label htmlFor="confirmDelete" className="text-lg text-white">
                        I understand this will permanently delete this admin.
                    </label>
                </div>

                {/* Buttons */}
                <div className="w-[411px] h-[46px] flex justify-between items-center gap-[131px] mt-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Cancel button clicked');
                            
                            // Just call onClose - let React handle the cleanup
                            if (onClose) {
                                onClose();
                            } else {
                                console.log('onClose is not defined');
                            }
                        }}
                        className="w-[140px] h-[46px] px-[35px] py-[5px] rounded-[5px] 
                        border border-[#FFF1CF] bg-[#FFB30080] text-white font-semibold 
                       shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] transition" >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading || !selectedAdmin || !password || !confirmDelete}
                        className="w-[140px] h-[46px] px-[35px] rounded-[5px] 
                        border border-[#8F0000] bg-[#E20000] text-white font-semibold 
                        shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] transition disabled:opacity-50" >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAdminPopup;
