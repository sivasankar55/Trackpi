import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '../assets/square-pen.png';

const EditAdminPopup = ({ onClose = () => {}, onAdminEdited, adminToEdit }) => {
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

    // Initialize form data when adminToEdit changes
    useEffect(() => {
        if (adminToEdit) {
            setFormData({
                username: adminToEdit.username || '',
                fullname: adminToEdit.fullname || '',
                email: adminToEdit.email || '',
                adminType: adminToEdit.adminType || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [adminToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.username || !formData.fullname || !formData.email || !formData.adminType) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const updateData = {
                username: formData.username,
                fullname: formData.fullname,
                email: formData.email,
                adminType: formData.adminType
            };

            // Only include password if it's provided
            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await axios.put(`http://localhost:5000/api/admin/${adminToEdit._id}`, updateData, {
                withCredentials: true
            });

            setSuccess('Admin updated successfully!');
            
            // Notify parent component
            if (onAdminEdited) {
                onAdminEdited();
            }
            
            // Close popup after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="w-[730px] h-[541px] p-[50px] rounded-[10px] border border-[#FFF1CF] text-white"
                style={{
                    background: '#FF8200',
                    boxShadow: `
                        inset 1px 1px 10px 0px rgba(255, 241, 207, 0.5),
                        4px 4px 50px 10px rgba(0, 0, 0, 0.25)
                    `,
                    backdropFilter: 'blur(100px)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Close button clicked');
                        if (onClose) {
                            onClose();
                        }
                    }}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
                >
                    ×
                </button>

                {/* Title with Icon */}
                <h2 className="text-2xl font-semibold text-center mb-[30px] flex items-center justify-center gap-2">
                    <img src={EditIcon} alt="Edit Icon" className="w-6 h-6" />
                    Edit Admin
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

                {/* Form Section */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-[30px] gap-y-[20px] text-white mx-auto"
                        style={{
                            width: '630px',
                            height: '291px',
                            opacity: 1,
                        }}
                    >
                        {/* Username */}
                        <div>
                            <label className="block mb-2 font-medium">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="@amywilliam_"
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block mb-2 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                placeholder="Amy William"
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 font-medium">Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="amywilliam32@email.com"
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Admin Type */}
                        <div>
                            <label className="block mb-2 font-medium">Admin Type</label>
                            <select 
                                name="adminType"
                                value={formData.adminType}
                                onChange={handleInputChange}
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white focus:outline-none"
                            >
                                <option value="">Select admin Type</option>
                                <option value="super">Super Admin</option>
                                <option value="moderator">Moderator</option>
                            </select>
                        </div>

                        {/* Set Password */}
                        <div>
                            <label className="block mb-2 font-medium">Set Password (Optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="amy@123456789#"
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-2 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="amy@123456789#"
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-[30px] gap-[30px] w-[630px] mx-auto">
                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Cancel button clicked');
                                if (onClose) {
                                    onClose();
                                }
                            }}
                            className="w-[300px] h-[46px] px-[122px] rounded-[5px] border border-[#FFF1CF] 
                                bg-[#FFB30033] text-white font-semibold 
                                shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] transition"
                        >
                            Cancel
                        </button>
                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[300px] h-[46px] px-[93px] rounded-[5px] 
                                border border-[#FFF1CF] bg-[#FFB300] 
                                text-white font-semibold 
                                shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] 
                                transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAdminPopup; 