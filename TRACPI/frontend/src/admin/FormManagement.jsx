import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Icons
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import ViewContactPopup from './ViewContactPopup';
import ExportFormPopup from './ExportFormPopup';

const FormManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showExportPopup, setShowExportPopup] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contact');
            setContacts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setError('Failed to load form data');
            setLoading(false);
        }
    };

    // Group contacts by Date (DD/MM/YYYY)
    const groupedContacts = contacts.reduce((acc, contact) => {
        const date = new Date(contact.createdAt).toLocaleDateString('en-GB'); // DD/MM/YYYY
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(contact);
        return acc;
    }, {});

    // Sort dates descending (newest dates first)
    const sortedDates = Object.keys(groupedContacts).sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('-'));
        const dateB = new Date(b.split('/').reverse().join('-'));
        return dateB - dateA;
    });

    const handleOpenExport = () => setShowExportPopup(true);
    const handleCloseExport = () => setShowExportPopup(false);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-white w-full p-8 font-['Poppins']">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-black">Form Management</h1>
                <button
                    onClick={handleOpenExport}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors font-semibold"
                >
                    Export
                </button>
            </div>

            {/* Content Groups */}
            <div className="space-y-8">
                {sortedDates.map(date => (
                    <div key={date}>
                        <h2 className="text-[#FF9D00] text-xl font-medium mb-4">{date}</h2>

                        <div className="border border-black rounded-xl overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-white border-b border-black text-black">
                                        <th className="px-6 py-4 font-semibold border-r border-black w-16 text-center">Sl No</th>
                                        <th className="px-6 py-4 font-semibold border-r border-black">Name</th>
                                        <th className="px-6 py-4 font-semibold border-r border-black">Email ID</th>
                                        <th className="px-6 py-4 font-semibold border-r border-black">Phone</th>
                                        <th className="px-6 py-4 font-semibold border-r border-black">Hear About Us</th>
                                        <th className="px-6 py-4 font-semibold border-r border-black text-center">Time</th>
                                        <th className="px-6 py-4 font-semibold text-center">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedContacts[date].map((contact, index) => (
                                        <tr key={contact._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 border-r border-black text-center border-t border-gray-200">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 border-r border-black border-t border-gray-200 font-medium">
                                                {contact.fullName}
                                            </td>
                                            <td className="px-6 py-4 border-r border-black border-t border-gray-200 text-sm">
                                                {contact.email}
                                            </td>
                                            <td className="px-6 py-4 border-r border-black border-t border-gray-200 text-sm">
                                                {contact.contactNumber}
                                            </td>
                                            <td className="px-6 py-4 border-r border-black border-t border-gray-200 text-sm">
                                                {contact.hearAboutUs}
                                            </td>
                                            <td className="px-6 py-4 border-r border-black border-t border-gray-200 text-center text-sm font-medium">
                                                {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </td>
                                            <td className="px-6 py-4 text-center border-t border-gray-200">
                                                <button
                                                    className="inline-flex items-center gap-2 text-[#FF9D00] font-medium hover:underline"
                                                    onClick={() => {
                                                        setSelectedContact(contact);
                                                        setShowPopup(true);
                                                    }}
                                                >
                                                    View Details <FiExternalLink />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {contacts.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">No form submissions found.</div>
                )}
            </div>

            {/* Popup */}
            {showPopup && selectedContact && (
                <ViewContactPopup
                    contact={selectedContact}
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedContact(null);
                    }}
                />
            )}

            {/* Export Popup */}
            {showExportPopup && (
                <ExportFormPopup
                    onClose={handleCloseExport}
                    data={contacts}
                />
            )}
        </div>
    );
};

export default FormManagement;
