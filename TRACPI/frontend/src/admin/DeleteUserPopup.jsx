import React, { useState } from 'react';
import axios from 'axios';

const DeleteUserPopup = ({ userToDelete, onClose, onUserDeleted }) => {
    const [isAgreed, setIsAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!isAgreed) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/users/${userToDelete._id}`, {
                withCredentials: true
            });
            onUserDeleted();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm">
            <div className="relative w-[500px] p-[40px] rounded-[20px] bg-white flex flex-col items-center">
                {/* Icon & Title */}
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="bg-[#E20000] w-10 h-10 rounded-full flex items-center justify-center relative">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                <svg className="w-4 h-4 text-[#E20000]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-[28px] font-bold text-black italic">Delete User</h2>
                </div>

                {/* Info Card */}
                <div className="w-full bg-[#FAFAFA] border border-gray-200 rounded-[15px] p-4 mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-[12px] text-gray-500 font-medium">User Name</p>
                            <p className="text-[16px] font-bold text-black line-clamp-1">{userToDelete?.name}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-[12px] text-gray-500 font-medium">Email ID</p>
                            <p className="text-[16px] font-bold text-black line-clamp-1">{userToDelete?.email}</p>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Confirmation Checkbox */}
                <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={() => setIsAgreed(!isAgreed)}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${isAgreed ? 'bg-[#FFB300] border-[#FFB300]' : 'bg-transparent border-gray-300 group-hover:border-[#FFB300]'}`}>
                        {isAgreed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[16px] font-medium text-gray-700 leading-tight">
                        I am sure that I want to delete the user permanatly
                    </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 h-[46px] rounded-[10px] border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-[18px] font-bold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!isAgreed || loading}
                        className="flex-1 h-[46px] rounded-[10px] bg-[#D00000] hover:bg-[#B00000] text-white text-[18px] font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserPopup;
