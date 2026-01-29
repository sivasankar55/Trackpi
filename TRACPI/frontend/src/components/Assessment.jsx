import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AssessmentBubble from '../pages/AssessmentBubble';
import AssessmentPassedPopup from '../pages/AssessmentPassedPopup';
import AssessmentFailedPopup from '../pages/AssessmentFailedPopup';
import AssessmentTimeUpPopup from '../pages/AssessmentTimeUpPopup';
import AssessmentTimeUpCongrats from '../pages/AssessmentTimeUpCongrats';
import AssessmentMaxAttemptsPopup from '../pages/AssessmentMaxAttemptsPopup';
import FeedbackPopup from '../pages/FeedbackPopup';
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';
import axios from 'axios';

const ASSESSMENT_TIME = 60 * 60; // 1 hour

const Assessment = () => {
  const { courseId, sectionId } = useParams();
  const { token } = useContext(AuthContext);
  const { notifyProgressChanged } = useContext(ProgressContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ASSESSMENT_TIME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showFeedbackIntro, setShowFeedbackIntro] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Ref to store latest answers to avoid stale closure in timer
  const optionsRef = useRef({});
  useEffect(() => {
    optionsRef.current = selectedOptions;
  }, [selectedOptions]);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.post(
          'http://localhost:5000/api/progress/start-assessment',
          { courseId, sectionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(res.data.questions)) {
          // Shuffle questions on every load/retake
          const shuffled = [...res.data.questions].sort(() => 0.5 - Math.random());
          setFetchedQuestions(shuffled);

          // Calculate remaining time based on backend startTime to persist across refresh
          const timeLimitSecs = (res.data.timeLimit || 60) * 60;
          if (res.data.startTime) {
            const startTime = new Date(res.data.startTime).getTime();
            const now = new Date().getTime();
            const elapsedSecs = Math.floor((now - startTime) / 1000);
            const remaining = Math.max(0, timeLimitSecs - elapsedSecs);
            setTimeLeft(remaining);

            // If already expired, trigger submission automatically
            if (remaining === 0) {
              handleSubmit(true);
            }
          } else {
            setTimeLeft(timeLimitSecs);
          }
        } else {
          setError("Invalid response format.");
        }
      } catch (error) {
        console.error('Assessment start error:', error.response?.data || error.message);
        setError(error.response?.data?.error || "Failed to load assessment questions.");
      } finally {
        setLoading(false);
      }
    };

    if (token && courseId && sectionId) {
      fetchQuestions();
    }
  }, [token, courseId, sectionId, refreshKey]);

  // Timer logic
  useEffect(() => {
    if (loading || error || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, error, result]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs} : ${mins} : ${secs}`;
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentPage]: optionIndex
    }));
  };

  const handleSubmit = async (timeUp = false) => {
    if (timeUp) setIsTimeUp(true);
    setSubmitting(true);
    try {
      const payload = {
        courseId,
        sectionId,
        answers: fetchedQuestions.map((q, idx) => {
          const selectedIndex = optionsRef.current[idx + 1];
          const selectedText = selectedIndex !== undefined ? q.options[selectedIndex] : "";
          return {
            questionId: q._id,
            answer: selectedText
          };
        })
      };

      const res = await axios.post(
        'http://localhost:5000/api/progress/submit-assessment',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult({
        passed: res.data.passed,
        score: res.data.score,
        wrongAnswers: res.data.wrongAnswers || [],
        total: fetchedQuestions.length,
        timeUp: timeUp || res.data.timeUp
      });

      if (res.data.passed) {
        notifyProgressChanged();
      }
    } catch (err) {
      console.error('Assessment submit error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-white text-center mt-20 text-xl font-inter">Loading assessment...</div>;
  if (error) {
    if (error.includes("Maximum assessment attempts reached") || error.includes("Max attempts has reached")) {
      return (
        <AssessmentMaxAttemptsPopup
          onGoBack={() => navigate(`/course-section/${courseId}`)}
        />
      );
    }
    return <div className="text-red-500 text-center mt-20 text-xl font-inter">{error}</div>;
  }

  const currentQuestionIndex = currentPage - 1;
  const currentQuestion = fetchedQuestions[currentQuestionIndex];

  if (!currentQuestion && !result) return <div className="text-white text-center mt-20 text-xl font-inter">No questions found.</div>;

  return (
    <div className="text-white font-inter relative min-h-screen">
      {/* Top Pagination Bubbles */}
      <AssessmentBubble
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={fetchedQuestions.length}
      />

      {/* Header - Absolute on Desktop, Relative on Mobile */}
      <div className="md:absolute w-full md:w-[88.6vw] h-auto md:h-[3.89vh] md:top-[33.87vh] md:left-[6vw] flex flex-row justify-between items-center px-[6vw] md:px-0 mt-10 md:mt-0">
        <div className="text-[12px] sm:text-[18px] md:text-[1.25vw] font-bold">
          {result ? (
            <>Out of <span className="text-yellow-500 font-bold">{result.score}</span> / {result.total} Questions</>
          ) : (
            <>Question {currentPage} / {fetchedQuestions.length}</>
          )}
        </div>
        <div className="text-[12px] sm:text-[18px] md:text-[1.25vw] font-bold">
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Body - Absolute on Desktop, Relative on Mobile */}
      <div className="md:absolute w-full md:w-[88.6vw] px-[6vw] md:px-0 md:left-[90px] md:top-[420px] lg:top-[330px] flex flex-col gap-[30px] md:gap-[50px] mt-10 md:mt-0 pb-32">
        {currentQuestion && (
          <>
            <div className="text-[16px] sm:text-[20px] md:text-[1.25vw] font-bold leading-relaxed">
              {currentPage}) {currentQuestion.question}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[3vh] md:gap-y-[5vh] gap-x-[5vw]">
              {currentQuestion.options.map((option, idx) => {
                const optionLabel = String.fromCharCode(65 + idx);
                const isSelected = selectedOptions[currentPage] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className="flex items-center gap-[1.56vw] cursor-pointer text-[15px] md:text-[1.11vw]"
                  >
                    <button
                      className={`w-[20px] h-[20px] md:w-[1.5vw] md:h-[1.5vw] rounded-full border-2 md:border-[3px] transition-colors duration-200 flex-shrink-0 ${isSelected
                        ? 'border-yellow-500 bg-yellow-500'
                        : 'border-white bg-transparent'
                        }`}
                    >
                      {isSelected && <div className="w-full h-full border-2 border-black rounded-full"></div>}
                    </button>
                    <p>
                      {optionLabel})&nbsp;&nbsp;{option}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons - Absolute on Desktop, Centered Bottom on Mobile */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:absolute md:top-[83.51vh] md:left-[39vw] flex gap-[4vw] md:gap-[2vw] w-[90vw] md:w-auto justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="border border-white w-[140px] md:w-[10vw] h-11 md:h-[5.5vh] flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/10"
        >
          Previous
        </button>
        {currentPage === fetchedQuestions.length ? (
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="bg-yellow-500 text-black w-[140px] md:w-[10vw] h-11 md:h-[5.5vh] flex items-center justify-center rounded-full border border-white transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-yellow-400 font-bold shadow-lg"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, fetchedQuestions.length))}
            className="bg-yellow-500 text-black w-[140px] md:w-[10vw] h-11 md:h-[5.5vh] flex items-center justify-center rounded-full border border-white transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-yellow-400 font-bold"
          >
            Next
          </button>
        )}
      </div>

      {/* Popups rendered as Overlays */}
      {result && (
        <>
          {result.timeUp ? (
            result.passed ? (
              <AssessmentTimeUpCongrats
                onUnlock={() => navigate('/feedback-course')}
              />
            ) : (
              <AssessmentTimeUpPopup
                onGoBack={() => navigate(`/course-section/${courseId}`)}
                onRetake={() => {
                  setResult(null);
                  setIsTimeUp(false);
                  setCurrentPage(1);
                  setSelectedOptions({});
                  setRefreshKey(prev => prev + 1);
                }}
              />
            )
          ) : (
            result.passed ? (
              <AssessmentPassedPopup
                onUnlock={() => {
                  const isFinalAssessment = location.state?.isFinalAssessment;

                  if (isFinalAssessment) {
                    navigate('/feedback-form', {
                      state: {
                        isFinalFeedback: true,
                        courseId: courseId
                      }
                    });
                  } else {
                    setShowFeedbackIntro(true);
                  }
                }}
                buttonText={location.state?.isFinalAssessment ? "Give Feedback" : "Unlock Next Course"}
              />
            ) : (
              <AssessmentFailedPopup
                wrongAnswers={result.wrongAnswers}
                onGoBack={() => navigate(`/course-section/${courseId}`)}
                onRetake={() => {
                  setResult(null);
                  setCurrentPage(1);
                  setSelectedOptions({});
                  setRefreshKey(prev => prev + 1);
                }}
              />
            )
          )}
        </>
      )}

      {showFeedbackIntro && (
        <FeedbackPopup
          onStart={() => {
            navigate('/feedback-form', {
              state: {
                isFinalFeedback: false,
                courseId: courseId
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default Assessment;


