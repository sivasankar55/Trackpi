import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaLinkedinIn,
    FaQuora,
    FaBloggerB,
    FaMediumM,
    FaWhatsapp,
    FaRobot,
    FaHandsHelping
} from 'react-icons/fa';
import './css/FloatingIcons.css';
import ChatBotPopup from './ChatBotPopup';

const FloatingIcons = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="floating-icons-container">
            {/* Left Social Media Icons */}
            <div className="left-social-icons">
                <a href="https://www.instagram.com/trackpi_official" className="social-icon insta">
                    <FaInstagram />
                    <span className="label">INSTAGRAM</span>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61565947096778" className="social-icon fb">
                    <FaFacebookF />
                    <span className="label">FACEBOOK</span>
                </a>
                <a href="https://www.youtube.com/@trackpi" className="social-icon yt">
                    <FaYoutube />
                    <span className="label">YOUTUBE</span>
                </a>
                <a href="https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all" className="social-icon ln">
                    <FaLinkedinIn />
                    <span className="label">LINKEDIN</span>
                </a>
                <a href="https://www.quora.com/profile/Trackpi-Private-Limited?q=trackpi" className="social-icon quora">
                    <FaQuora />
                    <span className="label">QUORA</span>
                </a>
                <a href="https://trackpi.blogspot.com/" className="social-icon blogger">
                    <FaBloggerB />
                    <span className="label">BLOGGER</span>
                </a>
                <a href="https://medium.com/@trackpi" className="social-icon medium">
                    <FaMediumM />
                    <span className="label">MEDIUM</span>
                </a>
            </div>

            {/* Chat Bot Popup */}
            {isChatOpen && <ChatBotPopup onClose={() => setIsChatOpen(false)} />}

            {/* Right Floating Action Icons */}
            <div className="right-action-icons">
                <a
                    href="https://wa.me/918078179646"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-icon whatsapp"
                >
                    <FaWhatsapp />
                    <span className="badge">1</span>
                    <span className="hover-label">WhatsApp</span>
                </a>
                <Link to="/connect-us#contact-form" className="action-icon support" data-label="Contact Us">
                    <FaHandsHelping />
                    <span className="hover-label">Contact Us</span>
                </Link>
                <div
                    className={`action-icon ai-bot ${isChatOpen ? 'active' : ''}`}
                    onClick={toggleChat}
                >
                    <FaRobot />
                    <span className="hover-label">Chat Bot</span>
                </div>
            </div>
        </div>
    );
};


export default FloatingIcons;
