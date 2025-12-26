import React from 'react'

const Discoverus = () => {
  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[url('/bg.png')] bg-cover bg-center px-4 md:relative md:-left-6 md:-top-8">

        {/* Left Side */}
        <div className="leftside mt-12 md:mt-48 ml-0 md:ml-24 w-full md:w-[768px] h-auto md:h-[611px]">
          <div className="header w-full md:w-[768px] h-auto md:h-[147px] flex flex-col justify-between p-0.5 box-border">
            <div className="h1div w-full md:w-[628px] h-auto">
              <h1 className="text-[26px] md:text-[60px] font-bold text-white font-[Montserrat]">
                Welcome to <span className="text-yellow-600">TrackPi</span>
              </h1>
            </div>
            <div className="h2div w-full md:w-[700px] h-auto">
              <h2 className="text-[18px] md:text-[42px] mt-2 font-raleway font-semibold whitespace-nowrap text-white">
                Your strategic Growing partner
              </h2>
            </div>
          </div>

          <p className="text-[18px] md:text-[22px] mt-5 leading-relaxed font-roboto font-medium text-white">
            Trackpi is one of the best business consulting firms in Kerala. We have a highly experienced team that develops strategies to promote growth and development. With our expert consulting services, we help businesses thrive in a competitive environment.
          </p>

          <p className="text-[18px] md:text-[22px] mt-5 font-roboto font-medium text-white">
            Trackpi is building Kerala’s largest freelance community, where anyone can join instantly upon completing their freelance course. Focused on innovation and client-centric excellence, Trackpi empowers businesses and individuals for sustainable success.
          </p>
          <div className="button-group mt-7 flex flex-wrap sm:flex-nowrap justify-center sm:justify-start gap-5 w-full sm:w-auto">
            <button className="bg-yellow-600 px-4 md:px-6 py-3 rounded-md font-bold text-white hover:bg-yellow-700 transition whitespace-nowrap">
              Let's Connect
            </button>
            <button className="bg-yellow-600 px-4 md:px-6 py-3 rounded-md font-bold text-white hover:bg-yellow-700 transition whitespace-nowrap">
              Company Brochure
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="rightside w-full md:w-[568px] h-auto md:h-[611px] mt-12 md:mt-48 flex items-center justify-center overflow-hidden">
          {/* Desktop Image Cluster */}
          <div className="hidden md:block relative w-full h-full">
            <img
              src="/img3.png"
              alt="Person 3"
              className="absolute top-[230px] left-[250px] w-[308px] h-[300px] rounded-full border-4 border-transparent object-cover z-[10]"
            />
            <img
              src="/img2.png"
              alt="Person 2"
              className="absolute top-0 left-[250px] w-[308px] h-[300px] rounded-full border-4 border-transparent object-cover z-[20]"
            />
            <img
              src="/img1.png"
              alt="Person 1"
              className="absolute top-[110px] right-[240px] w-[308px] h-[300px] rounded-full border-4 border-transparent object-cover z-[30]"
            />
          </div>

          {/* Mobile Image Cluster */}
          <div className="md:hidden relative w-[393px] mt-2.5  translate-y-[-9px] ">
            <div className="flex items-center justify-center w-[393px] h-[120px] ">
              <img
                src="/img1.png"
                alt="Person 1"
                className="w-[130px] h-[130px] rounded-full border-4 border-transparent object-cover z-30"
              />
              <img
                src="/img2.png"
                alt="Person 2"
                className="-ml-6 w-[130px] h-[130px] rounded-full border-4 border-transparent object-cover z-20"
              />
              <img
                src="/img3.png"
                alt="Person 3"
                className="-ml-6 w-[130px] h-[130px] rounded-full border-4 border-transparent object-cover z-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}


      {/* Social Section */}
      <div className="w-full max-w-[1512px] h-auto relative px-4 ">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-4 text-center pt-6">
          Our Social Networks
        </h2>

        <>
          {/* Desktop View */}
          <div className="hidden md:flex relative w-full justify-center mt-10">
            <div className="relative w-full md:w-[1200px] h-auto flex flex-wrap gap-[12.3px] justify-center">
              {[
                {
                  href: 'https://www.facebook.com/profile.php/?id=61565947096778',
                  src: '/fbvector.png',
                  label: 'Facebook',
                  borderColor: 'blue-600',
                  bgHover: 'bg-blue-600',
                  textColor: 'text-blue-600'
                },
                {
                  href: 'https://www.instagram.com/trackpi_official/',
                  src: '/instavector.png',
                  label: 'Instagram',
                  borderColor: 'pink-600',
                  bgHover: 'bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500',
                  textColor: 'bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent'
                },
                {
                  href: 'https://www.youtube.com/@Trackpi',
                  src: '/ytvector.png',
                  label: 'Youtube',
                  borderColor: 'red-600',
                  bgHover: 'bg-red-600',
                  textColor: 'text-red-600'
                },
                {
                  href: 'https://trackpi.in/',
                  src: '/trackvector.png',
                  label: 'Trackpi',
                  borderColor: 'yellow-600',
                  bgHover: 'bg-yellow-600',
                  textColor: 'text-yellow-600'
                },
                {
                  href: 'https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all',
                  src: '/linkedvector.png',
                  label: 'Linkedin',
                  borderColor: 'blue-400',
                  bgHover: 'bg-blue-400',
                  textColor: 'text-blue-400'
                },
                {
                  href: 'https://medium.com/@trackpi',
                  src: '/mevector.png',
                  label: 'Medium',
                  borderColor: 'black',
                  bgHover: 'bg-black',
                  textColor: 'text-black'
                },
                {
                  href: 'https://www.quora.com/profile/Trackpi-Private-Limited?q=trackpi',
                  src: '/Quoravector.png',
                  label: 'Quora',
                  borderColor: 'red-800',
                  bgHover: 'bg-red-800',
                  textColor: 'text-red-800'
                },
                {
                  href: 'https://www.blogger.com',
                  src: '/blogvector.png',
                  label: 'Blogger',
                  borderColor: 'orange-400',
                  bgHover: 'bg-orange-400',
                  textColor: 'text-orange-300'
                }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={`
          relative flex items-center
          w-[123px] h-[123px]
          bg-black
          rounded-full
          overflow-hidden
          transition-all duration-300
          group
          hover:w-[250px] hover:rounded-full
          hover:bg-white
          hover:border-4 hover:border-${social.borderColor}
          cursor-pointer
        `}
                  >
                    <div
                      className={`
            w-[123px] h-[123px]
            flex items-center justify-center
            bg-black group-hover:${social.bgHover}
            rounded-full
            transition-all duration-300
            translate-x-[30px] group-hover:translate-x-0
          `}
                    >
                      <img
                        src={social.src}
                        alt={social.label}
                        className={`
              object-contain transition-all duration-300
              ${social.label === 'Instagram' ? 'ml-[8px]' :
                            social.label === 'Trackpi' ? 'mr-[8px]' :
                              social.label === 'Medium' ? 'mr-[4px]' :
                                social.label === 'Quora' ? 'mr-[12px]' :
                                  ''
                          }
              ${social.label === 'Blogger' ? 'w-[48px] h-[48px]' : 'w-[60px] h-[60px]'
                          }
            `}
                      />
                    </div>
                    <span
                      className={`
            ml-0
            ${social.textColor}
            font-medium
            opacity-0
            group-hover:opacity-100
            group-hover:ml-4
            transition-all duration-300
          `}
                    >
                      {social.label}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden relative w-full justify-center mt-10">
            <div className="relative mx-auto" style={{ width: "313px", height: "auto" }}>

              {/* Row Template */}
              <div className="flex flex-col gap-5">
                {/* Row 1: Facebook & Instagram */}
                <div className="flex flex-col gap-[20px] ml-[70px]">
                  {/* Row 1: Facebook & Instagram */}
                  <div className="flex gap-[20px]">
                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/profile.php/?id=61565947096778"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-blue-600 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-blue-600 rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/fbvector.png" alt="Facebook" className="w-[24px] h-[24px] object-contain pointer-events-none" />
                      </div>
                      <span className="ml-0 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        Facebook
                      </span>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/trackpi_official/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-pink-600 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/instavector.png" alt="Instagram" className="w-[24px] h-[24px] object-contain" />
                      </div>
                      <span className="ml-0 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        Instagram
                      </span>
                    </a>
                  </div>

                  {/* Row 2: YouTube & Trackpi */}
                  <div className="flex gap-[20px]">
                    {/* YouTube */}
                    <a
                      href="https://www.youtube.com/@Trackpi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-red-600 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-red-600 rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/ytvector.png" alt="YouTube" className="w-[24px] h-[24px] object-contain" />
                      </div>
                      <span className="ml-0 text-red-600 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        YouTube
                      </span>
                    </a>

                    {/* Trackpi */}
                    <a
                      href="https://trackpi.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-yellow-600 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-yellow-600 rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/trackvector.png" alt="Trackpi" className="w-[24px] h-[24px] object-contain" />
                      </div>
                      <span className="ml-0 text-yellow-600 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        Trackpi
                      </span>
                    </a>
                  </div>

                  {/* Row 3: LinkedIn & Medium */}
                  <div className="flex gap-[20px]">
                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-blue-400 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-blue-400 rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/linkedvector.png" alt="LinkedIn" className="w-[24px] h-[24px] object-contain" />
                      </div>
                      <span className="ml-0 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        LinkedIn
                      </span>
                    </a>

                    {/* Medium */}
                    <a
                      href="https://medium.com/@trackpi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-black cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-black rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/mevector.png" alt="Medium" className="w-[24px] h-[24px] object-contain" />
                      </div>
                      <span className="ml-0 text-black text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        Medium
                      </span>
                    </a>
                  </div>

                  {/* Row 4: Quora & Blogger */}
                  <div className="flex gap-[20px]">
                    {/* Quora */}
                    <a
                      href="https://www.quora.com/profile/Trackpi-Private-Limited?q=trackpi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-red-800 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-red-800 rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/Quoravector.png" alt="Quora" className="w-[24px] h-[24px] object-contain" />
                      </div>
                      <span className="ml-0 text-red-800 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        Quora
                      </span>
                    </a>

                    {/* Blogger */}
                    <a
                      href="https://www.blogger.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[60px] w-[60px] bg-black rounded-full overflow-hidden transition-all duration-300 group hover:w-[140px] hover:bg-white hover:border-4 hover:border-orange-400 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-[60px] h-[60px] bg-black group-hover:bg-orange-400 rounded-full transition-all duration-300 flex-shrink-0">
                        <img src="/blogvector.png" alt="Blogger" className="w-[24px] h-[24px] object-contain" />
                      </div>
                      <span className="ml-0 text-orange-400 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
                        Blogger
                      </span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </>



      </div>

      <div className="relative w-full max-w-[1512px] mx-auto overflow-x-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/chessmain.png')",
            filter: 'brightness(25%)',
            zIndex: 0,
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 pt-10 md:pt-[125px] w-full">
          <div className="w-full max-w-[1512px] px-4 sm:px-6 md:px-8 lg:px-[70px] mx-auto">
            <div className="w-full flex flex-col gap-[40px] md:gap-[80px] lg:gap-[100px]">
              {/* Our Commitment Section */}
              <div className="w-full flex flex-col lg:flex-row justify-between gap-[28px]">
                <div className="w-full lg:w-[762px] flex flex-col gap-[28px]">
                  <h2 className="w-full flex justify-center lg:justify-start items-center text-[24px] sm:text-[28px] md:text-[38px] lg:text-[46px] font-bold font-roboto text-white leading-none text-center lg:text-left whitespace-nowrap overflow-hidden text-ellipsis">
                    <span>Our Commitment</span>
                    <span className="ml-1 sm:ml-2 font-raleway font-semibold text-orange-400">– Our Mission</span>
                  </h2>

                  <p className="px-4 sm:px-6 md:px-8 text-white text-[18px] md:text-[24px] font-roboto font-medium leading-[32px] md:leading-[40px] text-justify capitalize mb-0">
                    Trackpi Private Limited Is Dedicated To Empowering Businesses By Providing Strategic Insights, Innovative Solutions, And Hands-On Support To Drive Sustainable Growth And Operational Excellence. Through Services Such As Market Research, Digital Strategy, And Sales Outsourcing, Trackpi Aims To Enhance Business Performance, Optimize Processes, And Build Long-Term Partnerships. The Company Is Committed To Delivering Tailored Strategies That Help Businesses Adapt, Compete, And Thrive In A Dynamic Marketplace. Additionally, Trackpi Is Focused On Nurturing Talent By Fostering Kerala’s Largest Freelance Community, Providing Aspiring Freelancers With The Skills And Opportunities To Succeed In The Digital Economy.
                  </p>
                </div>
                <div className="w-full lg:w-[550px] h-[300px] md:h-[500px]">
                  <img src="/chess img1.png" alt="Our Mission" className="w-full h-full object-cover rounded-md mb-0" />
                </div>
              </div>

              {/* Our Aspiration Section */}
              <div className="w-full flex flex-col-reverse lg:flex-row justify-between gap-[60px]">
                <div className="w-full lg:w-[550px] h-[300px] md:h-[500px] rounded-[15px] overflow-hidden">
                  <img src="/brick img.png" alt="Vision Visual" className="w-full h-full object-cover mb-0" />
                </div>
                <div className="w-full lg:w-[762px] flex flex-col gap-[28px] items-center lg:items-start">
                  <h2 className="text-[24px] sm:text-[28px] md:text-[38px] lg:text-[48px] font-bold font-roboto text-white flex justify-center lg:justify-start items-center text-center lg:text-left whitespace-nowrap overflow-hidden text-ellipsis">
                    <span>Our Aspiration</span>
                    <span className="ml-1 sm:ml-2 font-raleway font-semibold text-orange-400">– Our Vision</span>
                  </h2>
                  <p className="px-4 sm:px-6 md:px-8 text-white text-[18px] md:text-[24px] font-roboto font-medium leading-[32px] md:leading-[40px] text-justify capitalize mb-0">
                    Trackpi Envisions Itself As A Leading Strategic Growth Partner, Helping Businesses Navigate Challenges And Achieve Long-Term Success Through Innovation, Expertise, And Client-Focused Solutions. The Company Strives To Be At The Forefront Of Business Transformation, Continuously Evolving To Meet Market Demands And Create Impactful Solutions. By Fostering A Collaborative And Knowledge-Driven Ecosystem, Trackpi Aims To Empower Businesses And Individuals Alike, Positioning Itself As A Key Player In Driving Economic Growth And Professional Development Across Industries.
                  </p>
                </div>
              </div>

              {/* Our Standards Section */}
              <div className="w-full flex flex-col lg:flex-row justify-between gap-[60px]">
                <div className="w-full lg:w-[742px] flex flex-col justify-start gap-[28px]">
                  <h2 className="text-[24px] sm:text-[28px] md:text-[38px] lg:text-[48px] font-bold font-roboto text-white flex justify-center lg:justify-start items-center text-center lg:text-left capitalize whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="mr-1 sm:mr-2">Our Standards</span>
                    <span className="font-raleway font-semibold text-orange-400">– Our Values</span>
                  </h2>
                  <ul className="list-disc pl-6 text-white font-roboto text-[18px] md:text-[24px] leading-[32px] md:leading-[36px] capitalize text-justify space-y-2 mb-0">
                    <li><strong>Empowerment</strong> – Helping businesses grow with strategic insights and support.</li>
                    <li><strong>Innovation</strong> – Encouraging new technologies and creative solutions.</li>
                    <li><strong>Sustainability</strong> – Promoting responsible growth that benefits both people and the planet.</li>
                    <li><strong>Client-Centric Excellence</strong> – Delivering tailored solutions with a focus on long-term success.</li>
                    <li><strong>Community Development</strong> – Building Kerala’s largest freelance community and fostering talent.</li>
                  </ul>
                </div>
                <div className="w-full lg:w-[570px] h-[300px] md:h-[500px]">
                  <img src="/values img.png" alt="Our Values" className="w-full h-full object-cover rounded-[15px] mb-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div
        className="w-auto  sm:w-[1512px] h-[50.28px] sm:h-[120px] overflow-x-auto whitespace-nowrap scroll-smooth flex items-center gap-[20px] px-4 snap-x snap-mandatory mt-0 md:mt-[90px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Firefox/IE
      >
        {/* Hide scrollbar for WebKit browsers */}
        <style jsx>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>

        {[...Array(3)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="w-[75.42px] h-[33.52px] sm:w-[180px] sm:h-[80px] bg-white rounded-md flex items-center justify-center snap-start shrink-0">
              <img
                src="/IIDM.png"
                alt="IIDM"
                className="w-[41.9px] h-[41.9px] sm:w-[100px] sm:h-[100px]"
              />
            </div>

            <div className="w-[75.42px] h-[33.52px] sm:w-[180px] sm:h-[80px] bg-white rounded-md flex items-center justify-center snap-start shrink-0">
              <img
                src="/Techmindz.png"
                alt="Techmindz"
                className="w-[41.9px] h-[41.9px] sm:w-[100px] sm:h-[100px]"
              />
            </div>

            <div className="w-[75.42px] h-[33.52px] sm:w-[180px] sm:h-[80px] bg-white rounded-md flex items-center justify-center snap-start shrink-0">
              <img
                src="/Luminar.png"
                alt="Luminar"
                className="w-[41.9px] h-[41.9px] sm:w-[100px] sm:h-[100px]"
              />
            </div>

            <div className="w-[75.42px] h-[33.52px] sm:w-[180px] sm:h-[80px] bg-white rounded-md flex items-center justify-center snap-start shrink-0">
              <img
                src="/trademaxacademy.png"
                alt="Trademax Academy"
                className="w-[41.9px] h-[41.9px] sm:w-[100px] sm:h-[100px]"
              />
            </div>
          </React.Fragment>
        ))}
      </div>



    </div>

  )
}

export default Discoverus