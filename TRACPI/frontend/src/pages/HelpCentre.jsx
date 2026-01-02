import React from 'react'

const HelpCentre = () => {
    const socialLinks = [
        { src: '/fbvector.png', link: 'https://www.facebook.com/profile.php/?id=61565947096778' },
        { src: '/ytvector.png', link: 'https://www.youtube.com/@Trackpi' },
        { src: '/instavector.png', link: 'https://www.instagram.com/trackpi_official/' },
        { src: '/mevector.png', link: 'https://medium.com/@trackpi' },
        { src: '/linkedvector.png', link: 'https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all' },
        { src: '/Quoravector.png', link: 'https://www.quora.com/profile/Trackpi-Private-Limited?q=trackpi' },
        { src: '/blogvector.png', link: 'https://www.blogger.com' },
    ];

    return (
        <div className='w-full min-h-screen text-white p-8 md:p-16'>

            <div className='flex flex-col lg:flex-row gap-16'>
                {/* Left Side */}
                <div className='w-full lg:w-1/3 flex flex-col'>
                    <h1 className='text-2xl font-bold mb-12'>FAQ</h1>

                    <div className='space-y-8'>
                        <div>
                            <p className='text-lg font-medium'>For inquiries about our services,</p>
                            <p className='text-lg font-medium'>Please contact us or email us directly.</p>
                        </div>

                        <div className='mt-8'>
                            <h3 className='text-lg font-bold mb-2'>Our Address</h3>
                            <p className='text-xl font-semibold'>Kakkanad, Kochi, India</p>
                            <div className='w-full h-[1px] bg-gray-700 mt-4'></div>
                        </div>

                        <div>
                            <h3 className='text-lg font-bold mb-2'>Phone</h3>
                            <p className='text-xl font-semibold'>+91 8078179646</p>
                            <div className='w-full h-[1px] bg-gray-700 mt-4'></div>
                        </div>

                        <div>
                            <h3 className='text-lg font-bold mb-2'>E-Mail</h3>
                            <p className='text-xl font-semibold'>operations@trackpi.in</p>
                            <div className='w-full h-[1px] bg-gray-700 mt-4'></div>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className='flex gap-4 mt-12'>
                        {socialLinks.map((item, index) => (
                            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className='w-10 h-10'>
                                <img src={item.src} alt="social" className='w-full h-full object-contain' />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right Side */}
                <div className='w-full lg:w-2/3 border border-gray-700 rounded-2xl flex items-center justify-center min-h-[500px] bg-white/5 backdrop-blur-sm'>
                    <h2 className='text-2xl font-bold text-gray-300'>Coming Soon!</h2>
                </div>
            </div>
        </div>
    )
}

export default HelpCentre
