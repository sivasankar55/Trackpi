import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { countries } from '../utils/countries';

const AddUserPopup = ({ onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.cca2 === 'IN') || countries[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phoneNumber') {
            // Only allow numbers and limit to 15 digits
            const newValue = value.replace(/[^0-9]/g, '').slice(0, 15);
            setFormData({ ...formData, [name]: newValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.phoneNumber.length < 7) {
            setError('Phone number must be at least 7 digits');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const submissionData = {
                ...formData,
                phoneNumber: `${selectedCountry.phone_code}${formData.phoneNumber}`
            };
            await axios.post('http://localhost:5000/api/users/add', submissionData, {
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
                        <div className="flex items-center bg-[#FFB347] rounded-[10px] relative overflow-visible">
                            <div className="relative h-full" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-1.5 px-3 h-[44px] border-r border-white/20 hover:bg-white/10 transition-colors focus:outline-none rounded-l-[10px]"
                                >
                                    <svg className={`w-3 h-3 text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <img src={selectedCountry.flag} alt="" className="w-5 h-3 object-cover rounded-sm" />
                                    <span className="text-white text-sm font-medium">{selectedCountry.phone_code}</span>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 max-h-48 bg-white border border-gray-200 rounded-lg shadow-2xl z-[10000] flex flex-col overflow-hidden">
                                        <div className="p-2 bg-gray-50 border-b border-gray-200">
                                            <input
                                                type="text"
                                                placeholder="Search country..."
                                                className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded outline-none focus:border-[#FF9D00] text-black"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="overflow-y-auto custom-scrollbar">
                                            {countries.filter(c =>
                                                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                c.phone_code.includes(searchTerm)
                                            ).map((country) => (
                                                <button
                                                    key={country.cca2}
                                                    type="button"
                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-gray-800 transition-colors text-left"
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setIsDropdownOpen(false);
                                                        setSearchTerm('');
                                                    }}
                                                >
                                                    <img src={country.flag} alt="" className="w-4 h-2.5 object-cover rounded-sm" />
                                                    <span className="flex-1 text-xs truncate">{country.name}</span>
                                                    <span className="text-[10px] text-gray-500">{country.phone_code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="w-full h-[44px] px-3 bg-transparent border-none text-white placeholder-white placeholder-opacity-70 focus:outline-none font-medium"
                            />
                        </div>
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
                            className="w-[180px] h-[45px] rounded-[10px] bg-[#E20000] hover:bg-[#B00000] text-white text-[16px] font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
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
