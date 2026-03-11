import React from 'react';
import FloatingIcons from '../components/FloatingIcons';
import sivasankarImg from '../creators/Sivasankar.png';
import akhilImg from '../creators/akhil.png';
import althafImg from '../creators/althaf.png';

const Creators = () => {
    const teamMembers = [
        {
            name: "Sivasankar",
            image: sivasankarImg,
            role: "MERN Stack Developer"
        },
        {
            name: "Akhil",
            image: akhilImg,
            role: "MERN Stack Developer"
        },
        {
            name: "Mohammed Althaf ",
            image: althafImg,
            role: "MERN Stack Developer"
        }
    ];

    return (
        <div className="bg-[#0f050f] min-h-screen font-sans text-white relative overflow-hidden flex flex-col items-center py-20 px-4">
            <FloatingIcons />

            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#120812] via-[#1a0f1a] to-[#2d122d] opacity-95 z-0" />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFB200]/10 blur-[120px] rounded-full z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFB200]/5 blur-[120px] rounded-full z-0" />

            {/* Content Wrapper */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-libre tracking-[0.2em] uppercase mb-4 text-white drop-shadow-lg">
                        Developers
                    </h1>
                    <div className="w-24 h-1.5 bg-[#FFB200] mx-auto rounded-full shadow-[0_0_15px_rgba(255,178,0,0.5)]" />
                </div>

                {/* Team Grid - Centered Using Flex */}
                <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center w-full sm:w-[calc(50%-24px)] lg:w-[calc(33.33%-44px)] max-w-[320px]"
                        >
                            {/* Member Image Container with Glassmorphism Border */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_25px_60px_rgba(255,178,0,0.15)] group-hover:border-[#FFB200]/30">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale transition-all duration-1000 ease-out transform scale-100 group-hover:scale-110 group-hover:grayscale-0"
                                />

                                {/* Hover Glow Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-[#FFB200]/20 via-transparent to-transparent pointer-events-none" />

                                {/* Gradient bottom overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Info Section */}
                            <div className="space-y-2 text-center">
                                <h3 className="text-2xl md:text-3xl font-bold font-libre text-[#FFB200] tracking-wide transition-colors duration-300 group-hover:text-white">
                                    {member.name}
                                </h3>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-10 h-[1px] bg-gray-600 group-hover:bg-[#FFB200] transition-colors duration-300" />
                                    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                                        {member.role}
                                    </p>
                                    <div className="w-10 h-[1px] bg-gray-600 group-hover:bg-[#FFB200] transition-colors duration-300" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Styles for Libre Baskerville if needed */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
                .font-libre { font-family: 'Libre Baskerville', serif; }
            `}} />
        </div>
    );
}

export default Creators;
