import React, { useState } from 'react';
import axios from 'axios';

const SuspendAdminPopup = ({ onClose = () => { }, onAdminSuspended, adminToSuspend }) => {
    const [password, setPassword] = useState('');
    const [duration, setDuration] = useState(0); // 0 for indefinite
    const [isAgreed, setIsAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSuspend = async () => {
        if (!adminToSuspend) {
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
            await axios.post(`http://localhost:5000/api/admin/${adminToSuspend._id}/suspend`, {
                password,
                duration
            }, {
                withCredentials: true
            });

            setSuccess('Admin suspended successfully!');

            if (onAdminSuspended) {
                onAdminSuspended();
            }

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to suspend admin');
        } finally {
            setLoading(false);
        }
    };

    if (!adminToSuspend) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm">
            <div className="relative w-[500px] p-[40px] rounded-[15px] text-white flex flex-col items-center"
                style={{
                    background: '#FF8200',
                    border: '1px solid #FFF1CF80',
                    boxShadow: '0px 4px 50px 10px rgba(0,0,0,0.25), inset 0px 0px 15px 0px rgba(255, 241, 207, 0.4)'
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
                    <h2 className="text-[32px] font-semibold">Confirm suspend</h2>
                    <p className="text-[16px] text-center opacity-90 font-medium">
                        Are you sure you want to suspend the selected user?
                    </p>
                </div>

                {/* Duration Setting */}
                <div className="w-full flex items-center justify-between mb-4">
                    <span className="text-[18px] font-semibold">Set Duration</span>
                    <div className="flex items-center gap-2">
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="bg-[#FF9900] border border-white/20 rounded px-2 py-1 text-sm outline-none"
                        >
                            <option value={0}>Indefinite</option>
                            <option value={1}>1 Day</option>
                            <option value={7}>7 Days</option>
                            <option value={30}>30 Days</option>
                        </select>
                        <button className="bg-[#FF9900] px-3 py-1 rounded-[5px] text-[12px] font-bold border border-white/30 shadow-sm">
                            Set
                        </button>
                    </div>
                </div>

                {/* Password Input */}
                <div className="w-full mb-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full h-[45px] rounded-[8px] bg-[#FFB300] border border-white/30 text-white placeholder-white/80 px-4 focus:outline-none focus:ring-1 focus:ring-white/50"
                    />
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex items-center gap-3 mb-8 cursor-pointer self-start ml-2" onClick={() => setIsAgreed(!isAgreed)}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${isAgreed ? 'bg-[#FFB300] border-white' : 'bg-transparent border-white/50'}`}>
                        {isAgreed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[15px] font-medium leading-tight">
                        I understand this will suspend this user.
                    </span>
                </div>

                {/* Error / Success */}
                {error && <p className="text-red-200 text-xs text-center mb-4">{error}</p>}
                {success && <p className="text-green-200 text-xs text-center mb-4">{success}</p>}

                {/* Action Buttons */}
                <div className="flex gap-16 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 h-[48px] rounded-[10px] border border-[#FFF1CF] bg-[#FFB300] hover:bg-[#ffa000] text-white text-[20px] font-bold transition-all shadow-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSuspend}
                        disabled={loading || !isAgreed || !password}
                        className="flex-1 h-[48px] rounded-[10px] bg-[#E20000] hover:bg-[#c00000] text-white text-[20px] font-bold transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'suspend'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuspendAdminPopup;
