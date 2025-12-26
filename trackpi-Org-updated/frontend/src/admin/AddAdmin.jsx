import React, { useState } from 'react';
import axios from 'axios';

const AddAdmin = ({ onClose, onAdminAdded }) => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        adminType: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/admin', {
                username: formData.username,
                fullname: formData.fullname,
                email: formData.email,
                adminType: formData.adminType,
                password: formData.password
            }, {
                withCredentials: true
            });

            setSuccess('Admin added successfully!');
            setFormData({
                username: '',
                fullname: '',
                email: '',
                adminType: '',
                password: '',
                confirmPassword: ''
            });
            
            // Notify parent component
            if (onAdminAdded) {
                onAdminAdded();
            }
            
            // Close popup after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div
                className="w-[732px] h-[647px] p-[50px] rounded-[10px] border-[2px] border-[#FFB300] bg-[#FF8200]
                   shadow-[4px_4px_50px_10px_rgba(0,0,0,0.25)] backdrop-blur-[100px]
                   shadow-inner shadow-[1px_1px_10px_0px_rgba(255,241,207,0.5)] text-white relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-3xl font-semibold text-center mb-[50px] text-white">
                    Add Admin
                </h2>

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

                {/* Form Container */}
                <form onSubmit={handleSubmit}>
                    <div
                        className="w-[630px] h-[291px] grid grid-cols-2 gap-x-[30px] gap-y-[30px] mx-auto text-white"
                        style={{
                            opacity: 1,
                        }}
                    >
                        {/* Username */}
                        <div className="h-[77px]">
                            <label className="block text-lg font-semibold mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter Username"
                                required
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="h-[77px]">
                            <label className="block text-lg font-semibold mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                placeholder="Enter Fullname"
                                required
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Email ID */}
                        <div className="h-[77px]">
                            <label className="block text-lg font-semibold mb-2">Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter Email ID"
                                required
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Admin Type */}
                        <div className="h-[77px]">
                            <label className="block text-lg font-semibold mb-2">Admin Type</label>
                            <select
                                name="adminType"
                                value={formData.adminType}
                                onChange={handleInputChange}
                                required
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white focus:outline-none"
                            >
                                <option value="">Select Admin Type</option>
                                <option value="super admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>

                        {/* Set Password */}
                        <div className="h-[77px]">
                            <label className="block text-lg font-semibold mb-2">Set Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter Password"
                                required
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="h-[77px]">
                            <label className="block text-lg font-semibold mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Enter Password"
                                required
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white placeholder-white focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Cancel Button */}
                    <div className="flex justify-between mt-[40px] w-[632px] h-[46px] gap-[30px]">
                        <button
                            type="button"
                            className="w-[300px] h-[46px] px-[122px] py-[10px] rounded-[5px] border border-[#FFF1CF] bg-[#FFB30033]
                            shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] text-white font-semibold transition"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        {/* Add Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[302px] h-[46px] px-[134px] py-[10px] rounded-[5px] border border-[#8F0000] bg-[#E20000]
                            shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] text-white font-semibold transition disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdmin;