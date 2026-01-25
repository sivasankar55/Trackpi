import React, { useState } from 'react';
import axios from 'axios';

const AddCourse = ({ onClose, onCourseAdded }) => {
    const [formData, setFormData] = useState({
        courseName: '',
        courseDetail: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:5000/api/courses', {
                courseName: formData.courseName,
                courseDetail: formData.courseDetail
            }, {
                withCredentials: true
            });

            setSuccess('Course added successfully!');
            setFormData({
                courseName: '',
                courseDetail: ''
            });

            // Notify parent component
            if (onCourseAdded) {
                onCourseAdded();
            }

            // Close popup after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Error adding course:', err);
            setError(err.response?.data?.error || 'Failed to add course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div
                className="w-[732px] p-[50px] rounded-[10px] border-[2px] border-[#FFB300] bg-[#FF8200]
                   shadow-[4px_4px_50px_10px_rgba(0,0,0,0.25),inset_1px_1px_10px_0px_rgba(255,241,207,0.5)] 
                   backdrop-blur-[100px] text-white relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-3xl font-semibold text-center mb-[50px] text-white">
                    Add Course
                </h2>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded text-green-300 text-sm">
                        {success}
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={handleSubmit}>
                    <div
                        className="w-[630px] grid grid-cols-1 gap-y-[30px] mx-auto text-white"
                        style={{
                            opacity: 1,
                        }}
                    >
                        {/* Course Name */}
                        <div className="h-[77px]">
                            <label className="block text-lg font-semibold mb-2">Course Name</label>
                            <input
                                type="text"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleInputChange}
                                placeholder="Enter Course Name"
                                required
                                className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Course Detail */}
                        <div className="h-[150px]">
                            <label className="block text-lg font-semibold mb-2">Course Detail</label>
                            <textarea
                                name="courseDetail"
                                value={formData.courseDetail}
                                onChange={handleInputChange}
                                placeholder="Enter Course Details"
                                required
                                className="w-full h-[110px] px-[15px] py-[10px] rounded-[5px] border border-[#FFB300] bg-[#FF9900] text-white placeholder-white focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Cancel Button */}
                    <div className="flex justify-between mt-[40px] w-[632px] h-[46px] gap-[30px] mx-auto">
                        <button
                            type="button"
                            className="w-[300px] h-[46px] rounded-[5px] border border-[#FFF1CF] bg-[#FFB30033]
                            shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] text-white font-semibold transition hover:bg-[#FFB30055]"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        {/* Add Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[302px] h-[46px] rounded-[5px] border border-[#8F0000] bg-[#E20000]
                            shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] text-white font-semibold transition disabled:opacity-50 hover:bg-[#FF0000] active:scale-[0.98]"
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourse;
