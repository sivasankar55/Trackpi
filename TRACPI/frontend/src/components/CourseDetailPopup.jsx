import React, { useState } from 'react';
import './css/CourseDetailPopup.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CourseDetailPopup = ({ course, onClose }) => {
    const [showSections, setShowSections] = useState(false);

    if (!course) return null;

    return (
        <div className="course-detail-overlay" onClick={onClose}>
            <div className="course-detail-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Course Details</h2>

                <div className="modal-content">
                    <div className="detail-item">
                        <span className="detail-label">Course Name</span>
                        <span className="detail-value">{course.courseName}</span>
                    </div>

                    <div className="detail-item">
                        <div
                            className="detail-header cursor-pointer flex justify-between items-center"
                            onClick={() => setShowSections(!showSections)}
                        >
                            <span className="detail-label">Course Sections</span>
                            {showSections ? <ChevronUp size={20} className="text-[#FF9D00]" /> : <ChevronDown size={20} className="text-[#FF9D00]" />}
                        </div>
                        {showSections && (
                            <ul className="sections-list">
                                {course.sections && course.sections.length > 0 ? (
                                    course.sections.map((section, index) => (
                                        <li key={section._id || index} className="section-name">
                                            {index + 1}. {section.sectionName}
                                        </li>
                                    ))
                                ) : (
                                    <li className="section-name">No sections available</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Course Duration</span>
                        <span className="detail-value">{course.duration ? (typeof course.duration === 'string' ? course.duration : `${Math.floor(course.duration / 60)} Hours`) : 'N/A'}</span>
                    </div>

                    <div className="detail-description">
                        <p>{course.courseDetail || "A course description provides prospective students with an overview of a course, including its content, objectives, learning methods, and requirements, helping them decide if it aligns with their interests and goals."}</p>
                    </div>
                </div>

                <button className="ok-button" onClick={onClose}>
                    Ok, Got it
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPopup;
