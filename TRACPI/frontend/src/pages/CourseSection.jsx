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
    // Progressive Loading Optimization:
    // Instead of waiting for ALL sections to load (Promise.all) which delays UI,
    // we fetch in batches (CHUNKS) and update the UI incrementally.
    // This improves "Time to Interactive" and perceived speed.

    let isMounted = true;
    const CHUNK_SIZE = 6; // Fetch 6 sections at a time (browser limit friendly)

    if (sections.length > 0 && token && selectedCourse) {
      const fetchProgressChunked = async () => {
        // Reset or keep existing logic? Better to reset if sections changed completely.
        // But since we want to show incremental updates, we start fresh or overlay.
        // Let's assume we want to fill data into the existing structure.

        const sectionChunks = [];
        for (let i = 0; i < sections.length; i += CHUNK_SIZE) {
          sectionChunks.push(sections.slice(i, i + CHUNK_SIZE));
        }

        for (const chunk of sectionChunks) {
          if (!isMounted) break;

          const chunkResults = await Promise.all(chunk.map(async (section) => {
            try {
              const res = await axios.get(`http://localhost:5000/api/progress/section-progress?courseId=${selectedCourse}&sectionId=${section._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              return {
                id: section._id,
                progress: res.data.sectionProgress,
                passed: res.data.assessmentPassed || false,
                completed: res.data.sectionComplete || false
              };
            } catch {
              return {
                id: section._id,
                progress: 0,
                passed: false,
                completed: false
              };
            }
          }));

          if (isMounted) {
            setSectionProgress(prev => {
              const next = { ...prev };
              chunkResults.forEach(r => next[r.id] = r.progress);
              return next;
            });
            setSectionStatus(prev => {
              const next = { ...prev };
              chunkResults.forEach(r => next[r.id] = { passed: r.passed, completed: r.completed });
              return next;
            });
          }
        }
      };

      fetchProgressChunked();
    }

    return () => { isMounted = false; };
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

  const lastSection = sections.length > 0 ? sections[sections.length - 1] : null;
  const isAssessmentPassed = lastSection && sectionStatus[lastSection._id]?.passed;

  // Auto-open assessment if redirected from SectionVideos
  useEffect(() => {
    if (location.state?.openAssessment && sections.length > 0) {
      const targetSection = [...sections].reverse().find(s => (sectionProgress[s._id] || 0) >= 100) || sections[sections.length - 1];

      if (targetSection) {
        // Check if status is loaded
        const status = sectionStatus[targetSection._id];
        if (!status) return; // Wait for status to load

        if (status.passed) {
          // If already passed, do not open, just clear state
          console.log("Assessment already passed, blocking auto-open.");
          window.history.replaceState({}, document.title);
          return;
        }

        setActiveTab('assessment');
        handleAssessmentClick(targetSection);
        // Clear state so it doesn't reopen on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [sections, location.state, sectionProgress, sectionStatus]);

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
      // Calculate if this is the final assessment with robust ID checks
      const currentCourseIndex = courses.findIndex(c => String(c._id) === String(selectedCourse));
      const isLastCourse = currentCourseIndex !== -1 && currentCourseIndex === courses.length - 1;
      const isLastSection = String(popupSection._id) === String(sections[sections.length - 1]._id);
      const isFinalAssessment = isLastCourse && isLastSection;

      navigate(`/assessment/${selectedCourse}/${popupSection._id}`, { state: { isFinalAssessment } });
    }
  };





  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-[#333] border-t-[#FFB700] rounded-full animate-spin"></div>
    </div>
  );



  // scroll left and right
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };



  return (

    <div className="course-section-wrapper">
      <section className='container-search px-5'>
        <div className='flex flex-row justify-between items-center gap-2 mt-5'>
          <h1 className='text-white font-bold text-xl sm:text-2xl roboto whitespace-nowrap'>Courses</h1>
          <div className='relative w-auto max-w-[160px] sm:max-w-none'>
            <i className='fa fa-search text-[#B3B6B6] text-[14px] sm:text-[18px] absolute left-3 top-1/2 transform -translate-y-1/2'></i>
            <input
              type="search"
              name="search"
              id="search"
              placeholder='Search for Sections...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='rounded-[15px] w-full sm:w-64 px-8 sm:px-10 py-1.5 text-[12px] sm:text-[14px] font-medium bg-transparent text-white roboto border border-[#333] focus:border-[#FFB700] outline-none'
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
                    className={`relative rounded-[10px] border ${selectedCourse === course._id ? 'border-[#FFB700]' : 'border-[#333]'} h-full min-w-[250px] overflow-hidden transition-all duration-300 hover:scale-105 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
        <div className="my-5 px-5 flex justify-center sm:justify-end gap-3 sm:gap-5">
          <button
            className={`rounded-[40px] w-[140px] h-[45px] sm:w-[200px] sm:h-[50px] flex items-center justify-center font-medium text-[14px] sm:text-base roboto transition-all ${activeTab === 'courses' ? 'bg-[#FFB700] text-white shadow-[0_4px_15px_rgba(255,157,0,0.2)]' : 'border border-[#FFB700] text-[#FFB700] hover:bg-[#FFB700]/10'}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            className={`rounded-[40px] w-[140px] h-[45px] sm:w-[200px] sm:h-[50px] flex items-center justify-center font-medium text-[14px] sm:text-base roboto transition-all ${activeTab === 'assessment'
              ? 'bg-[#FFB700] text-white shadow-[0_4px_15px_rgba(255,157,0,0.2)]'
              : allSectionsComplete && !isAssessmentPassed
                ? 'border border-[#FFB700] text-[#FFB700] hover:bg-[#FFB700]/10'
                : 'opacity-50 cursor-not-allowed border border-[#FFB700] text-[#FFB700]'
              }`}
            onClick={() => {
              if (isAssessmentPassed) return;
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
            {isAssessmentPassed ? "Assessment Completed" : "Assessment"}
          </button>
        </div>
      )}

      {/* Sections Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6 px-2 lg:px-5 mb-10 w-full max-w-full'>
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
                  className={`progress-bar-container w-full relative transform transition-transform duration-300 ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105'}`}
                  onClick={() => !isLocked && navigate(`/courses/${selectedCourse}/sections/${section._id}`)}
                >
                  <div className="progress-bar w-full relative flex flex-col items-center justify-center h-[90px] min-[400px]:h-[110px] sm:h-[150px] bg-[#0F0F0F] rounded-full overflow-hidden">
                    {/* Lock Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                        <img src={squareLock} alt="Locked" className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                    )}

                    {/* Section number in background */}
                    <span className="absolute top-2 left-2 sm:top-4 sm:left-4 text-[60px] sm:text-[80px] leading-none text-white/10 font-bold select-none z-0">{i + 1}</span>

                    {/* Content */}
                    <div className="z-10 text-center w-full px-1">
                      <h3 className="text-[14px] sm:text-2xl font-bold text-white mb-1 sm:mb-2 truncate lowercase first-letter:uppercase px-2">{section.sectionName}</h3>

                      <div className="flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-gray-300 font-medium pb-2">
                        <span className="whitespace-nowrap">{section.units ? section.units.length : 0} Videos</span>
                        <span className="text-[#FFB700]">|</span>
                        <span className="whitespace-nowrap">{section.duration || 0} Min</span>
                      </div>
                    </div>

                    {/* Wave SVG */}
                    <svg
                      id={`wave-${section._id}`}
                      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                      preserveAspectRatio="none"
                      className="absolute bottom-0 left-0 w-full h-full rounded-full pointer-events-none opacity-90"
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
                          <stop offset="1" stopColor="#FFB700" stopOpacity="0.9" />
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