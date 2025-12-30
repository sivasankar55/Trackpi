import React, { useState } from 'react';
import axios from 'axios';

const SuspendUserPopup = ({ userToSuspend, onClose, onUserSuspended }) => {
    const [duration, setDuration] = useState(0); // 0 for Indefinite
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSuspend = async () => {
        setLoading(true);
        try {
            await axios.post(`http://localhost:5000/api/users/${userToSuspend._id}/suspend`, {
                duration: duration
            }, {
                withCredentials: true
            });
            onUserSuspended();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to suspend user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm">
            <div className="relative w-[500px] p-[40px] rounded-[20px] bg-white flex flex-col items-center">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Icon & Title */}
                <div className="flex flex-col items-center gap-4 mb-8 text-center">
                    <div className="w-[60px] h-[60px] bg-[#FFF8E7] rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-8 h-8 text-[#FFB300]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-[28px] font-bold text-black italic">Suspend User</h2>
                    <p className="text-gray-500 text-sm">Temporarily disable access for this user</p>
                </div>

                {/* Duration Selection */}
                <div className="w-full mb-8">
                    <p className="text-gray-700 font-bold mb-4">Suspension duration</p>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Indefinite', value: 0 },
                            { label: '3 Days', value: 3 },
                            { label: '7 Days', value: 7 },
                            { label: '30 Days', value: 30 }
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setDuration(opt.value)}
                                className={`h-[50px] rounded-[12px] font-bold transition-all border-2 ${duration === opt.value
                                        ? 'bg-[#FFB300] border-[#FFB300] text-white'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-[#FFB30040]'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Buttons */}
                <div className="flex gap-4 w-full mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 h-[46px] rounded-[10px] border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-[18px] font-bold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSuspend}
                        disabled={loading}
                        className="flex-1 h-[46px] rounded-[10px] bg-[#FFB300] hover:bg-[#E6A100] text-white text-[18px] font-bold transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Suspending...' : 'Suspend'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuspendUserPopup;
