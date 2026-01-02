import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentBubble from '../pages/AssessmentBubble'; // ✅ adjust path if needed
// import './css/Assessment.css';

const questions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['Berlin', 'London', 'Paris', 'Rome'],
    correctAnswer: 'Paris'
  },
  {
    id: 2,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars'
  },
  {
    id: 3,
    question: 'What is the smallest prime number?',
    options: ['1', '2', '3', '5'],
    correctAnswer: '2'
  },
  {
    id: 4,
    question: 'What is the chemical symbol for water?',
    options: ['O2', 'H2O', 'CO2', 'NaCl'],
    correctAnswer: 'H2O'
  },
  {
    id: 5,
    question: 'Which language is used for web apps?',
    options: ['Python', 'JavaScript', 'C++', 'Java'],
    correctAnswer: 'JavaScript'
  },
  {
    id: 6,
    question: 'What is the capital of India?',
    options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
    correctAnswer: 'Delhi'
  },
  {
    id: 7,
    question: 'Which organ purifies our blood?',
    options: ['Heart', 'Liver', 'Kidney', 'Lungs'],
    correctAnswer: 'Kidney'
  },
  {
    id: 8,
    question: 'Who invented the light bulb?',
    options: ['Newton', 'Einstein', 'Edison', 'Tesla'],
    correctAnswer: 'Edison'
  },
  {
    id: 9,
    question: 'Which gas do plants absorb from the air?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 'Carbon Dioxide'
  },
  {
    id: 10,
    question: 'What is 5 x 6?',
    options: ['30', '11', '56', '25'],
    correctAnswer: '30'
  },
  {
    id: 11,
    question: 'What color is chlorophyll?',
    options: ['Red', 'Green', 'Yellow', 'Blue'],
    correctAnswer: 'Green'
  },
  {
    id: 12,
    question: 'Which planet has rings?',
    options: ['Mars', 'Earth', 'Saturn', 'Venus'],
    correctAnswer: 'Saturn'
  },
  {
    id: 13,
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '7'
  },
  {
    id: 14,
    question: 'What is the boiling point of water?',
    options: ['90°C', '100°C', '120°C', '80°C'],
    correctAnswer: '100°C'
  },
  {
    id: 15,
    question: 'Which language is most widely spoken?',
    options: ['Hindi', 'English', 'Mandarin', 'Spanish'],
    correctAnswer: 'Mandarin'
  },
  {
    id: 16,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ['Chaucer', 'Milton', 'Shakespeare', 'Dickens'],
    correctAnswer: 'Shakespeare'
  },
  {
    id: 17,
    question: 'What is 12 squared?',
    options: ['124', '144', '132', '120'],
    correctAnswer: '144'
  },
  {
    id: 18,
    question: 'Which country has the Great Wall?',
    options: ['India', 'Japan', 'China', 'Korea'],
    correctAnswer: 'China'
  },
  {
    id: 19,
    question: 'What is the largest ocean?',
    options: ['Atlantic', 'Arctic', 'Indian', 'Pacific'],
    correctAnswer: 'Pacific'
  },
  {
    id: 20,
    question: 'What is the freezing point of water?',
    options: ['0°C', '5°C', '10°C', '100°C'],
    correctAnswer: '0°C'
  },
  {
    id: 21,
    question: 'What do bees make?',
    options: ['Milk', 'Silk', 'Honey', 'Wax'],
    correctAnswer: 'Honey'
  },
  {
    id: 22,
    question: 'Which shape has 4 equal sides?',
    options: ['Triangle', 'Rectangle', 'Square', 'Circle'],
    correctAnswer: 'Square'
  },
  {
    id: 23,
    question: 'Which month has 28 days?',
    options: ['February', 'June', 'March', 'April'],
    correctAnswer: 'February'
  },
  {
    id: 24,
    question: "Which animal is called the 'King of the Jungle'?",
    options: ['Tiger', 'Elephant', 'Lion', 'Wolf'],
    correctAnswer: 'Lion'
  },
  {
    id: 25,
    question: 'What is the capital of the USA?',
    options: ['New York', 'Los Angeles', 'Washington, D.C.', 'Chicago'],
    correctAnswer: 'Washington, D.C.'
  },
  {
    id: 26,
    question: 'Which planet is closest to the sun?',
    options: ['Earth', 'Mars', 'Venus', 'Mercury'],
    correctAnswer: 'Mercury'
  },
  {
    id: 27,
    question: 'Which is heavier: 1kg of steel or 1kg of cotton?',
    options: ['Steel', 'Cotton', 'Same', "Can't say"],
    correctAnswer: 'Same'
  },
  {
    id: 28,
    question: 'Which festival is known as the Festival of Lights?',
    options: ['Holi', 'Diwali', 'Eid', 'Christmas'],
    correctAnswer: 'Diwali'
  },
  {
    id: 29,
    question: 'How many legs does a spider have?',
    options: ['6', '8', '10', '4'],
    correctAnswer: '8'
  },
  {
    id: 30,
    question: 'Which part of the plant conducts photosynthesis?',
    options: ['Root', 'Stem', 'Leaf', 'Flower'],
    correctAnswer: 'Leaf'
  }
];

const Assessment = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour
  const navigate = useNavigate();

  // ✅ Shuffle once
  const shuffledQuestions = useMemo(() => {
    return [...questions].sort(() => 0.5 - Math.random());
  }, []);

  // ✅ Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/assessment/time-up');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs} : ${mins} : ${secs}`;
  };

  const currentQuestionIndex = currentPage - 1;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="text-white text-center mt-20 text-xl">
        Invalid question number.
      </div>
    );
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    // <div className='background-b text-white font-inter w-screen h-auto max-[768px]:mt-[60px]'>
    <div className="text-white font-inter">
      {/* ✅ Top Pagination Bubbles */}
      <AssessmentBubble
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Header */}
      <div className="absolute w-[88.6vw] h-[3.89vh] top-[33.87vh] left-[6vw] flex justify-between">
        <div className="text-[1.25vw] font-semibold max-[768px]:text-[14px]">
          Question {currentPage} / {shuffledQuestions.length}
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
            const isSelected = selectedOption === option;
            return (
              <div
                key={option}
                onClick={() => handleOptionSelect(option)}
                className="flex items-center gap-[1.56vw] cursor-pointer text-[1.11vw] max-[768px]:text-[15px]"
              >
                <button
                  className={`w-[1.5vw] h-[3.1vh] rounded-full border-[3px] transition-colors duration-200 ${
                    isSelected
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
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, shuffledQuestions.length)
            )
          }
          className="bg-yellow-500 text-black px-20 py-2 rounded-full border border-white max-[768px]:w-[40vw]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Assessment;
