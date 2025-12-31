import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

const ExportUserPopup = ({ onClose, data }) => {
    const [exportFormat, setExportFormat] = useState('PDF');
    const [isAgreed, setIsAgreed] = useState(false);

    const handleExport = () => {
        if (!isAgreed) return;

        if (exportFormat === 'CSV') {
            exportToCSV(data);
        } else {
            exportToPDF(data);
        }
        onClose();
    };

    const exportToCSV = (userData) => {
        if (!userData || userData.length === 0) return;

        // Define headers
        const headers = ['Name', 'User Name', 'Email ID', 'Phone Number', 'Joined', 'Courses Enrolled', 'Status'];

        // Map data to rows
        const rows = userData.map(user => [
            user.name,
            `@${user.email?.split('@')[0]}`,
            user.email,
            user.phoneNumber || '',
            dayjs(user.createdAt).format('D/M/YYYY'),
            user.enrollmentCount || 0,
            user.status || 'active'
        ]);

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Users_Export_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = (userData) => {
        if (!userData || userData.length === 0) return;

        const doc = new jsPDF('landscape');

        // Add title
        doc.setFontSize(22);
        doc.setTextColor(255, 130, 0); // Orange color
        doc.text('User Management Report', 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(100);

        // Add date
        const date = new Date().toLocaleDateString();
        doc.text(`Generated on: ${date}`, 14, 28);

        // Define headers
        const headers = [['Name', 'User Name', 'Email ID', 'Phone Number', 'Joined', 'Courses Enrolled', 'Status']];

        // Map data to rows
        const rows = userData.map(user => [
            user.name || '',
            `@${user.email?.split('@')[0]}` || '',
            user.email || '',
            user.phoneNumber || '',
            dayjs(user.createdAt).format('D/M/YYYY'),
            String(user.enrollmentCount || 0),
            user.status?.toUpperCase() || 'ACTIVE'
        ]);

        // Generate table
        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 35,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: {
                fillColor: [255, 130, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: { fillColor: [255, 248, 231] },
        });

        // Save PDF
        doc.save(`Users_Export_${date}.pdf`);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm">
            <div className="relative w-[500px] h-auto p-[40px] rounded-[24px] text-white flex flex-col items-center"
                style={{
                    background: '#FF8C00',
                    boxShadow: '0px 10px 40px rgba(0,0,0,0.3)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white hover:opacity-70 transition-all hover:scale-110"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-[32px] font-bold mb-8 tracking-tight">Export Data</h2>

                {/* Export Format Selection */}
                <div className="flex items-center gap-8 mb-8">
                    <span className="text-[20px] font-semibold opacity-90">Export in</span>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="format"
                                value="CSV"
                                checked={exportFormat === 'CSV'}
                                onChange={() => setExportFormat('CSV')}
                                className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all ${exportFormat === 'CSV' ? 'bg-[#FFB300]' : 'bg-transparent'}`}>
                                {exportFormat === 'CSV' && <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>}
                            </div>
                        </div>
                        <span className="text-[18px] font-medium">CSV</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="format"
                                value="PDF"
                                checked={exportFormat === 'PDF'}
                                onChange={() => setExportFormat('PDF')}
                                className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all ${exportFormat === 'PDF' ? 'bg-[#FFB300]' : 'bg-transparent'}`}>
                                {exportFormat === 'PDF' && <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>}
                            </div>
                        </div>
                        <span className="text-[18px] font-medium">PDF</span>
                    </label>
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex items-center gap-4 mb-10 cursor-pointer self-start ml-2 group" onClick={() => setIsAgreed(!isAgreed)}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-300 ${isAgreed ? 'bg-[#FFB300] border-white' : 'bg-transparent border-white/50 group-hover:border-white'}`}>
                        {isAgreed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[18px] font-medium leading-tight opacity-90 select-none">
                        Are you sure you want to export ?
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-8 h-[46px] rounded-[12px] border-2 border-white bg-transparent hover:bg-white/10 text-white text-[16px] font-bold transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={!isAgreed}
                        className="px-10 h-[46px] rounded-[12px] bg-[#E20000] hover:bg-[#B00000] text-white text-[16px] font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportUserPopup;
