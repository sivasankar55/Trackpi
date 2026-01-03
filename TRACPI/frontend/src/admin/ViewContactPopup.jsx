import React from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiMessageSquare, FiInfo } from 'react-icons/fi';

const ViewContactPopup = ({ contact, onClose }) => {
    if (!contact) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm font-['Poppins']">
            <div
                className="relative w-[600px] max-h-[90vh] overflow-y-auto p-8 rounded-[20px] text-white flex flex-col shadow-2xl"
                style={{
                    background: '#2D1D29', // Dark background matching site theme
                    border: '1px solid #FFB300',
                    boxShadow: '0 0 20px rgba(255, 179, 0, 0.2)'
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-[#FFB300]/30 pb-4">
                    <h2 className="text-2xl font-bold text-[#FF9D00] flex items-center gap-3">
                        <FiMessageSquare /> Contact Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Primary Info Group */}
                    <div className="bg-black/20 p-6 rounded-xl border border-[#FFB300]/10 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FF9D00]/20 flex items-center justify-center text-[#FF9D00]">
                                <FiUser size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Full Name</p>
                                <p className="text-lg font-semibold">{contact.fullName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FF9D00]/10 flex items-center justify-center text-[#FF9D00]">
                                    <FiMail size={16} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-400">Email Address</p>
                                    <p className="text-sm font-medium truncate" title={contact.email}>{contact.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FF9D00]/10 flex items-center justify-center text-[#FF9D00]">
                                    <FiPhone size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Phone Details</p>
                                    <p className="text-sm font-medium">{contact.contactNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-[#FFB300]/10">
                            <div className="flex items-center gap-3 mb-2">
                                <FiMapPin className="text-[#FF9D00]" />
                                <span className="text-sm text-gray-400">Location</span>
                            </div>
                            <p className="font-medium pl-8">{contact.location || 'N/A'}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-[#FFB300]/10">
                            <div className="flex items-center gap-3 mb-2">
                                <FiInfo className="text-[#FF9D00]" />
                                <span className="text-sm text-gray-400">Source</span>
                            </div>
                            <p className="font-medium pl-8">{contact.hearAboutUs || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="bg-black/20 p-6 rounded-xl border border-[#FFB300]/10">
                        <p className="text-sm text-[#FF9D00] font-semibold mb-3">Message Content</p>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {contact.message}
                        </p>
                    </div>

                    {/* Timestamp */}
                    <div className="text-right text-xs text-gray-500">
                        Received on: {new Date(contact.createdAt).toLocaleString()}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-4 border-t border-[#FFB300]/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#FF9D00] text-white font-semibold rounded-lg hover:bg-[#e08b00] transition shadow-lg shadow-[#FF9D00]/20"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewContactPopup;
