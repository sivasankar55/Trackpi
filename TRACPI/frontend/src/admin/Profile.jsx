import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import ProfileIllustration from '../assets/profile.png';
import { FaUserCircle, FaEdit, FaCamera } from 'react-icons/fa';
import ImageCropperPopup from './ImageCropperPopup';
import LogoutPopup from './LogoutPopup';
import { toast } from 'react-toastify';

const Profile = () => {
    const { adminInfo, logout, updateAdminInfo } = useContext(AdminAuthContext);
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [profilePic, setProfilePic] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/profile', {
                    withCredentials: true
                });
                const data = response.data;
                setFormData({
                    username: data.username || '',
                    fullname: data.fullname || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                    password: '',
                    confirmPassword: ''
                });
                if (data.profilePicture) {
                    setProfilePic(`http://localhost:5000${data.profilePicture}`);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                // Fallback to context if API fails
                if (adminInfo) {
                    setFormData(prev => ({
                        ...prev,
                        username: adminInfo.username || '',
                        fullname: adminInfo.fullname || '',
                        email: adminInfo.email || '',
                        phoneNumber: adminInfo.phoneNumber || ''
                    }));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [adminInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (croppedBlob) => {
        setShowCropper(false);
        const formData = new FormData();
        formData.append('profilePicture', croppedBlob);

        try {
            const response = await axios.put('http://localhost:5000/api/admin/profile/picture', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfilePic(`http://localhost:5000${response.data.profilePicture}`);
            updateAdminInfo({ profilePicture: response.data.profilePicture });
            toast.success('Profile picture updated!');
        } catch (err) {
            console.error('Error uploading image:', err);
            toast.error(err.response?.data?.error || 'Failed to upload image');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setSaving(true);

        try {
            await axios.put('http://localhost:5000/api/admin/profile', formData, {
                withCredentials: true
            });
            updateAdminInfo(formData);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9D00]"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white min-h-screen p-8 font-['Poppins']">
            <div className="max-w-[1100px] mx-auto space-y-6">

                {/* My Profile Header */}
                <div className="bg-[#FFF8E7] rounded-[15px] p-4 flex items-center border border-[#FFB30020]">
                    <h2 className="text-[20px] font-bold text-[#333]">My Profile</h2>
                </div>

                {/* Hero section */}
                <div className="bg-[#FFF8E7] rounded-[20px] p-8 relative flex items-center justify-between border border-[#FFB30040] min-h-[220px] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="flex items-center gap-10 z-10">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full bg-[#E5F1FF] flex items-center justify-center text-[#0089FF] border-2 border-white shadow-md overflow-hidden transition-all group-hover:opacity-90">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUserCircle size={112} className="opacity-80" />
                                )}
                                <div
                                    onClick={() => document.getElementById('profile-pic-input').click()}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <FaCamera size={24} className="text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                id="profile-pic-input"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <button
                                onClick={() => document.getElementById('profile-pic-input').click()}
                                className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-gray-100 hover:scale-110 transition-transform z-20"
                            >
                                <FaEdit size={14} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-[24px] font-bold text-[#333]">User Name - <span className="text-[#00602F]">{formData.username}</span></h3>
                            <p className="text-[20px] font-bold text-[#333]">Name - <span className="text-[#00602F]">{formData.fullname}</span></p>
                        </div>
                    </div>

                    {/* Illustration - Floating on the right */}
                    <img
                        src={ProfileIllustration}
                        alt="Illustration"
                        className="absolute right-[-20px] top-[-10px] h-[240px] object-contain opacity-90 select-none pointer-events-none"
                    />
                </div>

                {/* Form Section */}
                <div className="bg-[#FFF8E7] rounded-[20px] p-12 border border-[#FFB30040] shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
                    <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-x-16 gap-y-10">
                        {/* Username */}
                        <div className="space-y-3">
                            <label className="text-[17px] font-bold text-[#333] ml-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter your username"
                                className="w-full h-[55px] px-6 rounded-[15px] bg-[#B05B00] text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FF9D00] font-bold text-[16px] shadow-inner"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="space-y-3">
                            <label className="text-[17px] font-bold text-[#333] ml-1">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                className="w-full h-[55px] px-6 rounded-[15px] bg-[#B05B00] text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FF9D00] font-bold text-[16px] shadow-inner"
                            />
                        </div>

                        {/* Email ID */}
                        <div className="space-y-3">
                            <label className="text-[17px] font-bold text-[#333] ml-1">Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your Email ID"
                                className="w-full h-[55px] px-6 rounded-[15px] bg-[#B05B00] text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FF9D00] font-bold text-[16px] shadow-inner"
                            />
                        </div>

                        {/* Phone number */}
                        <div className="space-y-3">
                            <label className="text-[17px] font-bold text-[#333] ml-1">Phone number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                className="w-full h-[55px] px-6 rounded-[15px] bg-[#B05B00] text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FF9D00] font-bold text-[16px] shadow-inner"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <label className="text-[17px] font-bold text-[#333] ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className="w-full h-[55px] px-6 rounded-[15px] bg-[#B05B00] text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FF9D00] font-bold text-[16px] shadow-inner"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-3">
                            <label className="text-[17px] font-bold text-[#333] ml-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className="w-full h-[55px] px-6 rounded-[15px] bg-[#B05B00] text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#FF9D00] font-bold text-[16px] shadow-inner"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="col-span-2 flex justify-center gap-8 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowLogoutPopup(true)}
                                className="w-[140px] h-[50px] rounded-[12px] bg-[#E20000] text-white font-bold text-[15px] hover:bg-red-700 transition-all shadow-lg active:scale-95"
                            >
                                Log out
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-[140px] h-[50px] rounded-[12px] bg-[#FF9D00] text-white font-bold text-[15px] hover:bg-[#E58D00] transition-all shadow-lg active:scale-95"
                            >
                                {saving ? 'Updating...' : 'Confirm'}
                            </button>
                        </div>
                    </form>

                </div>

                {showCropper && (
                    <ImageCropperPopup
                        image={selectedImage}
                        onCropComplete={handleCropComplete}
                        onCancel={() => setShowCropper(false)}
                    />
                )}

                {showLogoutPopup && (
                    <LogoutPopup
                        onClose={() => setShowLogoutPopup(false)}
                        onConfirm={logout}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
