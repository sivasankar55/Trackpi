import React, { useContext, useEffect, useRef, useState }  from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import squareLock from '../assets/square-lock-02.png'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../components/css/WaveAnimation.css'
import { ProgressContext } from '../context/ProgressContext'
import { AuthContext } from '../context/AuthContext'
import AssessmentFirstPopup from './AssessmentFirstPopup'



const WIDTH = 260;
const HEIGHT = 150;
const WAVE_AMPLITUDE = 3;
const WAVE_LENGTH = 80;
const WAVE_SPEED = 1.5;

// assessment
const ASSESSMENT_QUESTIONS = 30;
const ASSESSMENT_TIME = 60; // minutes
const ASSESSMENT_PASS = 25;
const ASSESSMENT_MAX_ATTEMPTS = 5;

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState(0);
  const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);
  const [popupSection, setPopupSection] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(ASSESSMENT_MAX_ATTEMPTS);
  const [sectionProgress, setSectionProgress] = useState({});

  const { token } = useContext(AuthContext)
  const { progressVersion } = useContext(ProgressContext)

  const navigate = useNavigate()
  const scrollRef = useRef(null);
  const pathRef = useRef();
  const pathRefs = useRef({});


    useEffect(() => {
    // Fetch progress for each section
    if (sections.length > 0 && token && selectedCourse) {
      const fetchProgress = async () => {
        const progressMap = {};
        await Promise.all(sections.map(async (section) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/progress/section-progress?courseId=${selectedCourse}&sectionId=${section._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            progressMap[section._id] = res.data.sectionProgress;
          } catch {
            progressMap[section._id] = 0;
          }
        }));
        setSectionProgress(progressMap);
      };
      fetchProgress();
    }
  }, [sections, token, selectedCourse, progressVersion]);

      // Draw the wave path
      const drawWave = (progressValue, phaseValue, pathElement) => {
        const fillLevel = HEIGHT - (progressValue / 100) * HEIGHT;
        let d = `M0,${fillLevel}`;
        for (let x = 0; x <= WIDTH; x += 2) {
          const y =
            fillLevel +
            Math.sin((x / WAVE_LENGTH) * 2 * Math.PI + phaseValue) * WAVE_AMPLITUDE;
          d += ` L${x},${y}`;
        }
        d += ` L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
        if (pathElement) {
            pathElement.setAttribute("d", d);
          }
      };

// Animation loop
useEffect(() => {
  let localPhase = phase;
  let animationFrameId;

  const animate = () => {
    localPhase += 0.04 * WAVE_SPEED;

    Object.entries(sectionProgress).forEach(([sectionId, progressValue]) => {
      const pathElement = pathRefs.current[sectionId];
      if (pathElement) {
        drawWave(progressValue, localPhase, pathElement);
      }
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrameId);
}, [sectionProgress]);


       // Redraw wave if progress changes
   useEffect(() => {
    drawWave(sectionProgress, phase);
    // eslint-disable-next-line
  }, [sectionProgress]);


//fetch course
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedCourse) return;
      // Fetch sections for the selected course
      try {
        const res = await axios.get(`http://localhost:5000/api/sections/by-course?courseId=${selectedCourse}`);
        setSections(res.data);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
        setSections([]);
      }
    };
  
    fetchSections();
  }, [selectedCourse]);

  //fetch attempt left for a section
   const fetchAttemptsLeft = async (sectionId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/progress/section-progress?courseId=${selectedCourse}&sectionId=${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attempts = res.data.assessment?.attempts || 0;
      setAttemptsLeft(ASSESSMENT_MAX_ATTEMPTS - attempts);
    } catch {
      setAttemptsLeft(ASSESSMENT_MAX_ATTEMPTS);
    }
  };

   const handleAssessmentClick = async (section) => {
    setPopupSection(section);
    await fetchAttemptsLeft(section._id);
    setShowAssessmentPopup(true);
  };

    const handleStartAssessment = () => {
    setShowAssessmentPopup(false);
    if (popupSection) {
      navigate(`/assessment/${selectedCourse}/${popupSection._id}`);
    }
  };

  



  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  


  // scroll left and right
  const scroll = (direction) => {
    if(scrollRef.current){
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };


 
  return (
  
     <div className="course-section-wrapper"> 
    <section className='container-search px-5 '>
      <div className='flex justify-between mt-5'>
        <h1 className='text-white font-bold text-2xl roboto'>Courses</h1>
          <div className='relative  '>
            <i className='fa fa-search text-[#B3B6B6] text-[18px] absolute left-3 top-1/2 transform -translate-y-1/2'></i>
              <input 
                  type="search" 
                  name="search" 
                  id="search" 
                  placeholder='Search...'
                  className='rounded-[15px] w-50 px-13.5 py-1.5 text-3 font-medium bg-transparent text-white roboto' 
                  />
          </div>
      </div>
    </section>

    {/* course list section */}
    <div className='relative mt-8 px-5'>
      {/* Left button */}
      <button 
        onClick={() => scroll("left")}
         className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-70 text-white p-2 rounded-full"
      >
        <ChevronLeft size={18} />
      </button>

      <section 
      className='courseList h-[122px] mt-8 flex gap-5 overflow-x-auto no-scrollbar scroll-smooth'
      ref={scrollRef}>
  {
    courses.length > 0 ? (
      courses.map((course) => (
        <div
          key={course._id}
          onClick={() => setSelectedCourse(course._id)}
          className="relative rounded-[10px] border border-[#FF9D00] h-full min-w-[250px] cursor-pointer"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 10, 10, 0) 60%, rgba(10,10,10, 0.94) 85%)',
          }}
        >
          <img src={squareLock} alt="square lock"
            className="absolute inset-0 m-auto w-6 h-6 z-10" />
          <div className="flex justify-between items-end h-full px-3 pb-1 z-20">
            <span className="text-white text-base font-semibold roboto">{course.courseName}</span>
            <span className="text-white roboto text-[10px] font-medium">{Math.floor(course.duration / 60)} hours</span>
          </div>
        </div>
      ))
    ) : (
      <p>No course available</p>
    )
  }
</section>
{/* right button */}
<button onClick={() => scroll('right')}
  className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-70 text-white p-2 rounded-full">
    <ChevronRight size={18} />
</button>
    </div>

    {/* course list ends  */}

   


      {/* progress section */}
    
        {
          sections.length === 0 ? (
            <div>No section found for this course</div>
          ) : (
            <>
            {
              sections.map((section, i) => ((
                <React.Fragment key={section._id}>
                <div className="my-5 px-5 flex justify-between gap-5 lg:justify-end">
                    <button className="rounded-[40px] px-12.5 py-3 bg-[#FF9D00] text-white text-[12px] sm:text-base font-medium cursor-pointer roboto">
                      Courses
                    </button>
                  <button className={`rounded-[40px] px-12.5 py-3 border   font-medium sm:text-base roboto ${sectionProgress[section._id] === 100 ? 'border-[#FF9D00] text-[#FF9D00] cursor-pointer' : 'border-[#FF9D00] text-[#FF9D00]  opacity-50 cursor-not-allowed' }`}
                  disabled={sectionProgress[section._id] !== 100}
                  onClick={() => handleAssessmentClick(section)}>
                    Assessment
                  </button>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                <div
                  key={section._id}
                  onClick={() => navigate(`/courses/${selectedCourse}/sections/${section._id}`)}
                  className="progress-bar-container"
                >
                  <div className="progress-bar relative flex flex-col items-center justify-center py-8">
                    {/* Section number in background */}
                    <span className="absolute top-4 left-4 text-[55px] sm:text-[75px] text-white/10 font-bold z-0 select-none">{i+1}</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white text-center z-10 mb-2">{section.sectionName}</h3>
                    {/* Videos and duration */}
                    <div className="flex items-center justify-center gap-3 text-lg sm:text-xl font-medium text-white z-10">
                      <span>{section.units.length}</span>
                      <span className="mx-1">|</span>
                      <span>{section.duration} 20Min</span>
                    </div>
                    <svg
                      id="wave"
                      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                      width={WIDTH}
                      height={HEIGHT}
                      preserveAspectRatio="none"
                      className="absolute bottom-0 left-0 w-full"
                    >
                      <path   
                      ref={(el) => (pathRefs.current[section._id] = el)}
                      fill="url(#waveGradient)" />
                      <defs>
                        <linearGradient
                          id="waveGradient"
                          x1="0"
                          y1={HEIGHT / 2}
                          x2={WIDTH}
                          y2={HEIGHT / 2}
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.0866666" stopColor="#17005E" />
                          <stop offset="1" stopColor="#FF9D00" />
                        </linearGradient>
                      </defs>
                      </svg>
                  </div>
                </div>
                </div>
                </React.Fragment>
              )))
            }
            </>
          )
        }
        {showAssessmentPopup && popupSection && (
              <AssessmentFirstPopup 
              maxAttempts = {ASSESSMENT_MAX_ATTEMPTS}
              onButtonClick ={handleStartAssessment } />
        )}
  
    </div>
  );
};

export default CourseSection