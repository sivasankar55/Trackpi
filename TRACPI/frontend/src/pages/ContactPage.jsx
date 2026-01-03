import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      toast.success('Message sent successfully!', {
        style: {
          background: '#2D1D29',
          color: '#FF9D00',
          border: '1px solid #FF9D00',
        },
        progressStyle: {
          background: '#FF9D00'
        }
      });
      setFormData({
        fullName: '',
        contactNumber: '',
        email: '',
        location: '',
        hearAboutUs: '',
        message: ''
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message. Please try again.', {
        style: {
          background: '#2D1D29',
          color: '#FF4545',
          border: '1px solid #FF4545',
        }
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#2D1D29]">
      {/* Hero Section */}
      <div className="relative w-full h-[223px] sm:h-[320px] md:h-[500px] lg:h-screen">
        <img
          src={hero}
          alt="Contact Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <h1 className="text-white text-5xl md:text-6xl font-bold">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Contact Info */}
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
            <p className="text-xl">operations@trackpi.in</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 mt-12">
            <a href="#" className="hover:opacity-80">
              <img src={facebook} alt="Facebook" className="w-8 h-8" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src={youtube} alt="Youtube" className="w-8 h-8" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src={instagram} alt="Instagram" className="w-8 h-8" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src={mLogo} alt="Medium" className="w-8 h-8" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src={linkedin} alt="LinkedIn" className="w-8 h-8" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src={search} alt="Search" className="w-8 h-8" />
            </a>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-transparent">
          <h2 className="text-[#FFC100] text-3xl md:text-4xl font-bold mb-6">
            You’re ready to take the next step
          </h2>
          <p className="text-white mb-8">
            We’re all wrestling with complexity. Every company, work function,
            and team now faces a tall order: to be more adaptive, strategic,
            effective, human, and equitable amidst growing uncertainty.
          </p>

          <ToastContainer position="top-right" autoClose={3000} />
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-white text-black outline-none"
            />
            <input
              type="text"
              placeholder="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-white text-black outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-white text-black outline-none"
            />
            <input
              type="text"
              placeholder="Where Are You Located"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-white text-black outline-none"
            />

            <div className="relative">
              <select
                name="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-white text-gray-500 outline-none appearance-none"
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

            <textarea
              placeholder="Message"
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-white text-black outline-none resize-none"
            ></textarea>

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
