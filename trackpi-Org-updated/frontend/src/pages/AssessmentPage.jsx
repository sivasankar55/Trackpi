import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import AssessmentFirstPopup from "./AssessmentFirstPopup";
import AssessmentPassedPopup from "./AssessmentPassedPopup";
import AssessmentFailedPopup from "./AssessmentFailedPopup";
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

  const questions = fetchedQuestions;
  const currentQuestion = questions[currentPage - 1];

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
          const shuffled = [...res.data.questions].sort(() => 0.5 - Math.random());
          setFetchedQuestions(shuffled);
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

    if (token) {
      fetchQuestions();
      setTimer(ASSESSMENT_TIME);
    }
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

  const handleOptionSelect = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentPage - 1]: option
    }));
  };

  const handleSubmit = async (timeUp = false) => {
    setSubmitting(true);
    try {
      const payload = {
        courseId,
        sectionId,
        answers: questions.map((q, idx) => ({
          questionId: q._id,
          answer: answers[idx] || ""
        }))
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
  if (error) return <div className="text-red-500 text-center mt-20 text-xl">{error}</div>;
  if (!currentQuestion) return <div className="text-white text-center mt-20 text-xl">Invalid question number.</div>;

  if (result) {
    return result.passed ? (
      <AssessmentPassedPopup
        timeUp={result.timeUp}
        score={result.score}
        total={result.totalQuestions || questions.length}
        onUnlock={() => navigate(`/course-section/${courseId}`)}
      />
    ) : (
      <AssessmentFailedPopup
        score={result.score}
        total={result.totalQuestions || questions.length}
        wrongAnswers={result.wrongAnswers}
        onGoBack={() => navigate(`/courses/${courseId}/sections/${sectionId}`)}
        onRetake={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="text-white font-inter w-full">

      {/* Title Section */}
      <div
        className="flex items-center justify-start border-t border-white/100 pt-[40px] px-[50px] gap-[25px] opacity-100
  w-full h-[33px]
  max-[768px]:pt-[20px] max-[768px]:px-[24px] max-[768px]:w-full max-[768px]:h-auto"
      >

        <div className="font-roboto font-medium text-[1.95vw] leading-[1] tracking-normal text-white text-center 
      max-[768px]:text-[5vw] max-[768px]:text-left">
          Assessment
        </div>
      </div>

      <AssessmentBubble
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={questions.length}
      />

      {/* Info bar: Question count and timer */}
      <div className="w-full px-4 sm:px-10 mt-6 sm:mt-[40px] flex flex-col sm:flex-row justify-between items-start sm:items-center text-base sm:text-xl font-semibold text-white">
        <p>Out of {currentPage} / {questions.length} Questions</p>
        <p className="mt-2 sm:mt-0">Time Remaining: {formatTime(timer)}</p>
      </div>

      {/* Question & Options Block */}
      <div className="px-4 sm:px-10 mt-8 sm:mt-[60px] w-full">
        <h2 className="text-[18px] sm:text-[20px] font-semibold mb-6 text-white">
          {currentPage}) {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = answers[currentPage - 1] === opt;
            const label = String.fromCharCode(65 + idx);
            return (
              <div
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                className={`flex items-center cursor-pointer rounded-lg px-4 py-3 text-base font-medium transition-colors w-full
            ${isSelected ? 'bg-yellow-500 text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
              >
                {/* Custom Radio Circle */}
                <div
                  className={`w-4 h-4 rounded-full mr-3 border-2 flex items-center justify-center
              ${isSelected ? 'border-black bg-black' : 'border-gray-400 bg-transparent'}`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>

                {/* Option Label & Text */}
                <span className="mr-2 font-medium">{label})</span>
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
      </div>


      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-[30px] w-full max-w-[536px] mx-auto mt-[40px]">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          className="border border-white rounded-full text-white py-2 px-6 w-full sm:w-[253px] h-[45px]"
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
          className="bg-yellow-500 text-black rounded-full py-2 px-6 w-full sm:w-[253px] h-[45px] disabled:opacity-50"
        >
          {submitting ? "Submitting..." : currentPage === questions.length ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

// Inline bubble component
const AssessmentBubble = ({ currentPage, setCurrentPage, totalPages }) => {
  const [isMobile, setIsMobile] = useState(false);
  const visibleCount = isMobile ? 5 : 16;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
  let end = start + visibleCount - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visibleCount + 1);
  }

  const visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="w-full px-4 sm:px-[70px] mt-[40px] sm:mt-[60px] flex flex-wrap sm:flex-nowrap justify-between items-center gap-y-4 max-w-[1440px] mx-auto">
      {/* Capsule with 1 and < */}
      <div className="flex items-center border border-white/90 rounded-full px-0">
        <button
          onClick={() => setCurrentPage(1)}
          className={`w-[40px] h-[44px] flex items-center justify-center text-white text-[18px]
        ${currentPage === 1 ? 'text-yellow-500 font-semibold' : ''}`}
        >
          1
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`w-[44px] h-[44px] flex items-center justify-center rounded-full border border-white/80 ml-[4px]
        ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-[18px] text-white" />
        </button>
      </div>

      {/* Bubbles (2 to n-1) */}
      <nav className="flex flex-wrap justify-center gap-x-[1vw] sm:gap-x-[2vw]">
        {visiblePages
          .filter((item) => item !== 1 && item !== totalPages)
          .map((item) => {
            const isActive = item === currentPage;
            return (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                className={`w-[44px] h-[44px] rounded-full border font-medium text-center 
              flex items-center justify-center text-[18px]
              ${isActive ? 'border-yellow-500 text-yellow-500' : 'border-white/90 text-white'}`}
              >
                {item}
              </button>
            );
          })}
      </nav>

      {/* Capsule with > and last */}
      <div className="flex items-center border border-white/90 rounded-full px-0">
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`w-[44px] h-[44px] flex items-center justify-center rounded-full border border-white/90 mr-[4px]
        ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-[18px] text-white" />
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          className={`w-[44px] h-[44px] flex items-center justify-center text-white text-[18px]
        ${currentPage === totalPages ? 'text-yellow-500 font-semibold' : ''}`}
        >
          {totalPages}
        </button>
      </div>
    </div>

  );
};

export default AssessmentPage;