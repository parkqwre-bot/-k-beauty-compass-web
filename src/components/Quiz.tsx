import React, { useState } from 'react';

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});

  // Dummy questions for now
  const questions = [
    {
      questionText: "What is your skin type?",
      options: ["Dry", "Normal", "Oily"],
      allowMultipleSelection: false,
    },
    {
      questionText: "What are your main skin concerns?",
      options: ["Acne", "Pores", "Wrinkles"],
      allowMultipleSelection: true,
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    // Logic to handle option selection
    if (currentQuestion.allowMultipleSelection) {
      setSelectedAnswers(prev => {
        const current = prev[currentQuestionIndex] || [];
        if (current.includes(optionIndex)) {
          return { ...prev, [currentQuestionIndex]: current.filter(item => item !== optionIndex) };
        } else {
          return { ...prev, [currentQuestionIndex]: [...current, optionIndex] };
        }
      });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: [optionIndex] });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished, navigate to results or display them
      console.log("Quiz Finished! Answers:", selectedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">{currentQuestion.questionText}</h2>
      <div className="flex flex-col space-y-2">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`px-4 py-2 border rounded-md ${selectedAnswers[currentQuestionIndex]?.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-4 space-x-4">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePrevious} className="px-4 py-2 bg-gray-300 rounded-md">
            Previous
          </button>
        )}
        <button onClick={handleNext} className="px-4 py-2 bg-green-500 text-white rounded-md">
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
