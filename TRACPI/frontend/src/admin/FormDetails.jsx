import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const FormDetails = ({ contact, onBack }) => {
    if (!contact) return null;

    const formattedDate = new Date(contact.createdAt).toLocaleDateString('en-GB') + ', ' +
        new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div className="w-full font-['Poppins']">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-black">Form Management</h1>
                <div className="flex items-center gap-6">
                    <span className="text-black font-semibold text-lg">{formattedDate}</span>
                    <button
                        onClick={onBack}
                        className="bg-[#FFA500] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#e69500] transition-colors font-medium flex items-center gap-2"
                    >
                        <FiArrowLeft /> Back
                    </button>
                </div>
            </div>

            {/* Content Form */}
            <div className="space-y-6">
                {/* Row 1: Name and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-gray-400 rounded-lg p-3">
                        <label className="block text-gray-500 text-sm mb-1">Name</label>
                        <div className="text-black font-medium text-lg">{contact.fullName}</div>
                    </div>
                    <div className="border border-gray-400 rounded-lg p-3">
                        <label className="block text-gray-500 text-sm mb-1">Contact</label>
                        <div className="text-black font-medium text-lg">{contact.contactNumber}</div>
                    </div>
                </div>

                {/* Row 2: Email and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-gray-400 rounded-lg p-3">
                        <label className="block text-gray-500 text-sm mb-1">Email</label>
                        <div className="text-black font-medium text-lg">{contact.email}</div>
                    </div>
                    <div className="border border-gray-400 rounded-lg p-3">
                        <label className="block text-gray-500 text-sm mb-1">Location</label>
                        <div className="text-black font-medium text-lg">{contact.location || 'N/A'}</div>
                    </div>
                </div>

                {/* Row 3: How Did You Hear About Us (Centered or Full Width, Screenshot shows it somewhat centered but maybe full width of a smaller container? No, it looks like a single field in the middle row or full width if limited width. Let's make it centered/smaller width like in the pic or just full width for consistency. The pic shows it smaller than the message box width? No, looking closely, the message box is wider. The "How Did You Hear" box seems to be centered and about 50% width. I will try to match that.) */}

                <div className="flex justify-center">
                    <div className="border border-gray-400 rounded-lg p-3 w-full md:w-1/2">
                        <label className="block text-gray-500 text-sm mb-1">How Did You Hear About Us?</label>
                        <div className="text-black font-medium text-lg">{contact.hearAboutUs}</div>
                    </div>
                </div>

                {/* Row 4: Message */}
                <div className="border border-gray-400 rounded-lg p-4 h-64 overflow-y-auto">
                    <label className="block text-gray-500 text-sm mb-2">Message</label>
                    <div className="text-black text-base leading-relaxed whitespace-pre-wrap">
                        {contact.message}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetails;
