import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssessmentBubble from '../pages/AssessmentBubble';
import AssessmentPassedPopup from '../pages/AssessmentPassedPopup';
import AssessmentFailedPopup from '../pages/AssessmentFailedPopup';
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';
import axios from 'axios';

const ASSESSMENT_TIME = 60 * 60; // 1 hour

const Assessment = () => {
  const { courseId, sectionId } = useParams();
  const { token } = useContext(AuthContext);
  const { notifyProgressChanged } = useContext(ProgressContext);
  const navigate = useNavigate();

  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ASSESSMENT_TIME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

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
          setFetchedQuestions(res.data.questions);
          // Set time limit from backend (convert minutes to seconds)
          if (res.data.timeLimit) {
            setTimeLeft(res.data.timeLimit * 60);
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
  }, [token, courseId, sectionId]);

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
    setSubmitting(true);
    try {
      const payload = {
        courseId,
        sectionId,
        answers: fetchedQuestions.map((q, idx) => {
          const selectedIndex = selectedOptions[idx + 1];
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
        total: fetchedQuestions.length
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
  if (error) return <div className="text-red-500 text-center mt-20 text-xl font-inter">{error}</div>;

  if (result) {
    return result.passed ? (
      <AssessmentPassedPopup
        onUnlock={() => navigate(`/course-section/${courseId}`)}
      />
    ) : (
      <AssessmentFailedPopup
        wrongAnswers={result.wrongAnswers}
        onGoBack={() => navigate(`/course-section/${courseId}`)}
        onRetake={() => navigate(`/course-section/${courseId}`, { state: { openAssessment: true } })}
      />
    );
  }

  const currentQuestionIndex = currentPage - 1;
  const currentQuestion = fetchedQuestions[currentQuestionIndex];

  if (!currentQuestion) return <div className="text-white text-center mt-20 text-xl font-inter">No questions found.</div>;

  return (
    <div className="text-white font-inter">
      {/* Top Pagination Bubbles */}
      <AssessmentBubble
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={fetchedQuestions.length}
      />

      {/* Header */}
      <div className="absolute w-[88.6vw] h-[3.89vh] top-[33.87vh] left-[6vw] flex justify-between">
        <div className="text-[1.25vw] font-semibold max-[768px]:text-[14px]">
          Question {currentPage} / {fetchedQuestions.length}
        </div>
        <div className="text-[1.25vw] font-semibold max-[768px]:text-[14px]">
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Body */}
      <div className="absolute w-[88.6vw] left-[90px] top-[330px] flex flex-col gap-[50px]">
        <div className="text-[1.25vw] font-semibold max-[768px]:text-[16px]">
          {currentPage}) {currentQuestion.question}
        </div>

        <div className="grid grid-cols-2 gap-y-[5vh] gap-x-[5vw] max-[768px]:grid-cols-1">
          {currentQuestion.options.map((option, idx) => {
            const optionLabel = String.fromCharCode(65 + idx);
            const isSelected = selectedOptions[currentPage] === idx;
            return (
              <div
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className="flex items-center gap-[1.56vw] cursor-pointer text-[1.11vw] max-[768px]:text-[15px]"
              >
                <button
                  className={`w-[1.5vw] h-[3.1vh] rounded-full border-[3px] transition-colors duration-200 ${isSelected
                    ? 'border-yellow-500 bg-yellow-500'
                    : 'border-white bg-transparent'
                    } max-[768px]:w-[20px] max-[768px]:h-[20px]`}
                ></button>
                <p>
                  {optionLabel})&nbsp;&nbsp;{option}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-[83.51vh] left-[36.42vw] flex gap-[1.56vw] max-[768px]:top-[100vh] max-[768px]:left-[5vw]">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="border border-white px-20 py-2 rounded-full text-white max-[768px]:w-[40vw]"
        >
          Previous
        </button>
        {currentPage === fetchedQuestions.length ? (
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="bg-yellow-500 text-black px-20 py-2 rounded-full border border-white max-[768px]:w-[40vw] font-bold"
          >
            {submitting ? "Submitting..." : "Submit Assessment"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, fetchedQuestions.length))}
            className="bg-yellow-500 text-black px-20 py-2 rounded-full border border-white max-[768px]:w-[40vw]"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
