import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Icons/Assets
// Icons/Assets
// Icons/Assets
import { FiEdit3, FiTrash2, FiVideo, FiUploadCloud, FiImage, FiX } from 'react-icons/fi';
import CourseSuccessPopup from './CourseSuccessPopup';
import ErrorPopup from './ErrorPopup';

const getVideoThumbnail = (videoID) => {
    if (!videoID) return null;
    let str = String(videoID).trim();
    // YouTube
    const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/|user\/(?:\w+\/)+))([^?&"'>]+)/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
    // Vimeo
    const vimeoMatch = str.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
    // Fallbacks
    if (/^\d+$/.test(str)) return `https://vumbnail.com/${str}.jpg`;
    if (str.length === 11) return `https://img.youtube.com/vi/${str}/mqdefault.jpg`;
    return null;
};

const AddCoursePage = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    // derived state to check if we are in edit mode
    const isEditMode = Boolean(courseId);
    const [formData, setFormData] = useState({
        courseName: '',
        courseDetail: '',
        quizTime: 60
    });
    // Changed: Initialize sections as empty array of objects
    const [sections, setSections] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check for success popup
    const [successPopup, setSuccessPopup] = useState({ show: false, mode: 'create' });

    // Check for error popup
    const [errorPopup, setErrorPopup] = useState({ show: false, message: '' });

    // Fetch course details if in edit mode
    React.useEffect(() => {
        if (isEditMode) {
            const fetchCourseDetails = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
                        withCredentials: true
                    });
                    const courseData = response.data;
                    setFormData({
                        courseName: courseData.courseName,
                        courseDetail: courseData.courseDetail,
                        quizTime: courseData.quizTime || 60
                    });
                    if (courseData.courseImage) {
                        setImagePreview(courseData.courseImage);
                    }
                    const robustParse = (data) => {
                        if (!data) return [];
                        if (Array.isArray(data)) {
                            return data.map(item => {
                                if (item && typeof item === 'object' && !Array.isArray(item)) {
                                    const obj = { ...item };
                                    if (obj.type && !obj.quizType) obj.quizType = obj.type;
                                    return obj;
                                }
                                return robustParse(item);
                            }).flat().filter(i => i && typeof i === 'object');
                        }
                        if (data && typeof data === 'object') {
                            const obj = { ...data };
                            if (obj.type && !obj.quizType) obj.quizType = obj.type;
                            return [obj];
                        }
                        if (typeof data !== 'string') return [];
                        let s = data.trim();
                        if (!s || s === 'undefined' || s === 'null') return [];
                        const cleanJS = (str) => {
                            try {
                                return str
                                    .replace(/(\r\n|\n|\r)/gm, "")
                                    .replace(/\\n/g, "")
                                    .replace(/'\s*\+\s*'/g, "")
                                    .replace(/"\s*\+\s*"/g, "")
                                    .replace(/'\s*\+\s*"/g, "")
                                    .replace(/"\s*\+\s*'/g, "")
                                    .replace(/'/g, '"')
                                    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                                    .replace(/,\s*([\]}])/g, '$1');
                            } catch (error) { return str; }
                        };
                        try {
                            const parsed = JSON.parse(s);
                            return robustParse(parsed);
                        } catch (_) {
                            try {
                                const parsed = JSON.parse(cleanJS(s));
                                return robustParse(parsed);
                            } catch (__) {
                                const matches = s.match(/\{[^{}]+\}/g);
                                if (matches) {
                                    return matches.map(m => {
                                        try {
                                            const item = JSON.parse(cleanJS(m));
                                            if (item && typeof item === 'object') {
                                                const obj = { ...item };
                                                if (obj.type && !obj.quizType) obj.quizType = obj.type;
                                                return obj;
                                            }
                                        } catch (err) {
                                            console.error('Json parse error in matches:', err);
                                        }
                                        return null;
                                    }).filter(i => i && typeof i === 'object');
                                }
                                return [];
                            }
                        }
                    };

                    const rawSections = courseData.sections || [];
                    const rawQuestions = courseData.questions || [];

                    console.log('Raw Course Data:', { rawSections, rawQuestions });

                    setSections(robustParse(rawSections));
                    setQuestions(robustParse(rawQuestions));
                } catch (error) {
                    console.error('Error fetching course details:', error);
                    alert('Failed to fetch course details');
                } finally {
                    setLoading(false);
                }
            };
            fetchCourseDetails();
        }
    }, [courseId, isEditMode]);

    // Quiz Popup State
    const [showQuizPopup, setShowQuizPopup] = useState(false);
    const [quizType, setQuizType] = useState('MCQ'); // 'MCQ' or 'True/False'
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
    });

    // New State for "Add Section" View
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [sectionData, setSectionData] = useState({
        sectionName: '',
        units: []
    });
    const [currentUnit, setCurrentUnit] = useState({
        name: '',
        description: '',
        videoId: ''
    });
    const [showUnitDetails, setShowUnitDetails] = useState(false);

    // State for tracking editing indices
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
    const [editingUnitIndex, setEditingUnitIndex] = useState(null);

    const handleSectionChange = (e) => {
        setSectionData(prev => ({ ...prev, sectionName: e.target.value }));
    };

    const handleUnitChange = (e) => {
        const { name, value } = e.target;
        setCurrentUnit(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUnit = () => {
        if (!currentUnit.name || !currentUnit.description || !currentUnit.videoId) {
            setErrorPopup({ show: true, message: 'Please fill in all unit details (Name, Description, Video ID)' });
            return;
        }

        if (editingUnitIndex !== null) {
            // Update existing unit
            const updatedUnits = [...sectionData.units];
            updatedUnits[editingUnitIndex] = currentUnit;
            setSectionData(prev => ({ ...prev, units: updatedUnits }));
            setEditingUnitIndex(null);
        } else {
            // Add new unit
            setSectionData(prev => ({
                ...prev,
                units: [...prev.units, currentUnit]
            }));
        }
        setCurrentUnit({ name: '', description: '', videoId: '' });
        setShowUnitDetails(false);
    };

    const handleEditUnit = (index) => {
        const unitToEdit = sectionData.units[index];
        setCurrentUnit({
            name: unitToEdit.name || unitToEdit.unitName || '',
            description: unitToEdit.description || unitToEdit.unitDescription || '',
            videoId: unitToEdit.videoId || unitToEdit.videoID || ''
        });
        setEditingUnitIndex(index);
        setShowUnitDetails(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setErrorPopup({
                    show: true,
                    message: 'Invalid file type. Please select a PNG or JPG image.'
                });
                e.target.value = null; // Clear input
                return;
            }

            // Check file size (5MB = 5 * 1024 * 1024 bytes)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setErrorPopup({
                    show: true,
                    message: 'File is too large. Maximum size is 5MB.'
                });
                e.target.value = null; // Clear input
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Quiz Handlers
    const handleQuestionOptionChange = (idx, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[idx] = value;
        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    };

    const handleAddQuestionWithPopup = () => {
        console.log('Adding/Updating question...', { currentQuestion, quizType, editingQuestionIndex });
        // Basic validation
        if (!currentQuestion.question) {
            setErrorPopup({ show: true, message: 'Please enter a question' });
            return;
        }
        if (quizType === 'MCQ' && currentQuestion.options.some(opt => !opt)) {
            setErrorPopup({ show: true, message: 'Please fill in all options for the MCQ' });
            return;
        }
        if (!currentQuestion.correctAnswer) {
            setErrorPopup({ show: true, message: 'Please enter the correct answer' });
            return;
        }

        const newQuestion = {
            ...currentQuestion,
            quizType: quizType,
            options: quizType === 'True/False' ? ['True', 'False'] : currentQuestion.options
        };

        if (editingQuestionIndex !== null) {
            // Update existing question
            setQuestions(prev => {
                const updated = [...prev];
                updated[editingQuestionIndex] = newQuestion;
                return updated;
            });
            setEditingQuestionIndex(null);
        } else {
            // Add new question
            setQuestions(prev => [...prev, newQuestion]);
        }

        console.log('New questions state:', [...questions, newQuestion]);

        // Reset and close
        setCurrentQuestion({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        });
        setShowQuizPopup(false);
    };

    const handleEditQuestion = (index) => {
        const questionToEdit = questions[index];
        if (!questionToEdit) return;

        setCurrentQuestion({
            question: questionToEdit.question || '',
            options: questionToEdit.options || ['', '', '', ''],
            correctAnswer: questionToEdit.correctAnswer || ''
        });
        setQuizType(questionToEdit.quizType || questionToEdit.type || 'MCQ');
        setEditingQuestionIndex(index);
        setShowQuizPopup(true);
    };

    const validateCourseDetails = () => {
        if (!formData.courseName.trim()) {
            setErrorPopup({ show: true, message: 'Please enter a Course Name before adding/editing sections.' });
            return false;
        }
        if (!formData.courseDetail.trim()) {
            setErrorPopup({ show: true, message: 'Please enter Course Details before adding/editing sections.' });
            return false;
        }
        if (!imagePreview) {
            setErrorPopup({ show: true, message: 'Please upload a Course Image before adding/editing sections.' });
            return false;
        }
        return true;
    };

    const handleEditSection = (index) => {
        if (!validateCourseDetails()) return;
        const sectionToEdit = sections[index];
        setSectionData({
            sectionName: sectionToEdit.name || sectionToEdit.sectionName || '',
            units: sectionToEdit.units || []
        });
        setEditingSectionIndex(index);
        setIsAddingSection(true);
    };

    const handleLaunchCourse = async () => {
        if (!formData.courseName || !formData.courseDetail) {
            setErrorPopup({ show: true, message: 'Please fill in the Course Name and Course Details.' });
            return;
        }
        setLoading(true);
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('courseName', formData.courseName);
            formDataToSubmit.append('courseDetail', formData.courseDetail);
            formDataToSubmit.append('quizTime', Number(formData.quizTime) || 60);
            formDataToSubmit.append('sections', JSON.stringify(sections));
            formDataToSubmit.append('questions', JSON.stringify(questions));

            if (imageFile) {
                formDataToSubmit.append('courseImage', imageFile);
            }

            console.log("Saving course with FormData");

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/courses/${courseId}`, formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                setSuccessPopup({ show: true, mode: 'update' });
            } else {
                await axios.post('http://localhost:5000/api/courses', formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                setSuccessPopup({ show: true, mode: 'create' });
            }
        } catch (error) {
            console.error('Error launching/updating course:', error);
            const errMsg = error.response?.data?.error || error.message || 'Failed to save course';
            setErrorPopup({ show: true, message: `Failed to save course: ${errMsg}` });
        } finally {
            setLoading(false);
        }
    };

    const handlePopupClose = () => {
        setSuccessPopup({ show: false, mode: 'create' });
        navigate('/admin/course-management');
    };

    return (
        <div className="flex-1 bg-white min-h-screen font-['Poppins'] overflow-x-hidden pt-10 flex flex-col items-center">
            <div className="w-full max-w-[1600px]">
                {/* Top Navigation Bar */}


                {/* Launch Course Button container */}
                {!isAddingSection && (
                    <div className="flex justify-center sm:justify-end px-4 sm:px-12 mb-8">
                        <button
                            onClick={handleLaunchCourse}
                            disabled={loading}
                            className="w-full sm:w-auto bg-[#E20000] hover:bg-[#C10000] text-white font-bold py-3 px-12 rounded-[12px] shadow-[0px_4px_10px_rgba(226,0,0,0.3)] transition-all text-lg sm:text-xl"
                        >
                            {loading ? (isEditMode ? 'Updating...' : 'Launching...') : (isEditMode ? 'Update Course' : 'Launch Course')}
                        </button>
                    </div>
                )}

                {/* Main Content Grid */}
                {!isAddingSection ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 px-4 sm:px-12 pb-12">
                        {/* Left Column: Course Details & Sections */}
                        <div className="bg-white border border-[#FFB300] rounded-[20px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(255,179,0,0.1)]">
                            <div className="space-y-6 sm:space-y-8">
                                <div>
                                    <label className="block text-lg sm:text-[22px] font-extrabold text-[#333] mb-3 sm:mb-4">Course Name</label>
                                    <input
                                        type="text"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        placeholder="Enter Course name"
                                        className="w-full h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] bg-[#FFB300] text-white placeholder-white/80 focus:outline-none text-lg sm:text-xl font-bold italic"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg sm:text-[22px] font-extrabold text-[#333] mb-3 sm:mb-4">Course Detail</label>
                                    <input
                                        type="text"
                                        name="courseDetail"
                                        value={formData.courseDetail}
                                        onChange={handleInputChange}
                                        placeholder="Enter Course Details"
                                        className="w-full h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] bg-[#FFB300] text-white placeholder-white/80 focus:outline-none text-lg sm:text-xl font-bold italic"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg sm:text-[22px] font-extrabold text-[#333] mb-3 sm:mb-4">Course Image</label>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".png, .jpg, .jpeg"
                                                onChange={handleImageChange}
                                                id="courseImageInput"
                                                className="hidden"
                                            />

                                            {!imagePreview ? (
                                                <label
                                                    htmlFor="courseImageInput"
                                                    className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-[#FFB300] rounded-[16px] bg-[#FFF8E7] hover:bg-[#FFF2D0] transition-all cursor-pointer group"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                            <FiUploadCloud size={32} className="text-[#FFB300]" />
                                                        </div>
                                                        <p className="mb-2 text-sm text-[#333] font-bold">
                                                            <span className="text-[#D35400]">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium">PNG, JPG or JPEG (MAX. 5MB)</p>
                                                    </div>
                                                </label>
                                            ) : (
                                                <div className="relative group w-full h-[220px] rounded-[16px] overflow-hidden border-2 border-[#FFB300] shadow-md">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Course Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                        <label
                                                            htmlFor="courseImageInput"
                                                            className="p-3 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg"
                                                            title="Change Image"
                                                        >
                                                            <FiEdit3 size={20} className="text-[#333]" />
                                                        </label>
                                                        <button
                                                            onClick={() => {
                                                                setImageFile(null);
                                                                setImagePreview(null);
                                                            }}
                                                            className="p-3 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg"
                                                            title="Remove Image"
                                                        >
                                                            <FiX size={20} className="text-red-500" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
                                                        <FiImage className="text-white" size={14} />
                                                        <span className="text-white text-xs font-medium truncate max-w-[150px]">
                                                            {imageFile ? imageFile.name : "Current Image"}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg sm:text-[22px] font-extrabold text-[#333]">Section</h3>
                                        <button
                                            onClick={() => {
                                                if (!validateCourseDetails()) return;
                                                setEditingSectionIndex(null);
                                                setSectionData({ sectionName: '', units: [] });
                                                setIsAddingSection(true);
                                            }}
                                            className="bg-[#D35400] hover:bg-[#BA4A00] text-white px-6 sm:px-10 py-2 sm:py-2.5 rounded-[10px] font-extrabold text-base sm:text-lg transition-colors shadow-sm"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="space-y-3 sm:space-y-4">
                                        {sections.map((section, index) => (
                                            <div key={index} className="flex justify-between items-center bg-[#FFB300] h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] hover:shadow-md transition-shadow">
                                                {/* Support both local 'name' and DB 'sectionName' */}
                                                <span className="text-white font-bold text-lg sm:text-xl italic">{section.name || section.sectionName}</span>
                                                <FiEdit3
                                                    className="text-white text-xl sm:text-2xl cursor-pointer hover:text-white/80"
                                                    onClick={() => handleEditSection(index)}
                                                />
                                            </div>
                                        ))}
                                        {sections.length === 0 && (
                                            <div className="text-center text-gray-400 py-4 italic">No sections added</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Quiz */}
                        <div className="bg-white border border-[#FFB300] rounded-[20px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(255,179,0,0.1)] h-fit">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg sm:text-[22px] font-extrabold text-[#333]">Add quiz</h3>
                                <button
                                    onClick={() => {
                                        setEditingQuestionIndex(null);
                                        setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '' });
                                        setShowQuizPopup(true);
                                    }}
                                    className="bg-[#D35400] hover:bg-[#BA4A00] text-white px-6 sm:px-10 py-2 sm:py-2.5 rounded-[10px] font-extrabold text-base sm:text-lg transition-colors shadow-sm"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-3 sm:space-y-4">
                                    {questions.map((question, index) => (
                                        <div key={index} className="flex justify-between items-center bg-[#FFB300] h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] hover:shadow-md transition-shadow">
                                            <span className="text-white font-bold text-lg sm:text-xl italic truncate max-w-[60%]">{question.question}</span>
                                            <div className="flex items-center gap-3">
                                                <FiEdit3
                                                    className="text-white text-xl sm:text-2xl cursor-pointer hover:text-white/80"
                                                    onClick={() => handleEditQuestion(index)}
                                                />
                                                <FiTrash2
                                                    className="text-white text-xl sm:text-2xl cursor-pointer hover:text-red-200"
                                                    onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {questions.length === 0 && (
                                        <div className="text-center text-gray-400 py-4 italic">No questions added yet</div>
                                    )}
                                </div>
                            </div>

                            {/* Quiz Time Limit */}
                            <div className="mt-8 pt-6 border-t border-[#FFB300]">
                                <label className="block text-lg sm:text-[22px] font-extrabold text-[#333] mb-3 sm:mb-4">Quiz Time (Minutes)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        name="quizTime"
                                        value={formData.quizTime}
                                        onChange={handleInputChange}
                                        placeholder="60"
                                        className="w-full h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] bg-[#FFB300] text-white placeholder-white/80 focus:outline-none text-lg sm:text-xl font-bold italic"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // ADD SECTION VIEW
                    <div className="px-4 sm:px-12 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-20">
                            {/* Left: Add Section & Units List */}
                            <div className="bg-white border border-[#FFB300] rounded-[20px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(255,179,0,0.1)] h-fit">
                                <div className="mb-8">
                                    <label className="block text-lg sm:text-[22px] font-extrabold text-[#333] mb-3 sm:mb-4">Section</label>
                                    <input
                                        type="text"
                                        value={sectionData.sectionName}
                                        onChange={handleSectionChange}
                                        placeholder="Enter Section name"
                                        className="w-full h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] bg-[#FF9900] text-white placeholder-white/80 focus:outline-none text-lg sm:text-xl font-bold"
                                    />
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg sm:text-[22px] font-extrabold text-[#333]">Units</h3>
                                    <button
                                        onClick={() => {
                                            if (!sectionData.sectionName.trim()) {
                                                setErrorPopup({ show: true, message: 'Please enter a Section Name before adding units.' });
                                                return;
                                            }
                                            setEditingUnitIndex(null);
                                            setCurrentUnit({ name: '', description: '', videoId: '' });
                                            setShowUnitDetails(true);
                                        }}
                                        className="bg-[#D35400] hover:bg-[#BA4A00] text-white px-6 sm:px-10 py-2 sm:py-2.5 rounded-[10px] font-extrabold text-base sm:text-lg transition-colors shadow-sm"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    {sectionData.units.map((unit, index) => (
                                        <div key={index} className="flex justify-between items-center bg-[#FF9900] h-[70px] sm:h-[80px] px-4 sm:px-6 rounded-[12px] hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-[80px] h-[45px] bg-black/20 rounded-[6px] overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {getVideoThumbnail(unit.videoId || unit.videoID) ? (
                                                        <img
                                                            src={getVideoThumbnail(unit.videoId || unit.videoID)}
                                                            className="w-full h-full object-cover"
                                                            alt="thumb"
                                                        />
                                                    ) : (
                                                        <FiVideo className="text-white/50" />
                                                    )}
                                                </div>
                                                <span className="text-white font-bold text-base sm:text-lg italic truncate max-w-[150px] sm:max-w-[200px]">
                                                    {unit.name || unit.unitName}
                                                </span>
                                            </div>
                                            <FiEdit3
                                                className="text-white text-xl sm:text-2xl cursor-pointer hover:text-white/80"
                                                onClick={() => handleEditUnit(index)}
                                            />
                                        </div>
                                    ))}
                                    {sectionData.units.length === 0 && (
                                        <div className="text-center text-gray-400 py-4 italic">No units added yet</div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Unit Details Form */}
                            {showUnitDetails && (
                                <div className="bg-white border border-[#FFB300] rounded-[20px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(255,179,0,0.1)] h-fit relative">
                                    <h3 className="text-center text-lg sm:text-[22px] font-extrabold text-[#333] mb-8">
                                        {editingUnitIndex !== null ? 'Edit Unit' : 'Unit Details'}
                                    </h3>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-base sm:text-lg font-bold text-[#333] mb-2">Unit Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={currentUnit.name}
                                                onChange={handleUnitChange}
                                                placeholder="Enter Unit Name"
                                                className="w-full h-[50px] px-6 rounded-[10px] bg-[#FF9900] text-white placeholder-white/80 focus:outline-none text-base font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-base sm:text-lg font-bold text-[#333] mb-2">Unit Description</label>
                                            <input
                                                type="text"
                                                name="description"
                                                value={currentUnit.description}
                                                onChange={handleUnitChange}
                                                placeholder="Enter unit description"
                                                className="w-full h-[50px] px-6 rounded-[10px] bg-[#FF9900] text-white placeholder-white/80 focus:outline-none text-base font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-base sm:text-lg font-bold text-[#333] mb-2">Video ID / URL</label>
                                            <input
                                                type="text"
                                                name="videoId"
                                                value={currentUnit.videoId}
                                                onChange={handleUnitChange}
                                                placeholder="Enter Video ID or URL"
                                                className="w-full h-[50px] px-6 rounded-[10px] bg-[#FF9900] text-white placeholder-white/80 focus:outline-none text-base font-medium"
                                            />
                                            {currentUnit.videoId && (
                                                <div className="mt-4">
                                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Thumbnail Preview</label>
                                                    <div className="w-full aspect-video bg-black/10 rounded-[12px] overflow-hidden flex items-center justify-center border-2 border-dashed border-[#FF9900]/30 shadow-inner">
                                                        {getVideoThumbnail(currentUnit.videoId) ? (
                                                            <img
                                                                src={getVideoThumbnail(currentUnit.videoId)}
                                                                className="w-full h-full object-cover animate-in fade-in duration-500"
                                                                alt="preview"
                                                                onError={(e) => e.target.style.display = 'none'}
                                                            />
                                                        ) : (
                                                            <div className="text-center p-4">
                                                                <FiVideo size={32} className="mx-auto text-white/40 mb-2" />
                                                                <p className="text-white/60 text-xs">Enter a valid ID to see preview</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-center mt-8">
                                            <button
                                                onClick={handleAddUnit}
                                                className="bg-[#D50000] hover:bg-[#B71C1C] text-white px-12 py-3 rounded-[10px] font-extrabold text-lg shadow-md transition-all"
                                            >
                                                Enter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Action Buttons */}
                        <div className="flex justify-center flex-wrap gap-8 mt-16">
                            <button
                                onClick={() => {
                                    setIsAddingSection(false);
                                    setEditingSectionIndex(null);
                                    setSectionData({ sectionName: '', units: [] });
                                }}
                                className="w-[160px] h-[50px] bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold rounded-[10px] shadow-md transition-all text-lg"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    if (!sectionData.sectionName.trim()) {
                                        setErrorPopup({ show: true, message: 'Please enter a Section Name.' });
                                        return;
                                    }
                                    if (sectionData.units.length === 0) {
                                        setErrorPopup({ show: true, message: 'Please add at least one Unit to this section.' });
                                        return;
                                    }

                                    if (editingSectionIndex !== null) {
                                        // Update existing section
                                        setSections(prev => {
                                            const updated = [...prev];
                                            updated[editingSectionIndex] = {
                                                name: sectionData.sectionName,
                                                units: sectionData.units
                                            };
                                            return updated;
                                        });
                                    } else {
                                        // Add new section
                                        setSections(prev => [...prev, {
                                            name: sectionData.sectionName,
                                            units: sectionData.units
                                        }]);
                                    }
                                    setIsAddingSection(false);
                                    setSectionData({ sectionName: '', units: [] });
                                    setEditingSectionIndex(null);
                                }}
                                className="w-[160px] h-[50px] bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold rounded-[10px] shadow-md transition-all text-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                {/* QUIZ POPUP OVERLAY */}
                {showQuizPopup && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#FF9900] rounded-[20px] p-6 sm:p-8 w-full max-w-lg relative shadow-2xl">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-white text-2xl font-bold">Question {questions.length + 1}</h2>
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-[#FFA000] text-white font-bold py-2 px-4 pr-8 rounded-[20px] focus:outline-none cursor-pointer border border-[#FFB300]"
                                        value={quizType}
                                        onChange={(e) => setQuizType(e.target.value)}
                                    >
                                        <option value="MCQ">MCQ</option>
                                        <option value="True/False">T/F</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm pointer-events-none">▼</span>
                                </div>
                            </div>

                            {/* Question Input */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter the question"
                                    className="w-full bg-[#FFA000] text-white placeholder-white/80 px-4 py-3 rounded-[10px] focus:outline-none font-medium border border-[#FFB300]"
                                    value={currentQuestion.question}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                                />
                            </div>

                            {/* Options */}
                            <div className="mb-6">
                                <label className="text-white font-bold text-lg mb-3 block">Options</label>

                                {quizType === 'MCQ' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {['A', 'B', 'C', 'D'].map((optLabel, idx) => (
                                            <input
                                                key={idx}
                                                type="text"
                                                placeholder={`Option ${optLabel}`}
                                                className="w-full bg-[#FFA000] text-white placeholder-white/60 px-4 py-3 rounded-[10px] focus:outline-none text-center border border-[#FFB300]"
                                                value={currentQuestion.options[idx]}
                                                onChange={(e) => handleQuestionOptionChange(idx, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 'True' })}
                                            className={`w-full px-4 py-3 rounded-[10px] text-center font-bold border border-[#FFB300] cursor-pointer transition-colors ${currentQuestion.correctAnswer === 'True' ? 'bg-white text-[#FFA000]' : 'bg-[#FFA000] text-white hover:bg-[#FFB300]'}`}
                                        >
                                            True
                                        </div>
                                        <div
                                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 'False' })}
                                            className={`w-full px-4 py-3 rounded-[10px] text-center font-bold border border-[#FFB300] cursor-pointer transition-colors ${currentQuestion.correctAnswer === 'False' ? 'bg-white text-[#FFA000]' : 'bg-[#FFA000] text-white hover:bg-[#FFB300]'}`}
                                        >
                                            False
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Correct Answer */}
                            <div className="mb-8">
                                <label className="text-white font-bold text-lg mb-3 block">Correct Answer</label>
                                <input
                                    type="text"
                                    placeholder="Enter Your Correct Answer"
                                    className="w-full bg-[#FFA000] text-white placeholder-white/80 px-4 py-3 rounded-[10px] focus:outline-none border border-[#FFB300]"
                                    value={currentQuestion.correctAnswer}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center flex-col items-center gap-4">
                                <button
                                    onClick={handleAddQuestionWithPopup}
                                    className="bg-[#E20000] hover:bg-[#C10000] text-white font-bold py-3 px-10 rounded-[10px] shadow-lg transition-transform active:scale-95 text-lg"
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={() => setShowQuizPopup(false)}
                                    className="text-white/80 text-sm hover:text-white underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Popup */}
                <CourseSuccessPopup
                    isOpen={successPopup.show}
                    mode={successPopup.mode}
                    onClose={handlePopupClose}
                />

                {/* Error Popup */}
                <ErrorPopup
                    isOpen={errorPopup.show}
                    message={errorPopup.message}
                    onClose={() => setErrorPopup({ ...errorPopup, show: false })}
                />
            </div>
        </div >
    );
};

export default AddCoursePage;
