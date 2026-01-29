import React from 'react';
import { Mail, Phone, AlertTriangle } from 'lucide-react';

function AssessmentMaxAttemptsPopup({ onGoBack }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-[4px] px-4">
            <div
                className="relative w-full max-w-[500px] md:max-w-[950px] h-auto rounded-[30px] p-8 md:py-[40px] md:px-[60px] text-white flex flex-col items-center justify-center overflow-y-auto shadow-2xl"
                style={{
                    background: "linear-gradient(262.57deg, #3F280D 0.01%, #070B20 100.01%)",
                }}
            >
                <div className="relative z-10 flex flex-col items-center text-center w-full">
                    {/* Icon and Title */}
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                        <AlertTriangle className="text-[#FFB700] w-12 h-12 md:w-16 md:h-16" />
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Max Attempts Reached</h2>
                    </div>

                    {/* Message */}
                    <div className="mb-8 w-full max-w-[700px] px-2">
                        <p className="text-sm md:text-xl font-medium leading-relaxed text-gray-200">
                            You have reached the maximum number of assessment attempts for this section.
                            <br className="hidden md:block mt-2" />
                            Please contact our team to unlock more chances.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-[700px] mb-8">
                        <div className="flex flex-row items-center justify-start md:justify-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 w-full hover:bg-white/10 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-[#FFB700]/10 flex items-center justify-center shrink-0">
                                <Mail className="text-[#FFB700]" size={20} />
                            </div>
                            <span className="text-[13px] md:text-base font-semibold truncate">operations@trackpi.in</span>
                        </div>
                        <div className="flex flex-row items-center justify-start md:justify-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 w-full hover:bg-white/10 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-[#FFB700]/10 flex items-center justify-center shrink-0">
                                <Phone className="text-[#FFB700]" size={20} />
                            </div>
                            <span className="text-sm md:text-base font-semibold">+91 9538610745</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="w-full flex justify-center">
                        <button
                            onClick={onGoBack}
                            className="w-full md:w-[280px] py-4 rounded-full bg-[#FFB700] text-black font-extrabold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,183,0,0.3)] cursor-pointer"
                        >
                            Go to Course Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssessmentMaxAttemptsPopup;


