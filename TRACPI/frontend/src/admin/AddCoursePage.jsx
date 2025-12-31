import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icons/Assets
import { FiEdit3, FiTrash2 } from 'react-icons/fi';

const AddCoursePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        courseName: '',
        courseDetail: ''
    });
    // Changed: Initialize sections as empty array of objects
    // Changed: Initialize sections as empty array of objects
    const [sections, setSections] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const handleSectionChange = (e) => {
        setSectionData(prev => ({ ...prev, sectionName: e.target.value }));
    };

    const handleUnitChange = (e) => {
        const { name, value } = e.target;
        setCurrentUnit(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUnit = () => {
        if (currentUnit.name) {
            setSectionData(prev => ({
                ...prev,
                units: [...prev.units, currentUnit]
            }));
            setCurrentUnit({ name: '', description: '', videoId: '' });
            setShowUnitDetails(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Quiz Handlers
    const handleQuestionOptionChange = (idx, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[idx] = value;
        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    };

    const handleAddQuestionWithPopup = () => {
        // Basic validation
        if (!currentQuestion.question) {
            alert('Please enter a question');
            return;
        }
        if (quizType === 'MCQ' && currentQuestion.options.some(opt => !opt)) {
            alert('Please fill in all options');
            return;
        }
        if (!currentQuestion.correctAnswer) {
            alert('Please enter the correct answer');
            return;
        }

        // Add to questions list
        const newQuestion = {
            ...currentQuestion,
            type: quizType,
            // For T/F, ensure options are set if not already (though UI handles display)
            options: quizType === 'True/False' ? ['True', 'False'] : currentQuestion.options
        };

        setQuestions(prev => [...prev, newQuestion]);

        // Reset and close
        setCurrentQuestion({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        });
        setShowQuizPopup(false);
    };

    const handleLaunchCourse = async () => {
        if (!formData.courseName || !formData.courseDetail) {
            alert('Please fill in course name and details');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/courses', {
                courseName: formData.courseName,
                courseDetail: formData.courseDetail,
                sections: sections,
                questions: questions
            }, { withCredentials: true });
            navigate('/admin/course-management');
        } catch (error) {
            console.error('Error launching course:', error);
            alert('Failed to launch course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 bg-white min-h-screen font-['Poppins'] overflow-x-hidden pt-10">
            {/* Top Navigation Bar */}


            {/* Launch Course Button container */}
            {!isAddingSection && (
                <div className="flex justify-center sm:justify-end px-4 sm:px-12 mb-8">
                    <button
                        onClick={handleLaunchCourse}
                        disabled={loading}
                        className="w-full sm:w-auto bg-[#E20000] hover:bg-[#C10000] text-white font-bold py-3 px-12 rounded-[12px] shadow-[0px_4px_10px_rgba(226,0,0,0.3)] transition-all text-lg sm:text-xl"
                    >
                        {loading ? 'Launching...' : 'Launch Course'}
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

                            <div className="pt-2">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg sm:text-[22px] font-extrabold text-[#333]">Section</h3>
                                    <button
                                        onClick={() => setIsAddingSection(true)}
                                        className="bg-[#D35400] hover:bg-[#BA4A00] text-white px-6 sm:px-10 py-2 sm:py-2.5 rounded-[10px] font-extrabold text-base sm:text-lg transition-colors shadow-sm"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    {sections.map((section, index) => (
                                        <div key={index} className="flex justify-between items-center bg-[#FFB300] h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] hover:shadow-md transition-shadow">
                                            {/* Changed: Render section.name */}
                                            <span className="text-white font-bold text-lg sm:text-xl italic">{section.name}</span>
                                            <FiEdit3 className="text-white text-xl sm:text-2xl cursor-pointer" />
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
                                onClick={() => setShowQuizPopup(true)}
                                className="bg-[#D35400] hover:bg-[#BA4A00] text-white px-6 sm:px-10 py-2 sm:py-2.5 rounded-[10px] font-extrabold text-base sm:text-lg transition-colors shadow-sm"
                            >
                                Add
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-3 sm:space-y-4">
                                {questions.map((question, index) => (
                                    <div key={index} className="flex justify-between items-center bg-[#FFB300] h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] hover:shadow-md transition-shadow">
                                        <span className="text-white font-bold text-lg sm:text-xl italic truncate max-w-[70%]">{question.question}</span>
                                        <FiTrash2
                                            className="text-white text-xl sm:text-2xl cursor-pointer hover:text-red-200"
                                            onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                                        />
                                    </div>
                                ))}
                                {questions.length === 0 && (
                                    <div className="text-center text-gray-400 py-4 italic">No questions added yet</div>
                                )}
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
                                    onClick={() => setShowUnitDetails(true)}
                                    className="bg-[#D35400] hover:bg-[#BA4A00] text-white px-6 sm:px-10 py-2 sm:py-2.5 rounded-[10px] font-extrabold text-base sm:text-lg transition-colors shadow-sm"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {sectionData.units.map((unit, index) => (
                                    <div key={index} className="flex justify-between items-center bg-[#FF9900] h-[55px] sm:h-[60px] px-6 sm:px-8 rounded-[12px] hover:shadow-md transition-shadow">
                                        <span className="text-white font-bold text-lg sm:text-xl italic">{unit.name}</span>
                                        <FiEdit3 className="text-white text-xl sm:text-2xl cursor-pointer" />
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
                                <h3 className="text-center text-lg sm:text-[22px] font-extrabold text-[#333] mb-8">Unit Details</h3>

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
                                        <label className="block text-base sm:text-lg font-bold text-[#333] mb-2">Video ID</label>
                                        <input
                                            type="text"
                                            name="videoId"
                                            value={currentUnit.videoId}
                                            onChange={handleUnitChange}
                                            placeholder="Enter Video ID"
                                            className="w-full h-[50px] px-6 rounded-[10px] bg-[#FF9900] text-white placeholder-white/80 focus:outline-none text-base font-medium"
                                        />
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
                            onClick={() => setIsAddingSection(false)}
                            className="w-[160px] h-[50px] bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold rounded-[10px] shadow-md transition-all text-lg"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                if (sectionData.sectionName) {
                                    setSections(prev => [...prev, {
                                        name: sectionData.sectionName,
                                        units: sectionData.units
                                    }]);
                                    setIsAddingSection(false);
                                    setSectionData({ sectionName: '', units: [] });
                                } else {
                                    alert('Please enter a section name');
                                }
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
        </div>
    );
};

export default AddCoursePage;
