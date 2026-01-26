import React from 'react';
import { Mail, Phone } from 'lucide-react';

function AssessmentMaxAttemptsPopup({ onGoBack }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[2px] px-4">
            <div
                className="relative w-full max-w-[950px] h-auto max-h-[90vh] rounded-[30px] py-[30px] px-[40px] md:py-[40px] md:px-[60px] text-white flex flex-col items-center justify-center overflow-y-auto shadow-2xl"
                style={{
                    background: "linear-gradient(262.57deg, #3F280D 0.01%, #070B20 100.01%)",
                }}
            >
                <div className="relative z-10 flex flex-col items-center text-center w-full">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl md:text-4xl text-white">⚠️</span>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Max Attempts Reached</h2>
                    </div>

                    {/* Message */}
                    <div className="mb-5 max-w-[700px]">
                        <p className="text-base md:text-[20px] font-semibold leading-relaxed">
                            You have reached the maximum number of assessment attempts for this section.
                            <br className="hidden md:block" />
                            Please contact our team to unlock more chances.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-[600px] mb-6">
                        <div className="flex flex-row items-center justify-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                            <Mail className="text-[#FFA000]" size={22} />
                            <span className="text-sm md:text-base font-medium">operations@trackpi.in</span>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                            <Phone className="text-[#FFA000]" size={22} />
                            <span className="text-sm md:text-base font-medium">+91 9538610745</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center w-full">
                        <button
                            onClick={onGoBack}
                            className="w-full md:w-[280px] py-3 rounded-full bg-[#FFA000] text-white font-bold text-base hover:bg-[#FF8F00] transition-all shadow-[0_4px_20px_rgba(255,160,0,0.3)]"
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


