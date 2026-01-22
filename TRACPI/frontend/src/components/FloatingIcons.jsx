import React from 'react';
import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaLinkedinIn,
    FaQuora,
    FaBloggerB,
    FaMediumM,
    FaWhatsapp,
    FaGamepad,
    FaHandsHelping
} from 'react-icons/fa';
import './css/FloatingIcons.css';

const FloatingIcons = () => {
    return (
        <div className="floating-icons-container">
            {/* Left Social Media Icons */}
            <div className="left-social-icons">
                <a href="https://www.instagram.com/trackpi_official" className="social-icon insta"><FaInstagram /></a>
                <a href="https://www.facebook.com/profile.php?id=61565947096778" className="social-icon fb"><FaFacebookF /></a>
                <a href="https://www.youtube.com/@trackpi" className="social-icon yt"><FaYoutube /></a>
                <a href="https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all" className="social-icon ln"><FaLinkedinIn /></a>
                <a href="https://www.quora.com/profile/Trackpi-Private-Limited?q=trackpi" className="social-icon quora"><FaQuora /></a>
                <a href="https://trackpi.blogspot.com/" className="social-icon blogger"><FaBloggerB /></a>
                <a href="https://medium.com/@trackpi" className="social-icon medium"><FaMediumM /></a>
            </div>

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
                </a>
                <div className="action-icon support">
                    <FaHandsHelping />
                </div>
                <div className="action-icon games">
                    <FaGamepad />
                </div>
            </div>
        </div>
    );
};

export default FloatingIcons;
