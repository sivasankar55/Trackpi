import React, { useState } from 'react';
import axios from 'axios';

const DeleteAdminPopup = ({ onClose = () => { }, onAdminDeleted, adminToDelete }) => {
    const [password, setPassword] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDelete = async () => {
        if (!adminToDelete) {
            setError('No admin selected');
            return;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        if (!isAgreed) {
            setError('Please agree to the confirmation');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.delete(`http://localhost:5000/api/admin/${adminToDelete._id}`, {
                data: { password },
                withCredentials: true
            });

            setSuccess('Admin deleted successfully!');

            if (onAdminDeleted) {
                onAdminDeleted();
            }

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete admin');
        } finally {
            setLoading(false);
        }
    };

    if (!adminToDelete) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm">
            <div className="relative w-[500px] p-[40px] rounded-[15px] text-white flex flex-col items-center"
                style={{
                    background: '#FF8200',
                    border: '1px solid #FFF1CF80',
                    boxShadow: '0px 4px 50px 10px rgba(0,0,0,0.25), inset 0px 0px 15px 0px rgba(255,241,207,0.4)'
                }}
            >
                {/* Icon & Title */}
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="bg-[#E20000] w-10 h-10 rounded-full flex items-center justify-center relative">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-[#E20000]">
                                <span className="text-[#E20000] text-[10px] font-bold">!</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-[28px] font-semibold">Confirm Delete</h2>
                    <p className="text-[14px] text-center opacity-90">
                        Are you sure you want to delete the admin "{adminToDelete.fullname}"?
                    </p>
                </div>

                {/* Admin Info Card */}
                <div className="w-full bg-[#FF4500] border-2 border-[#8B0000] rounded-[12px] p-5 mb-8 shadow-inner shadow-black/10">
                    <p className="text-[14px] mb-1">UserName: <span className="font-semibold text-white/90">@{adminToDelete.username}</span></p>
                    <p className="text-[14px]">Email ID: <span className="font-semibold text-white/90">{adminToDelete.email}</span></p>
                </div>

                {/* Password Input */}
                <div className="w-full mb-6">
                    <label className="block text-[16px] font-medium mb-2 text-center">Enter Your Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full h-[45px] rounded-[8px] bg-[#FFB300] border border-white/30 text-white placeholder-white/60 px-4 text-center focus:outline-none focus:ring-1 focus:ring-white/50"
                    />
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => setIsAgreed(!isAgreed)}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${isAgreed ? 'bg-[#FFB300] border-white' : 'bg-transparent border-white/50'}`}>
                        {isAgreed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[13px] font-medium leading-tight">
                        I understand this will permanently delete this admin.
                    </span>
                </div>

                {/* Error / Success */}
                {error && <p className="text-red-200 text-xs text-center mb-4">{error}</p>}
                {success && <p className="text-green-200 text-xs text-center mb-4">{success}</p>}

                {/* Action Buttons */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 h-[48px] rounded-[10px] border border-[#FFF1CF] bg-[#FFB30033] hover:bg-white/10 text-white font-bold transition-all shadow-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading || !isAgreed || !password}
                        className="flex-1 h-[48px] rounded-[10px] bg-[#D00000] hover:bg-[#B00000] text-white font-bold transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAdminPopup;
