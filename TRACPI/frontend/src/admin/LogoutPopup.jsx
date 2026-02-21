import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa';

const LogoutPopup = ({ onClose, onConfirm }) => {
    const [isAgreed, setIsAgreed] = useState(false);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999] backdrop-blur-[2px]">
            <div
                className="relative bg-[#FF8D00] rounded-[15px] text-white flex flex-col p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.2)] border border-white/10 select-none animate-scaleIn overflow-hidden"
                style={{ width: '307px', height: '158px' }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2.5 right-2.5 text-white hover:opacity-80 transition-opacity"
                >
                    <MdClose size={26} />
                </button>

                {/* Title */}
                <h2 className="text-[26px] font-bold text-center mt-0 tracking-tight leading-tight">Log Out</h2>

                {/* Confirmation Text with Icon */}
                <div
                    className="flex items-center gap-2.5 mt-4 ml-1 cursor-pointer"
                    onClick={() => setIsAgreed(!isAgreed)}
                >
                    <div className="text-[#FFC100] transition-transform active:scale-90">
                        {isAgreed ? (
                            <FaCheckSquare size={20} />
                        ) : (
                            <FaRegSquare size={20} className="text-white/50" />
                        )}
                    </div>
                    <p className="text-[12px] font-medium leading-[1.2]">
                        Are you sure you want to Log out ?
                    </p>
                </div>

                {/* Yes, Log Out Button */}
                <div className="mt-auto flex justify-end">
                    <button
                        onClick={onConfirm}
                        disabled={!isAgreed}
                        className={`font-medium text-[14px] px-5 py-2 rounded-[10px] transition-all shadow-md active:scale-95 ${isAgreed
                            ? "bg-[#E20000] hover:bg-[#C00000] text-white cursor-pointer"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-50"
                            }`}
                    >
                        Log out
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LogoutPopup;
