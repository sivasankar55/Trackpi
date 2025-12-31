import React, { useState } from 'react';
import axios from 'axios';

const AddUserPopup = ({ onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/users/add', formData, {
                withCredentials: true
            });
            onUserAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm">
            <div className="relative w-[400px] h-auto p-8 rounded-[20px] bg-[#FF8C00] flex flex-col items-center shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-[28px] font-bold text-white mb-8">Add User</h2>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-semibold ml-1">User name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter username"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full h-[44px] px-4 rounded-[10px] bg-[#FFB347] border-none text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-semibold ml-1">Phone</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full h-[44px] px-4 rounded-[10px] bg-[#FFB347] border-none text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-semibold ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full h-[44px] px-4 rounded-[10px] bg-[#FFB347] border-none text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all font-medium"
                        />
                    </div>

                    {error && <p className="text-white text-xs text-center font-bold bg-red-500 bg-opacity-30 py-2 rounded-lg">{error}</p>}

                    <div className="mt-4 flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[180px] h-[44px] rounded-[10px] bg-[#E20000] hover:bg-[#B00000] text-white text-[16px] font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserPopup;
