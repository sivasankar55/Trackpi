import React from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../assets/square-pen.png'; // ✅ Ensure correct relative path

const EditAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-70">
            <div
                className="w-[730px] h-[541px] p-[50px] rounded-[10px] border border-[#FFF1CF] text-white"
                style={{
                    background: '#FF8200',
                    boxShadow: `
            inset 1px 1px 10px 0px rgba(255, 241, 207, 0.5),
            4px 4px 50px 10px rgba(0, 0, 0, 0.25)
          `,
                    backdropFilter: 'blur(100px)',
                }}
            >
                {/* Title with Icon */}
                <h2 className="text-2xl font-semibold text-center mb-[30px] flex items-center justify-center gap-2">
                    <img src={EditIcon} alt="Edit Icon" className="w-6 h-6" />
                    Edit Admin
                </h2>

                {/* Form Section */}
                <div
                    className="grid grid-cols-2 gap-x-[30px] gap-y-[20px] text-white mx-auto"
                    style={{
                        width: '630px',
                        height: '291px',
                        opacity: 1,
                    }}
                >
                    {/* Username */}
                    <div>
                        <label className="block mb-2 font-medium">Username</label>
                        <input
                            type="text"
                            placeholder="@amywilliam_"
                            className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            placeholder="Amy William"
                            className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 font-medium">Email ID</label>
                        <input
                            type="email"
                            placeholder="amywilliam32@email.com"
                            className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                        />
                    </div>

                    {/* Admin Type */}
                    <div>
                        <label className="block mb-2 font-medium">Admin Type</label>
                        <select className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white focus:outline-none">
                            <option value="">Select admin Type</option>
                            <option value="super">Super Admin</option>
                            <option value="moderator">Moderator</option>
                        </select>
                    </div>

                    {/* Set Password */}
                    <div>
                        <label className="block mb-2 font-medium">Set Password</label>
                        <input
                            type="password"
                            placeholder="amy@123456789#"
                            className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-2 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="amy@123456789#"
                            className="w-full h-[37px] px-[15px] rounded-[5px] border border-[#FFF1CF80] bg-[#FFB30080] text-white placeholder-white focus:outline-none"
                        />
                    </div>
                </div>


                {/* Buttons */}
                <div className="flex justify-between mt-[30px] gap-[30px] w-[630px] mx-auto">
                    {/* Cancel Button */}
                    <button
                        className="w-[300px] h-[46px] px-[122px] rounded-[5px] border border-[#FFF1CF] 
               bg-[#FFB30033] text-white font-semibold 
               shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] transition"
                        onClick={() => navigate(-1)} // Go back on click
                    >
                        Cancel
                    </button>
                    {/* Save Button */}
                    <button
                        className="w-[300px] h-[46px] px-[93px] rounded-[5px] 
             border border-[#FFF1CF] bg-[#FFB300] 
             text-white font-semibold 
             shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)] 
             transition"
                    >
                        Save Changes
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EditAdmin;
