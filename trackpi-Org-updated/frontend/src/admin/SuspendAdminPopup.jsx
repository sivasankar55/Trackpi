import React from "react";

const SuspendAdminPopup = ({ onCancel, onConfirm }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-70 fixed inset-0 z-50">
            <div
                className="text-white flex flex-col gap-[20px]"
                style={{
                    width: '511px',
                    height: '415px',
                    padding: '50px',
                    borderRadius: '10px',
                    border: '1px solid #FFB300',
                    background: '#FF8200',
                    boxShadow: `
            inset 1px 1px 10px 0px #FFF1CF80,
            4px 4px 50px 10px rgba(0, 0, 0, 0.25)
          `,
                    backdropFilter: 'blur(100px)',
                }}
            >

                {/* Header */}
                <div
                    className="flex flex-col items-center justify-center text-center gap-[10px]"
                    style={{
                        width: '411px',
                        height: '92px',
                    }}
                >
                    <div className="text-2xl font-semibold flex items-center gap-2">
                        <span role="img" aria-label="alert">🔴</span>
                        Confirm Suspend
                    </div>
                    <p className="text-base mt-1">
                        Are you sure you want to suspend the selected user?
                    </p>
                </div>

                {/* Set Duration */}
                <div
                    className="flex justify-between items-center mx-auto"
                    style={{
                        width: '390px',
                        height: '24px',
                        opacity: 1,
                    }}
                >
                    <label className="text-lg font-semibold">Set Duration</label>
                    <button className="px-3 py-1 bg-[#FFB30080] border border-[#FFF1CF] rounded text-sm text-white" > Set </button>
                </div>

                {/* Password Field */}
                <div
                    style={{
                        width: '300px',
                        height: '37px',
                        opacity: 1,
                    }}
                    className="mx-auto"
                >
                    <input type="password" placeholder="Enter Password" className="w-full h-full px-[15px] py-[8px] rounded-[5px]  border border-[#FFF1CF80] bg-[#FFB30080]  text-white placeholder-white focus:outline-none" />
                </div>

                <div
                    className="flex items-center gap-[10px] opacity-100 mx-auto"
                    style={{
                        width: '391px',
                        height: '36px',
                    }}
                >
                    <input
                        type="checkbox"
                        id="suspendConfirm"
                        className="w-5 h-5 accent-[#FFB300]"
                    />
                    <label htmlFor="suspendConfirm" className="text-lg text-white">
                        I understand this will suspend this user.
                    </label>
                </div>

                <div className="flex justify-between items-center w-[411px] mx-auto gap-[131px] mt-2">
                    {/* Cancel */}
                    <button
                        onClick={() => navigate(-1)}
                        className="w-[120px] h-[46px] px-[35px] py-[5px] rounded-[5px] border border-[#FFF1CF] bg-[#FFB30080] 
                     text-white font-semibold shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)]" >Cancel
                    </button>

                    {/* Suspend */}
                    <button
                        onClick={onConfirm}
                        className="w-[140px] h-[46px] px-[35px] rounded-[5px] 
                        border border-[#FFB9B9] bg-[#FF000099] 
                       text-white font-semibold shadow-[0px_0px_10px_1px_rgba(10,10,10,0.25)]" >Suspend
                    </button>

                </div>
            </div>
        </div>
    );
};

export default SuspendAdminPopup;
