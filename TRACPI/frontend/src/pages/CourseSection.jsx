import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import squareLock from '../assets/square-lock-02.png'
import { Link, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import '../components/css/WaveAnimation.css'
import { ProgressContext } from '../context/ProgressContext'
import { AuthContext } from '../context/AuthContext'
import AssessmentFirstPopup from './AssessmentFirstPopup'
import AssessmentMaxAttemptsPopup from './AssessmentMaxAttemptsPopup'
import CourseDetailPopup from '../components/CourseDetailPopup'
import '../components/css/CourseDetailPopup.css'
import techThumb from '../assets/tech.jpg'



const WIDTH = 260;
const HEIGHT = 150;
const WAVE_AMPLITUDE = 3;
const WAVE_LENGTH = 80;
const WAVE_SPEED = 1.5;

// assessment
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
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentCourseName, setCurrentCourseName] = useState("");
  const [sectionProgress, setSectionProgress] = useState({});
  const [sectionStatus, setSectionStatus] = useState({}); // Tracking passed status
  const [timeLimit, setTimeLimit] = useState(60);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showMaxAttemptsPopup, setShowMaxAttemptsPopup] = useState(false);
  const [detailCourse, setDetailCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');

  const { token } = useContext(AuthContext)
  const { progressVersion } = useContext(ProgressContext)

  const { courseId: routeCourseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate()
  const scrollRef = useRef(null);
  const pathRef = useRef();
  const pathRefs = useRef({});


  useEffect(() => {
    // Fetch progress for each section
    if (sections.length > 0 && token && selectedCourse) {
      const fetchProgress = async () => {
        const progressMap = {};
        const statusMap = {};
        await Promise.all(sections.map(async (section) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/progress/section-progress?courseId=${selectedCourse}&sectionId=${section._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            progressMap[section._id] = res.data.sectionProgress;
            statusMap[section._id] = {
              passed: res.data.assessmentPassed || false,
              completed: res.data.sectionComplete || false
            };
          } catch {
            progressMap[section._id] = 0;
            statusMap[section._id] = { passed: false, completed: false };
          }
        }));
        setSectionProgress(progressMap);
        setSectionStatus(statusMap);
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


  // Animation loop is handled above with individual section monitoring


  //fetch course
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = token
          ? 'http://localhost:5000/api/progress/courses-status'
          : 'http://localhost:5000/api/courses';

        const res = await axios.get(url, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

        console.log("Fetched raw courses data:", res.data);

        // Handle both formats (normal courses vs courses-status)
        const coursesData = (token && Array.isArray(res.data))
          ? res.data.map(c => ({
            _id: c.courseId,
            courseName: c.courseName,
            duration: c.duration || 300,
            isUnlocked: c.isUnlocked,
            isCompleted: c.isCompleted,
            courseImage: c.courseImage
          }))
          : (Array.isArray(res.data) ? res.data : []);

        console.log("Transformed coursesData:", coursesData);
        setCourses(coursesData);

        if (routeCourseId) {
          setSelectedCourse(routeCourseId);
        } else if (coursesData.length > 0) {
          setSelectedCourse(coursesData[0]._id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [routeCourseId, token, progressVersion]); // Refetch when progress changes

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

  const allSectionsComplete = sections.length > 0 && sections.every(s => {
    const progress = sectionProgress[s._id] || 0;
    return progress >= 100;
  });
  const hasAnyCompletedSection = Object.values(sectionProgress).some(p => p >= 100);

  // Auto-open assessment if redirected from SectionVideos
  useEffect(() => {
    if (location.state?.openAssessment && sections.length > 0) {
      setActiveTab('assessment');
      const targetSection = [...sections].reverse().find(s => (sectionProgress[s._id] || 0) >= 100) || sections[sections.length - 1];
      if (targetSection) {
        handleAssessmentClick(targetSection);
        // Clear state so it doesn't reopen on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [sections, location.state, sectionProgress]);

  //fetch attempt left for a section
  const fetchAttemptsLeft = async (sectionId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/progress/section-progress?courseId=${selectedCourse}&sectionId=${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attempts = res.data.assessment?.attempts || 0;
      const totalAllowed = res.data.assessment?.maxAttempts || 5;

      // Format as "Used / Total" (e.g., "5/10")
      setAttemptsLeft(`${attempts}/${totalAllowed}`);

      setNumQuestions(res.data.numQuestions || 0);
      setCurrentCourseName(res.data.courseName || "");
      console.log("Fetched section progress, timeLimit:", res.data.timeLimit);
      setTimeLimit(res.data.timeLimit || 60);
    } catch {
      setAttemptsLeft(`0/5`);
      setNumQuestions(0);
      setCurrentCourseName("");
      setTimeLimit(60);
    }
  };

  const handleAssessmentClick = async (section) => {
    setPopupSection(section);
    await fetchAttemptsLeft(section._id);
    setShowAssessmentPopup(true);
  };

  const handleStartAssessment = () => {
    // Check if attempts are exhausted
    // attemptsLeft is in format "Used/Total"
    const [used, total] = String(attemptsLeft).split('/').map(Number);
    if (used >= total) {
      setShowMaxAttemptsPopup(true);
      return;
    }

    setShowAssessmentPopup(false);
    if (popupSection) {
      navigate(`/assessment/${selectedCourse}/${popupSection._id}`);
    }
  };





  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;



  // scroll left and right
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };



  return (

    <div className="course-section-wrapper">
      <section className='container-search px-5 '>
        <div className='flex justify-between mt-5'>
          <h1 className='text-white font-bold text-2xl roboto'>Courses</h1>
          <div className='relative '>
            <i className='fa fa-search text-[#B3B6B6] text-[18px] absolute left-3 top-1/2 transform -translate-y-1/2'></i>
            <input
              type="search"
              name="search"
              id="search"
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='rounded-[15px] w-50 px-13.5 py-1.5 text-3 font-medium bg-transparent text-white roboto border border-[#333] focus:border-[#FF9D00] outline-none'
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
              courses.map((course, index) => {
                const isUnlocked = course.isUnlocked !== undefined ? course.isUnlocked : (index === 0);
                return (
                  <div
                    key={course._id}
                    onClick={async () => {
                      if (!isUnlocked) return;

                      // Set selected course for sections grid
                      setSelectedCourse(course._id);

                      // Fetch full course details for the popup
                      try {
                        const res = await axios.get(`http://localhost:5000/api/courses/${course._id}`);
                        setDetailCourse(res.data);
                        setShowDetailPopup(true);
                      } catch (error) {
                        console.error("Error fetching course details:", error);
                        // Fallback to basic info if fetch fails
                        setDetailCourse(course);
                        setShowDetailPopup(true);
                      }
                    }}
                    className={`relative rounded-[10px] border ${selectedCourse === course._id ? 'border-[#FF9D00]' : 'border-[#333]'} h-full min-w-[250px] overflow-hidden transition-all duration-300 hover:scale-105 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(10, 10, 10, 0) 40%, rgba(10,10,10, 0.9) 80%), url(${course.courseImage || techThumb})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center">
                        <img src={squareLock} alt="square lock" className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex justify-between items-end h-full px-3 pb-2 z-20 relative">
                      <span className="text-white text-base font-semibold roboto truncate pr-2">{course.courseName}</span>
                      <span className="text-white roboto text-[10px] font-medium whitespace-nowrap bg-black/40 px-2 py-0.5 rounded">
                        {course.duration ? (typeof course.duration === 'string' ? course.duration : `${Math.floor(course.duration / 60)} Hours`) : '0 hours'}
                      </span>
                    </div>
                  </div>
                );
              })
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




      {/* Toggle Buttons (Courses / Assessment) */}
      {!loading && sections.length > 0 && (
        <div className="my-5 px-5 flex justify-between gap-5 lg:justify-end">
          <button
            className={`rounded-[40px] px-12.5 py-3 font-medium sm:text-base roboto transition-all ${activeTab === 'courses' ? 'bg-[#FF9D00] text-white shadow-[0_4px_15px_rgba(255,157,0,0.2)]' : 'border border-[#FF9D00] text-[#FF9D00] hover:bg-[#FF9D00]/10'}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            className={`rounded-[40px] px-12.5 py-3 font-medium sm:text-base roboto transition-all ${activeTab === 'assessment'
              ? 'bg-[#FF9D00] text-white shadow-[0_4px_15px_rgba(255,157,0,0.2)]'
              : allSectionsComplete
                ? 'border border-[#FF9D00] text-[#FF9D00] hover:bg-[#FF9D00]/10'
                : 'opacity-50 cursor-not-allowed border border-[#FF9D00] text-[#FF9D00]'
              }`}
            onClick={() => {
              if (!allSectionsComplete) {
                alert("Please complete all sections to unlock the final assessment.");
                return;
              }
              setActiveTab('assessment');
              const lastSection = sections[sections.length - 1];
              if (lastSection) {
                handleAssessmentClick(lastSection);
              }
            }}
          >
            Assessment
          </button>
        </div>
      )}

      {/* Sections Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-5 mb-10'>
        {sections.filter(s => s.sectionName.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
          <div className="col-span-full text-center text-white py-20">No sections found matching "{searchQuery}"</div>
        ) : (
          sections
            .filter(s => s.sectionName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((section, i) => {
              const isFirst = i === 0;
              const status = sectionStatus[section._id] || { passed: false, completed: false };

              // A section is unlocked if:
              // 1. It's the first section of the course
              // 2. The previous section was passed
              // 3. The user has already started/watched content in this section (fallback)
              const prevSectionId = i > 0 ? sections[i - 1]._id : null;
              const prevStatus = prevSectionId ? sectionStatus[prevSectionId] : null;
              const currentProgress = sectionProgress[section._id] || 0;

              const isUnlocked = isFirst || (prevStatus && prevStatus.passed) || (currentProgress > 0);
              const isLocked = !isUnlocked;

              return (
                <div
                  key={section._id}
                  className={`progress-bar-container relative transform transition-transform duration-300 ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105'}`}
                  onClick={() => !isLocked && navigate(`/courses/${selectedCourse}/sections/${section._id}`)}
                >
                  <div className="progress-bar relative flex flex-col items-center justify-center py-8 bg-[#0F0F0F]">
                    {/* Lock Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-[20px]">
                        <img src={squareLock} alt="Locked" className="w-10 h-10" />
                      </div>
                    )}

                    {/* Section number in background */}
                    <span className="absolute top-4 left-4 text-[70px] leading-none text-white/5 font-bold select-none start-0 z-0">{i + 1}</span>

                    {/* Content */}
                    <div className="z-10 text-center w-full px-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">{section.sectionName}</h3>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-300 font-medium">
                        <span>{section.units ? section.units.length : 0} Videos</span>
                        <span className="text-[#FF9D00]">|</span>
                        <span>30 Min</span>
                      </div>
                    </div>

                    {/* Wave SVG */}
                    <svg
                      id={`wave-${section._id}`}
                      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                      width={WIDTH}
                      height={HEIGHT}
                      preserveAspectRatio="none"
                      className="absolute bottom-0 left-0 w-full h-full rounded-[100px] pointer-events-none opacity-90"
                    >
                      <path
                        ref={(el) => (pathRefs.current[section._id] = el)}
                        fill="url(#waveGradient)"
                      />
                      <defs>
                        <linearGradient
                          id="waveGradient"
                          x1="0"
                          y1={HEIGHT / 2}
                          x2={WIDTH}
                          y2={HEIGHT / 2}
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.1" stopColor="#17005E" stopOpacity="0.9" />
                          <stop offset="1" stopColor="#FF9D00" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              );
            })
        )}
      </div>
      {showAssessmentPopup && popupSection && (
        <AssessmentFirstPopup
          maxAttempts={attemptsLeft}
          courseName={currentCourseName}
          numQuestions={numQuestions}
          timeAllowed={timeLimit}
          onButtonClick={handleStartAssessment} />
      )}

      {showDetailPopup && detailCourse && (
        <CourseDetailPopup
          course={detailCourse}
          onClose={() => setShowDetailPopup(false)}
        />
      )}

      {showMaxAttemptsPopup && (
        <AssessmentMaxAttemptsPopup
          onGoBack={() => {
            setShowMaxAttemptsPopup(false);
            setShowAssessmentPopup(false);
          }}
        />
      )}

    </div>
  );
};

export default CourseSection