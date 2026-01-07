import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [isExportConfirmed, setIsExportConfirmed] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/feedback', {
        withCredentials: true
      });
      setFeedbacks(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredFeedbacks = feedbacks.filter(item => {
    const userName = item.user ? (item.user.name || item.user.username || '') : (item.username || '');
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase());

    const avgRating = Math.round((item.quality + item.smoothness + item.clarity) / 3);
    const matchesRating = !ratingFilter || avgRating === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // Sort logic
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedFeedbacks.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFeedbacks = sortedFeedbacks.slice(indexOfFirst, indexOfLast);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 text-[#FFB300]">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} size={14} className={i < rating ? 'text-[#FFB300]' : 'text-gray-300'} />
        ))}
      </div>
    );
  };

  const handleExport = () => {
    if (!isExportConfirmed) {
      toast.error('Please confirm export');
      return;
    }

    const dataToExport = sortedFeedbacks.map(item => ({
      Username: item.user ? (item.user.name || item.user.username || 'user') : (item.username || 'user'),
      Quality: item.quality,
      Smoothness: item.smoothness,
      Clarity: item.clarity,
      Experience: item.experience || 'No experience provided'
    }));

    if (exportFormat === 'CSV') {
      try {
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Feedback");
        XLSX.writeFile(wb, "Feedback_Data.csv");
        toast.success("CSV exported successfully!");
      } catch (err) {
        console.error("CSV Export error:", err);
        toast.error("Failed to export CSV");
      }
    } else {
      try {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("User Feedback Report", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // Use the imported autoTable function directly to avoid "doc.autoTable is not a function"
        autoTable(doc, {
          startY: 35,
          head: [['Username', 'Quality', 'Smoothness', 'Clarity', 'Experience']],
          body: dataToExport.map(row => [
            row.Username,
            `${row.Quality} Stars`,
            `${row.Smoothness} Stars`,
            `${row.Clarity} Stars`,
            row.Experience
          ]),
          headStyles: { fillColor: [255, 179, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [255, 249, 225] },
          styles: { fontSize: 9, cellPadding: 5 },
          margin: { top: 35 }
        });

        doc.save("Feedback_Report.pdf");
        toast.success("PDF exported successfully!");
      } catch (pdfErr) {
        console.error("PDF Export error:", pdfErr);
        toast.error("Failed to generate PDF. Please try again.");
      }
    }

    setShowExportPopup(false);
  };

  return (
    <div className="w-full font-['Poppins'] min-h-screen bg-white">
      {/* Page Content */}
      <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">

        <div className="border border-[#FFB30080] rounded-[20px] sm:rounded-[30px] bg-white p-4 sm:p-8 shadow-[0px_4px_30px_rgba(0,0,0,0.02)] min-h-[600px] sm:min-h-[750px] flex flex-col relative">

          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div className="relative w-full sm:w-[350px]">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-6 pr-12 py-3 rounded-[15px] border border-[#FFB300] focus:outline-none bg-white text-sm text-gray-700 placeholder-gray-400"
              />
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-wrap justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`bg-white border ${showFilterDropdown ? 'border-[#FFB300] ring-2 ring-[#FFB30020]' : 'border-gray-200'} text-gray-600 px-6 py-2.5 rounded-[12px] text-[14px] font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2`}
                >
                  <svg className={`w-4 h-4 ${showFilterDropdown ? 'text-[#FFB300]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter {ratingFilter && <span className="bg-[#FFB300] text-white text-[10px] px-2 py-0.5 rounded-full">{ratingFilter}★</span>}
                </button>

                {showFilterDropdown && (
                  <>
                    {/* Backdrop to close on click outside (optional but simple) */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)}></div>

                    <div className="absolute top-full mt-3 right-0 w-[220px] bg-white border border-gray-100 rounded-[18px] shadow-[0px_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Arrow */}
                      <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45"></div>

                      <div className="px-5 py-2 border-b border-gray-50 mb-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Filter by Rating</span>
                      </div>

                      <button
                        onClick={() => { setRatingFilter(null); setShowFilterDropdown(false); setCurrentPage(1); }}
                        className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-[#FFF9E1] transition-all flex items-center justify-between group ${!ratingFilter ? 'text-[#FFB300] bg-[#FFF9E1/30] font-bold' : 'text-gray-600'}`}
                      >
                        <span>All Feedbacks</span>
                        {!ratingFilter && <div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></div>}
                      </button>

                      {[5, 4, 3, 2, 1].map((star) => (
                        <button
                          key={star}
                          onClick={() => { setRatingFilter(star); setShowFilterDropdown(false); setCurrentPage(1); }}
                          className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-[#FFF9E1] transition-all flex items-center justify-between group ${ratingFilter === star ? 'text-[#FFB300] bg-[#FFF9E1/30] font-bold' : 'text-gray-600'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex text-[#FFB300]">
                              {[...Array(star)].map((_, i) => <FaStar key={i} size={12} className="drop-shadow-sm" />)}
                            </div>
                            <span>{star} Star{star > 1 ? 's' : ''}</span>
                          </div>
                          {ratingFilter === star && <div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></div>}
                        </button>
                      ))}

                      <div className="mt-2 pt-2 border-t border-gray-50 px-5">
                        <button
                          onClick={() => { setRatingFilter(null); setShowFilterDropdown(false); }}
                          className="text-[12px] font-semibold text-red-500 hover:text-red-600 underline-offset-4 hover:underline"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={`bg-white border ${showSortDropdown ? 'border-[#FFB300] ring-2 ring-[#FFB30020]' : 'border-gray-200'} text-gray-600 px-8 py-2.5 rounded-[12px] text-[14px] font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2`}
                >
                  <svg className={`w-4 h-4 ${showSortDropdown ? 'text-[#FFB300]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Sort: <span className="text-[#FFB300] capitalize">{sortOrder}</span>
                </button>

                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)}></div>
                    <div className="absolute top-full mt-3 right-0 w-[180px] bg-white border border-gray-100 rounded-[18px] shadow-[0px_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45"></div>

                      <div className="px-5 py-2 border-b border-gray-50 mb-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Sort Order</span>
                      </div>

                      <button
                        onClick={() => { setSortOrder('newest'); setShowSortDropdown(false); }}
                        className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-[#FFF9E1] transition-all flex items-center justify-between group ${sortOrder === 'newest' ? 'text-[#FFB300] bg-[#FFF9E1/30] font-bold' : 'text-gray-600'}`}
                      >
                        <span>Newest First</span>
                        {sortOrder === 'newest' && <div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></div>}
                      </button>

                      <button
                        onClick={() => { setSortOrder('oldest'); setShowSortDropdown(false); }}
                        className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-[#FFF9E1] transition-all flex items-center justify-between group ${sortOrder === 'oldest' ? 'text-[#FFB300] bg-[#FFF9E1/30] font-bold' : 'text-gray-600'}`}
                      >
                        <span>Oldest First</span>
                        {sortOrder === 'oldest' && <div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></div>}
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowExportPopup(true)}
                className="bg-[#E30000] text-white px-8 py-2.5 rounded-[10px] text-[14px] font-bold shadow-md hover:bg-red-700 transition-colors uppercase tracking-wider"
              >
                Export
              </button>
            </div>
          </div>

          {/* Export Popup */}
          {showExportPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
              <div
                className="bg-[#FF9D00] w-[90%] max-w-[500px] rounded-[30px] p-8 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowExportPopup(false)}
                  className="absolute right-6 top-6 text-white hover:rotate-90 transition-all duration-300"
                >
                  <FaTimes size={24} />
                </button>

                {/* Title */}
                <h2 className="text-white text-3xl font-bold text-center mb-8">Export Data</h2>

                {/* Export Options */}
                <div className="flex justify-center items-center gap-6 mb-8">
                  <span className="text-white text-lg font-medium">Export in</span>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="format"
                          value="CSV"
                          checked={exportFormat === 'CSV'}
                          onChange={() => setExportFormat('CSV')}
                          className="peer appearance-none w-5 h-5 border-2 border-white rounded-full checked:bg-white checked:border-white transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#FF9D00] scale-0 peer-checked:scale-100 transition-transform"></div>
                      </div>
                      <span className="text-white font-medium group-hover:opacity-80">CSV</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="format"
                          value="PDF"
                          checked={exportFormat === 'PDF'}
                          onChange={() => setExportFormat('PDF')}
                          className="peer appearance-none w-5 h-5 border-2 border-white rounded-full checked:bg-white checked:border-white transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#FF9D00] scale-0 peer-checked:scale-100 transition-transform"></div>
                      </div>
                      <span className="text-white font-medium group-hover:opacity-80">PDF</span>
                    </label>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex justify-center items-center gap-3 mb-10">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isExportConfirmed}
                      onChange={(e) => setIsExportConfirmed(e.target.checked)}
                      className="peer hidden"
                    />
                    <div className="w-6 h-6 border-2 border-white rounded-[4px] flex items-center justify-center peer-checked:bg-white transition-all">
                      <svg className={`w-4 h-4 text-[#FF9D00] ${isExportConfirmed ? 'opacity-100' : 'opacity-0'} transition-opacity`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">Are you sure you want to export ?</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowExportPopup(false)}
                    className="px-8 py-2.5 rounded-[12px] border-2 border-white text-white font-bold hover:bg-white hover:text-[#FF9D00] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-10 py-2.5 rounded-[12px] bg-[#E30000] text-white font-bold shadow-lg hover:bg-red-700 transition-all uppercase"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4 min-w-[1100px]">
              <thead>
                <tr className="bg-[#FFB300]">
                  <th className="px-8 py-6 rounded-l-[15px] text-left text-white font-bold text-[18px]">User Name</th>
                  <th className="px-6 py-6 text-left text-white font-bold text-[18px]">Question 01</th>
                  <th className="px-6 py-6 text-left text-white font-bold text-[18px]">Question 02</th>
                  <th className="px-6 py-6 text-left text-white font-bold text-[18px]">Question 03</th>
                  <th className="px-8 py-6 rounded-r-[15px] text-left text-white font-bold text-[18px]">personal Experience</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-20 text-gray-400 text-lg">Loading feedback...</td></tr>
                ) : currentFeedbacks.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-20 text-gray-400 italic text-lg">No feedback available</td></tr>
                ) : (
                  currentFeedbacks.map((item, idx) => {
                    const rowBg = idx % 2 === 0 ? 'bg-[#FFF9E1]' : 'bg-white';
                    return (
                      <tr key={item._id} className="group hover:shadow-lg transition-all duration-300">
                        <td className={`px-8 py-5 ${rowBg} rounded-l-[15px] border-l border-t border-b border-[#FFB30030] text-gray-800 font-bold text-[15px]`}>
                          @{item.user ? (item.user.name || item.user.username || 'user') : (item.username || 'user')}
                        </td>
                        <td className={`px-6 py-5 ${rowBg} border-t border-b border-[#FFB30030]`}>
                          {renderStars(item.quality)}
                        </td>
                        <td className={`px-6 py-5 ${rowBg} border-t border-b border-[#FFB30030]`}>
                          {renderStars(item.smoothness)}
                        </td>
                        <td className={`px-6 py-5 ${rowBg} border-t border-b border-[#FFB30030]`}>
                          {renderStars(item.clarity)}
                        </td>
                        <td className={`px-8 py-5 ${rowBg} rounded-r-[15px] border-r border-t border-b border-[#FFB30030] text-gray-700 text-[13px] leading-relaxed italic max-w-[450px]`}>
                          "{item.experience || 'The course was well-structured and easy to follow. I learned a lot in a short time and really appreciated the clear explanations!'}"
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="mt-8 px-2 text-[15px] font-bold text-gray-600">
            No of Users - {currentFeedbacks.length} out of {filteredFeedbacks.length}
          </div>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6 max-w-[1334px] mx-auto w-full">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto px-10 py-3 rounded-[12px] bg-[#F8E7C8] text-gray-600 font-bold hover:bg-[#F2DEC0] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-11 h-11 rounded-[8px] flex items-center justify-center font-bold text-lg transition-all ${currentPage === num
                    ? 'bg-[#FF9D00] text-white shadow-lg'
                    : 'bg-[#F8E7C8] text-gray-600 hover:bg-[#F2DEC0]'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto px-12 py-3 rounded-[12px] bg-[#FF9D00] text-white font-bold shadow-lg hover:bg-[#FF8C00] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
