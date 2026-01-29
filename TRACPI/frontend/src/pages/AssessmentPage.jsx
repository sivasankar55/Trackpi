import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import AssessmentFirstPopup from "./AssessmentFirstPopup";
import AssessmentPassedPopup from "./AssessmentPassedPopup";
import AssessmentFailedPopup from "./AssessmentFailedPopup";
import AssessmentTimeUpCongrats from "./AssessmentTimeUpCongrats";
import AssessmentTimeUpPopup from "./AssessmentTimeUpPopup";
import AssessmentMaxAttemptsPopup from "./AssessmentMaxAttemptsPopup";
import AssessmentBubble from "./AssessmentBubble";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ASSESSMENT_TIME = 60 * 60; // 60 minutes
const PASS_MARK = 25;

const AssessmentPage = () => {
  const { courseId, sectionId } = useParams();
  const { token } = useContext(AuthContext);

  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timer, setTimer] = useState(ASSESSMENT_TIME);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const timerRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const isFinalAssessment = location.state?.isFinalAssessment;
  console.log("AssessmentPage State Debug:", { isFinalAssessment, state: location.state });

  const questions = fetchedQuestions;
  const currentQuestion = questions[currentPage - 1];

  // Fetch questions and sync timer with backend startTime
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
          const shuffled = [...res.data.questions].sort(() => 0.5 - Math.random());
          setFetchedQuestions(shuffled);

          // Calculate remaining time based on backend startTime to persist across refresh
          const timeLimitSecs = (res.data.timeLimit || 60) * 60;
          if (res.data.startTime) {
            const startTime = new Date(res.data.startTime).getTime();
            const now = new Date().getTime();
            const elapsedSecs = Math.floor((now - startTime) / 1000);
            const remaining = Math.max(0, timeLimitSecs - elapsedSecs);
            setTimer(remaining);

            if (remaining === 0) handleSubmit(true);
          } else {
            setTimer(timeLimitSecs);
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

    if (token) fetchQuestions();
  }, [token, courseId, sectionId]);

  // Timer countdown logic
  useEffect(() => {
    if (loading || result) return;
    if (timer <= 0) return handleSubmit(true);
    timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, loading, result]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentPage - 1]: optionIndex
    }));
  };

  const handleSubmit = async (timeUp = false) => {
    setSubmitting(true);
    try {
      const payload = {
        courseId,
        sectionId,
        answers: questions.map((q, idx) => {
          const selectedIndex = answers[idx];
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
        timeUp: timeUp || res.data.timeUp
      });
    } catch (err) {
      console.error('Assessment submit error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };



  if (loading) return <div className="text-white text-center mt-20 text-xl">Loading questions...</div>;
  if (error) {
    if (error.includes("Maximum assessment attempts reached") || error.includes("Max attempts has reached")) {
      return (
        <AssessmentMaxAttemptsPopup
          onGoBack={() => navigate(`/course-section/${courseId}`)}
        />
      );
    }
    return <div className="text-red-500 text-center mt-20 text-xl">{error}</div>;
  }
  if (!currentQuestion) return <div className="text-white text-center mt-20 text-xl">Invalid question number.</div>;

  if (result) {
    if (result.passed) {
      if (result.timeUp) {
        return (
          <AssessmentTimeUpCongrats
            onUnlock={() => navigate(`/course-section/${courseId}`)}
          />
        );
      }
      return (
        <AssessmentPassedPopup
          timeUp={result.timeUp}
          score={result.score}
          total={result.totalQuestions || questions.length}
          onUnlock={() => {
            if (isFinalAssessment) {
              navigate('/feedback-form', { state: { isFinalFeedback: true } });
            } else {
              navigate(`/start-course/dashboard`);
            }
          }}
          buttonText={isFinalAssessment ? "Give Feedback" : "Start Onboarding"}
        />
      );
    } else {
      if (result.timeUp) {
        return (
          <AssessmentTimeUpPopup
            onGoBack={() => navigate(`/course-section/${courseId}`)}
            onRetake={() => window.location.reload()}
          />
        );
      }
      return (
        <AssessmentFailedPopup
          score={result.score}
          total={result.totalQuestions || questions.length}
          wrongAnswers={result.wrongAnswers}
          onGoBack={() => navigate(`/course-section/${courseId}`)}
          onRetake={() => window.location.reload()}
        />
      );
    }
  }

  return (
    <div className="text-white font-inter flex flex-col min-h-screen pb-10">
      <AssessmentBubble
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={questions.length}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-[88vw] mx-auto mt-[10vh] sm:mt-[15vh]">

        {/* Info bar */}
        <div className="flex justify-between items-center w-full mb-8">
          <div className="text-[14px] sm:text-[18px] md:text-[1.25vw] font-bold">
            {result ? (
              <>Out of <span className="text-yellow-500 font-bold">{result.score}</span> / {result.total} Questions</>
            ) : (
              <>Question {currentPage} / {questions.length}</>
            )}
          </div>
          <div className="text-[14px] sm:text-[18px] md:text-[1.25vw] font-bold">
            Time Remaining: {formatTime(timer)}
          </div>
        </div>

        {/* Question & Options Block */}
        <div className="flex flex-col gap-6 md:gap-10">
          <h2 className="text-[16px] sm:text-[20px] md:text-[1.25vw] font-bold leading-relaxed">
            {currentPage}) {currentQuestion.question}
          </h2>

          <div className="flex flex-col gap-6">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentPage - 1] === idx;
              const label = String.fromCharCode(65 + idx);
              return (
                <div
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`flex items-center gap-4 cursor-pointer rounded-lg px-4 py-3 text-[15px] md:text-[1.11vw] transition-all hover:translate-x-1 w-full
              ${isSelected ? 'bg-yellow-500 text-black font-bold' : 'bg-transparent text-white hover:bg-white/10'}`}
                >
                  {/* Custom Radio Circle */}
                  <div
                    className={`w-5 h-5 md:w-[1.5vw] md:h-[1.5vw] rounded-full border-2 md:border-[3px] flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-black bg-black' : 'border-white bg-transparent'}`}
                  >
                    {isSelected && (
                      <div className="w-full h-full border-2 border-yellow-500 rounded-full"></div>
                    )}
                  </div>

                  {/* Option Label & Text */}
                  <span>{label})&nbsp;&nbsp;{opt}</span>
                </div>
              );
            })}
          </div>
        </div>


        <div className="flex justify-center gap-6 mt-16 sm:mt-24">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="border border-white w-[140px] md:w-[10vw] h-11 md:h-[5.5vh] flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/10"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentPage === questions.length) {
                handleSubmit(false);
              } else {
                setCurrentPage(prev => Math.min(questions.length, prev + 1));
              }
            }}
            disabled={submitting}
            className="bg-yellow-500 text-black w-[140px] md:w-[10vw] h-11 md:h-[5.5vh] flex items-center justify-center rounded-full border border-white transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-yellow-400 font-bold shadow-lg"
          >
            {submitting ? "Submitting..." : currentPage === questions.length ? "Submit" : "Next"}
          </button>
        </div>
      </div>
      {/* TEMP DEBUG */}
      <div className="fixed bottom-0 right-0 bg-red-500 text-white p-2 text-xs z-50">
        Is Final Assessment: {isFinalAssessment ? 'YES' : 'NO'}
      </div>
    </div>
  );
};

export default AssessmentPage;
