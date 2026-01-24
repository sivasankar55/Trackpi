import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaRegSmileBeam, FaTimes } from 'react-icons/fa';
import './css/ChatBotPopup.css';

const ChatBotPopup = ({ onClose }) => {
    const [visibleMessages, setVisibleMessages] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setVisibleMessages(1), 500);
        const timer2 = setTimeout(() => setVisibleMessages(2), 1500);
        const timer3 = setTimeout(() => setVisibleMessages(3), 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className="chatbot-popup-wrapper">
            <div className="chatbot-popup-container themed">
                {/* Close Button */}
                <button className="chatbot-close-btn" onClick={onClose} aria-label="Close chat">
                    <FaTimes />
                </button>

                {/* Header Icon */}
                <div className="chatbot-header-icon themed">
                    <div className="inner-icon-circle themed">
                        <FaRegSmileBeam className="smile-icon" />
                    </div>
                </div>

                <div className="chatbot-messages-container">
                    {/* Message 1 */}
                    <div className={`chatbot-message-bubble themed ${visibleMessages >= 1 ? 'visible' : ''}`}>
                        <p>Hi there! How can we assist you?</p>
                    </div>

                    {/* Message 2 */}
                    <div className={`chatbot-message-bubble themed ${visibleMessages >= 2 ? 'visible' : ''}`}>
                        <a href="tel:+918078179646" className="message-content-with-icon themed">
                            <FaPhoneAlt className="accent-icon" />
                            <span>Contact: +91 80781 79646</span>
                        </a>
                    </div>

                    {/* Message 3 */}
                    <div className={`chatbot-message-bubble themed ${visibleMessages >= 3 ? 'visible' : ''}`}>
                        <a href="mailto:operations@trackpi.in" className="message-content-with-icon themed">
                            <FaEnvelope className="accent-icon" />
                            <div className="email-text">
                                <span className="label">Email:</span>
                                <span className="value">operations@trackpi.in</span>
                            </div>
                        </a>
                    </div>

                </div>

                {/* Bottom Tail */}
                <div className="chatbot-popup-tail themed"></div>
            </div>
        </div>
    );
};

export default ChatBotPopup;
