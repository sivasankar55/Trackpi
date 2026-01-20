import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PhoneNUmber = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const { token, user, login } = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
            setError('Contact Number must be exactly 10 digits.');
            return false;
        }
        return true;
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const re = /^[0-9\b]+$/;

        // If value is not empty and not digits, ignore
        if (value !== '' && !re.test(value)) {
            return;
        }

        // Enforce max length of 10
        if (value.length > 10) {
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
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${user._id}`,
                { phoneNumber },
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
                        <div className="flex items-center h-[50px] md:h-[60px] bg-black rounded-[12px] ">
                            <span className="flex items-center gap-2 pl-2">
                                <img
                                    src="https://flagcdn.com/w40/in.png"
                                    alt="India Flag"
                                    className="w-5 h-3 md:w-6 md:h-4 object-cover"
                                />
                                <span className="text-white font-medium text-sm md:text-base">+91</span>
                            </span>
                            <input
                                type="tel"
                                placeholder="1234567890"
                                className=" border-none ml-2 md:ml-4 w-full bg-black text-white text-sm md:text-base placeholder:text-gray-500 outline-none"
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