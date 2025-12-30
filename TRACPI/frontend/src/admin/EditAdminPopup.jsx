import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '../assets/square-pen.png';

const EditAdminPopup = ({ onClose = () => { }, onAdminEdited, adminToEdit }) => {
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

            if (formData.password) {
                updateData.password = formData.password;
            }

            await axios.put(`http://localhost:5000/api/admin/${adminToEdit._id}`, updateData, {
                withCredentials: true
            });

            setSuccess('Admin updated successfully!');

            if (onAdminEdited) {
                onAdminEdited();
            }

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
            <div className="relative w-[730px] p-[40px] rounded-[15px] text-white"
                style={{
                    background: '#FF8200',
                    border: '1px solid #FFF1CF80',
                    boxShadow: '0px 4px 50px 10px rgba(0, 0, 0, 0.25), inset 0px 0px 15px 0px rgba(255, 241, 207, 0.4)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <img src={EditIcon} alt="Edit" className="w-6 h-6 invert brightness-0" />
                    <h2 className="text-[26px] font-semibold">Edit Admin</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                        {/* Username */}
                        <div>
                            <label className="block mb-1.5 text-[15px] font-medium">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="@amywilliam_"
                                className="w-full h-[42px] px-4 rounded-[6px] border border-[#FFF1CF80] bg-[#FFB300] text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block mb-1.5 text-[15px] font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                placeholder="Amy William"
                                className="w-full h-[42px] px-4 rounded-[6px] border border-[#FFF1CF80] bg-[#FFB300] text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1.5 text-[15px] font-medium">Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="amywilliam32@email.com"
                                className="w-full h-[42px] px-4 rounded-[6px] border border-[#FFF1CF80] bg-[#FFB300] text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
                            />
                        </div>

                        {/* Admin Type */}
                        <div>
                            <label className="block mb-1.5 text-[15px] font-medium">Admin Type</label>
                            <select
                                name="adminType"
                                value={formData.adminType}
                                onChange={handleInputChange}
                                className="w-full h-[42px] px-4 rounded-[6px] border border-[#FFF1CF80] bg-[#FFB300] text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                            >
                                <option value="" className="bg-[#FF8200]">Select admin Type</option>
                                <option value="super" className="bg-[#FF8200]">Super Admin</option>
                                <option value="moderator" className="bg-[#FF8200]">Moderator</option>
                            </select>
                        </div>

                        {/* Set Password */}
                        <div>
                            <label className="block mb-1.5 text-[15px] font-medium">Set Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="amy@123456789#"
                                className="w-full h-[42px] px-4 rounded-[6px] border border-[#FFF1CF80] bg-[#FFB300] text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-1.5 text-[15px] font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="amy@123456789#"
                                className="w-full h-[42px] px-4 rounded-[6px] border border-[#FFF1CF80] bg-[#FFB300] text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
                            />
                        </div>
                    </div>

                    {/* Messages */}
                    {error && <p className="text-red-200 text-xs text-center mt-2">{error}</p>}
                    {success && <p className="text-green-200 text-xs text-center mt-2">{success}</p>}

                    {/* Action Buttons */}
                    <div className="flex gap-6 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-[48px] rounded-[8px] border border-[#FFF1CF] bg-white/10 hover:bg-white/20 text-white font-bold transition-all shadow-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-[48px] rounded-[8px] border border-[#FFF1CF] bg-[#FFB300] hover:bg-[#ffa000] text-white font-bold transition-all shadow-lg disabled:opacity-50"
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