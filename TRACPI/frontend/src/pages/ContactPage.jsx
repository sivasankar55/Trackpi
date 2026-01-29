import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import FloatingIcons from '../components/FloatingIcons';
import { countries } from '../utils/countries';

import hero from '../assets/hero.png';
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import linkedin from '../assets/linkedIn.png';
import youtube from '../assets/youtube.png';
import mLogo from '../assets/mLogo.png';
import search from '../assets/search.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    location: '',
    hearAboutUs: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.cca2 === 'IN') || countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.hash === '#contact-form') {
      const element = document.getElementById('contact-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    }

    if (!formData.contactNumber || !/^\d{7,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number (7-15 digits).';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    if (!formData.hearAboutUs) {
      newErrors.hearAboutUs = 'Please select an option.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for contactNumber
    if (name === 'contactNumber') {
      // Only allow digits
      const re = /^[0-9\b]+$/;

      // If value is not empty and not digits, ignore
      if (value !== '' && !re.test(value)) {
        return;
      }

      // Enforce max length of 15
      if (value.length > 15) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const submissionData = {
        ...formData,
        contactNumber: `${selectedCountry.phone_code}${formData.contactNumber}`
      };
      await axios.post('http://localhost:5000/api/contact', submissionData);
      setSuccessMessage('Message sent successfully!');
      setFormData({
        fullName: '',
        contactNumber: '',
        email: '',
        location: '',
        hearAboutUs: '',
        message: ''
      });
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  const isFormFocused = location.hash === '#contact-form';

  return (
    <div className={`w-full ${isFormFocused ? '' : 'min-h-screen'} bg-[#2D1D29] overflow-x-hidden`}>
      {!isFormFocused && <FloatingIcons />}

      {/* Hero Section - Only show if form is not focused */}
      {!isFormFocused && (
        <div className="relative w-full h-[223px] sm:h-[320px] md:h-[500px] lg:h-screen">
          <img
            src={hero}
            alt="Contact Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">
              Contact Us
            </h1>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${isFormFocused ? 'py-10' : 'py-16'} ${isFormFocused ? 'flex justify-center' : 'grid grid-cols-1 lg:grid-cols-2'} gap-16`}>

        {/* Left Column: Contact Info - Only show if form is not focused */}
        {!isFormFocused && (
          <div className="text-white space-y-10">
            <div>
              <p className="text-lg mb-2">For inquiries about our services.</p>
              <p className="text-lg">
                Please fill your details or email us directly.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Address</h3>
              <p className="text-xl">Kakkanad, Kochi, India</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Phone Number</h3>
              <p className="text-xl">+91 8078179646</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">E-Mail ID</h3>
              <p className="text-xl break-all">operations@trackpi.in</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 mt-12 flex-wrap">
              <a href="https://www.facebook.com/profile.php/?id=61565947096778" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <img src={facebook} alt="Facebook" className="w-8 h-8" />
              </a>
              <a href="https://www.youtube.com/@Trackpi" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <img src={youtube} alt="Youtube" className="w-8 h-8" />
              </a>
              <a href="https://www.instagram.com/trackpi_official/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <img src={instagram} alt="Instagram" className="w-8 h-8" />
              </a>
              <a href="https://medium.com/@trackpi" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <img src={mLogo} alt="Medium" className="w-8 h-8" />
              </a>
              <a href="https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <img src={linkedin} alt="LinkedIn" className="w-8 h-8" />
              </a>
              <a href="https://trackpi.in/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <img src={search} alt="Search" className="w-8 h-8" />
              </a>
            </div>
          </div>
        )}

        {/* Right Column: Form */}
        <div id="contact-form" className={`bg-transparent ${isFormFocused ? 'w-full max-w-2xl' : ''}`}>
          <h2 className="text-[#FFC100] text-2xl sm:text-3xl md:text-4xl font-bold mb-6 break-words text-center lg:text-left">
            You’re ready to take the next step
          </h2>
          <p className="text-white mb-8 text-center lg:text-left">
            We’re all wrestling with complexity. Every company, work function,
            and team now faces a tall order: to be more adaptive, strategic,
            effective, human, and equitable amidst growing uncertainty.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full max-w-full text-base p-3 rounded-md bg-white text-black outline-none"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}

            <div className="relative flex items-center bg-white rounded-md border-none focus-within:ring-2 focus-within:ring-[#FF9D00] transition-all">
              <div className="relative h-full flex items-center" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 h-[48px] border-r border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <img src={selectedCountry.flag} alt="" className="w-5 h-3 object-cover rounded-sm" />
                  <span className="text-gray-700 text-sm font-medium">{selectedCountry.phone_code}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 max-h-64 bg-white border border-gray-200 rounded-md shadow-2xl z-50 flex flex-col overflow-hidden">
                    <div className="p-2 bg-gray-50 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search country..."
                        className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded outline-none focus:border-[#FF9D00]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="overflow-y-auto custom-scrollbar">
                      {countries.filter(c =>
                        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.phone_code.includes(searchTerm)
                      ).map((country) => (
                        <button
                          key={country.cca2}
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors text-left"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsDropdownOpen(false);
                            setSearchTerm('');
                          }}
                        >
                          <img src={country.flag} alt="" className="w-5 h-3 object-cover rounded-sm" />
                          <span className="flex-1 text-sm truncate">{country.name}</span>
                          <span className="text-xs text-gray-400">{country.phone_code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full text-base p-3 bg-transparent text-black outline-none"
              />
            </div>
            {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}

            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full max-w-full text-base p-3 rounded-md bg-white text-black outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

            <input
              type="text"
              placeholder="Where Are You Located"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full max-w-full text-base p-3 rounded-md bg-white text-black outline-none"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}

            <div className="relative w-full">
              <select
                name="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={handleChange}
                className="w-full max-w-full text-base p-3 pr-10 rounded-md bg-white text-gray-500 outline-none appearance-none truncate"
              >
                <option value="">How Did You Hear About Us?</option>
                <option value="Social Media">Social Media</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current text-gray-500"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            {errors.hearAboutUs && <p className="text-red-500 text-sm mt-1">{errors.hearAboutUs}</p>}

            <textarea
              placeholder="Message"
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full max-w-full text-base p-3 rounded-md bg-white text-black outline-none resize-none"
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}

            {successMessage && (
              <div
                className="w-full p-3 rounded-md mb-4 text-center bg-[#2D1D29] text-[#FF9D00] border border-[#FF9D00]"
              >
                {successMessage}
              </div>
            )}
            <div className="flex flex-col items-center gap-4 mt-6">
              <button className="bg-[#FF9D00] text-white font-bold py-3 px-12 rounded-lg hover:bg-[#e08b00] transition">
                Submit
              </button>
              <p className="text-white text-sm">
                Or email{' '}
                <a href="mailto:hello@trackpi.com" className="text-[#FF9D00]">
                  hello@trackpi.com
                </a>{' '}
                to get in touch with our team.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
