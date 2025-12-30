import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportAdminPopup = ({ onClose, data }) => {
    const [exportFormat, setExportFormat] = useState('CSV');
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

    const exportToCSV = (adminData) => {
        if (!adminData || adminData.length === 0) return;

        // Define headers
        const headers = ['Username', 'Full Name', 'Email', 'Admin Type', 'Status', 'Last Login'];

        // Map data to rows
        const rows = adminData.map(admin => [
            admin.username,
            admin.fullname,
            admin.email,
            admin.adminType,
            admin.status || 'active',
            admin.lastLogin || 'Never'
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
        link.setAttribute('download', `Admins_Export_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = (adminData) => {
        if (!adminData || adminData.length === 0) return;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Admin Management Report', 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);

        // Add date
        const date = new Date().toLocaleDateString();
        doc.text(`Generated on: ${date}`, 14, 30);

        // Define headers
        const headers = [['Username', 'Full Name', 'Email', 'Admin Type', 'Status', 'Last Login']];

        // Map data to rows
        const rows = adminData.map(admin => [
            admin.username || '',
            admin.fullname || '',
            admin.email || '',
            admin.adminType || '',
            admin.status || 'Active',
            admin.lastLogin || 'Never'
        ]);

        // Generate table
        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 40,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [255, 130, 0] }, // Matching #FF8200
        });

        // Save PDF
        doc.save(`Admins_Export_${date}.pdf`);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] backdrop-blur-sm">
            <div className="relative w-[500px] p-[40px] rounded-[20px] text-white flex flex-col items-center"
                style={{
                    background: '#FF8200',
                    boxShadow: '0px 4px 50px 10px rgba(0,0,0,0.25)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-[32px] font-bold mb-8">Export Data</h2>

                {/* Export Format Selection */}
                <div className="flex items-center gap-8 mb-8">
                    <span className="text-[20px] font-medium">Export in</span>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="format"
                                value="CSV"
                                checked={exportFormat === 'CSV'}
                                onChange={() => setExportFormat('CSV')}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all ${exportFormat === 'CSV' ? 'bg-[#FFB300]' : 'bg-transparent'}`}>
                                {exportFormat === 'CSV' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                            </div>
                        </div>
                        <span className="text-[18px]">CSV</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="format"
                                value="PDF"
                                checked={exportFormat === 'PDF'}
                                onChange={() => setExportFormat('PDF')}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all ${exportFormat === 'PDF' ? 'bg-[#FFB300]' : 'bg-transparent'}`}>
                                {exportFormat === 'PDF' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                            </div>
                        </div>
                        <span className="text-[18px]">PDF</span>
                    </label>
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex items-center gap-3 mb-10 cursor-pointer self-start ml-2" onClick={() => setIsAgreed(!isAgreed)}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${isAgreed ? 'bg-[#FFB300] border-white' : 'bg-transparent border-white/50'}`}>
                        {isAgreed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[18px] font-medium leading-tight">
                        Are you sure you want to export ?
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-10 w-full justify-end">
                    <button
                        onClick={onClose}
                        className="w-[120px] h-[46px] rounded-[10px] border border-white bg-transparent hover:bg-white/10 text-white text-[18px] font-bold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={!isAgreed}
                        className="w-[140px] h-[46px] rounded-[10px] bg-[#D00000] hover:bg-[#B00000] text-white text-[18px] font-bold transition-all shadow-lg disabled:opacity-50"
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportAdminPopup;
