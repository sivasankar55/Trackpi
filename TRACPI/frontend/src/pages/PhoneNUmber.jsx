import React, { useContext, useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { countries } from '../utils/countries';

const PhoneNUmber = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const { token, user, login } = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.cca2 === 'IN') || countries[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const validateForm = () => {
        if (!phoneNumber || !/^\d{7,15}$/.test(phoneNumber)) {
            setError('Please enter a valid phone number (7-15 digits).');
            return false;
        }
        return true;
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const re = /^[0-9\b]+$/;

        if (value !== '' && !re.test(value)) {
            return;
        }

        if (value.length > 15) {
            return;
        }

        setPhoneNumber(value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('');
        setLoading(true);
        const fullPhoneNumber = `${selectedCountry.phone_code}${phoneNumber}`;
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${user._id}`,
                { phoneNumber: fullPhoneNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            login(token); // re-fetch user info
            navigate('/start-course/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update phone number');
        } finally {
            setLoading(false);
        }
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.phone_code.includes(searchTerm)
    );

    return (
        <div className="w-full flex justify-center items-center min-h-screen bg-black px-4 py-8">
            <div className="w-full max-w-[747px] rounded-[30px] sm:rounded-[50px] border border-solid p-6 sm:p-[50px] space-y-6 md:space-y-10 backdrop-blur-[76px]"
                style={{
                    background: 'linear-gradient(117.87deg, #171717 -19.96%, rgba(23, 23, 23, 0.08) 96.5%)',
                    borderImage: 'linear-gradient(110.43deg, #000000 5.85%, rgba(0, 0, 0, 0.4) 94.01%) 1',
                }}>
                <h2 className="text-center text-[24px] md:text-[36px] font-semibold text-white font-['Roboto'] capitalize leading-[120%] md:leading-[100%]">
                    You’ve Signed Up with Google!
                </h2>
                <p className="text-center text-[14px] md:text-[20px] font-bold text-white font-['Roboto'] capitalize leading-[140%] md:leading-[100%]">
                    To complete your setup, please enter your phone number to activate your account.
                </p>
                <form onSubmit={handleSubmit}>
                    <fieldset className="w-full max-w-[647px] mx-auto h-auto border border-white rounded-[12px] px-3 sm:px-4 py-2">
                        <legend className="px-2 text-white font-semibold text-[14px] md:text-[16px] font-['Roboto'] text-center">
                            Phone Number
                        </legend>
                        <div className="flex items-center h-[50px] md:h-[60px] bg-black rounded-[12px] relative">
                            {/* Country Selector */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-3 focus:outline-none cursor-pointer group/btn border-r border-white/20 h-[60%] my-auto hover:bg-white/5 transition-colors rounded-l-[12px]"
                                >
                                    <svg
                                        className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} group-hover/btn:text-white/80`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <img
                                        src={selectedCountry.flag}
                                        alt={selectedCountry.name}
                                        className="w-5 h-3 md:w-6 md:h-4 object-cover rounded-sm"
                                    />
                                    <span className="text-white font-medium text-sm md:text-base">{selectedCountry.phone_code}</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-3 w-64 max-h-80 bg-[#171717] border border-white/20 rounded-xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl">
                                        <div className="p-2 border-b border-white/10 bg-black/40">
                                            <input
                                                type="text"
                                                placeholder="Search country..."
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#F38D07]"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="overflow-y-auto max-h-60 custom-scrollbar">
                                            {filteredCountries.map((country) => (
                                                <button
                                                    key={country.cca2}
                                                    type="button"
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F38D07] text-white transition-colors text-left"
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setIsDropdownOpen(false);
                                                        setSearchTerm('');
                                                    }}
                                                >
                                                    <img src={country.flag} alt="" className="w-5 h-3 object-cover rounded-sm" />
                                                    <span className="flex-1 text-sm truncate">{country.name}</span>
                                                    <span className="text-xs opacity-70">{country.phone_code}</span>
                                                </button>
                                            ))}
                                            {filteredCountries.length === 0 && (
                                                <div className="p-4 text-center text-gray-400 text-sm">No results found</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                type="tel"
                                placeholder="1234567890"
                                className="border-none ml-2 md:ml-4 w-full bg-black text-white text-sm md:text-base placeholder:text-gray-500 outline-none"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                required
                            />
                        </div>
                    </fieldset>
                    {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                    <div className="flex justify-center mt-6 md:mt-8">
                        <button
                            type="submit"
                            className="w-[120px] h-[45px] md:w-[142px] md:h-[50px] bg-[#F38D07] text-white font-['Roboto'] font-bold text-[14px] md:text-[16px] rounded-[10.91px] disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Create Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PhoneNUmber;
