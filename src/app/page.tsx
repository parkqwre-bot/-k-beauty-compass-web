"use client";

import { useState } from "react";
import { getRecommendationTranslation, getTranslation } from "@/lib/localization";
import { getRecommendations } from "@/lib/recommendationService";
import { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import AdBanner from "@/components/AdBanner";

interface QuizQuestion {
  questionText: string;
  options: string[];
  allowMultipleSelection: boolean;
}

export default function Home() {
  const [appState, setAppState] = useState("onboarding"); // "onboarding", "quiz", "results"
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number[] }>({});
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [currentLocale, setCurrentLocale] = useState<"en" | "ko">("en"); // Default to English

  const questions: QuizQuestion[] = [
    {
      questionText: String(getTranslation(currentLocale, "whichCountryDoYouResideIn")),
      options: ["South Korea", "United States"],
      allowMultipleSelection: false,
    },
    {
      questionText: String(getTranslation(currentLocale, "afterWashingYourFaceYourSkinFeels")),
      options: [
        String(getTranslation(currentLocale, "tightAndDry")),
        String(getTranslation(currentLocale, "smoothAndNormal")),
        String(getTranslation(currentLocale, "shinyAndOily")),
        String(getTranslation(currentLocale, "notSure")),
      ],
      allowMultipleSelection: false,
    },
    {
      questionText: String(getTranslation(currentLocale, "whatAreYourBiggestSkinWorries")),
      options: [
        String(getTranslation(currentLocale, "acneBlemishes")),
        String(getTranslation(currentLocale, "pores")),
        String(getTranslation(currentLocale, "wrinkles")),
        String(getTranslation(currentLocale, "redness")),
        String(getTranslation(currentLocale, "dullness")),
      ],
      allowMultipleSelection: true,
    },
    {
      questionText: String(getTranslation(currentLocale, "areYouSensitiveToSpecifics")),
      options: [
        String(getTranslation(currentLocale, "verySensitive")),
        String(getTranslation(currentLocale, "somewhatSensitive")),
        String(getTranslation(currentLocale, "notSensitive")),
        String(getTranslation(currentLocale, "notSure")),
      ],
      allowMultipleSelection: false,
    },
    {
      questionText: String(getTranslation(currentLocale, "howMuchTimeForSkincare")),
      options: [
        String(getTranslation(currentLocale, "lessThan5Minutes")),
        String(getTranslation(currentLocale, "fiveToTenMinutes")),
        String(getTranslation(currentLocale, "moreThan10Minutes")),
      ],
      allowMultipleSelection: false,
    },
    {
      questionText: String(getTranslation(currentLocale, "personalColor")),
      options: [
        String(getTranslation(currentLocale, "warmTone")),
        String(getTranslation(currentLocale, "coolTone")),
        String(getTranslation(currentLocale, "notSure")),
      ],
      allowMultipleSelection: false,
    },
  ];

  const handleGetStarted = () => {
    setAppState("quiz");
  };

  const handleQuizComplete = async (answers: { [key: number]: number[] }) => {
    setQuizAnswers(answers);
    setAppState("loading");

    const isUS = answers[0]?.[0] === 1; // Assuming 0 is South Korea, 1 is United States
    const products = await getRecommendations(answers, isUS);
    setRecommendedProducts(products);
    setAppState("results");
  };

  const handleLanguageChange = (locale: "en" | "ko") => {
    setCurrentLocale(locale);
  };

  const renderOnboarding = () => (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute top-4 right-4">
        <select
          onChange={(e) => handleLanguageChange(e.target.value as "en" | "ko")}
          value={currentLocale}
          className="p-2 rounded-md border"
        >
          <option value="en">English</option>
          <option value="ko">한국어</option>
        </select>
      </div>
      <h1 className="text-5xl font-bold text-pink-500 mb-8">
        {String(getTranslation(currentLocale, "kBeautyCompass"))}
      </h1>
      <p className="text-xl text-gray-700 mb-12 text-center">
        {String(getTranslation(currentLocale, "stopSearchingStartDiscovering"))}
      </p>
      <button
        onClick={handleGetStarted}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg"
      >
        {String(getTranslation(currentLocale, "getStarted"))}
      </button>
      <button
        onClick={() => setAppState("quiz")}
        className="mt-4 text-pink-500 hover:underline"
      >
        {String(getTranslation(currentLocale, "skip"))}
      </button>
      <div className="absolute bottom-4 text-center text-xs text-gray-500 px-4">
        <p>{String(getTranslation(currentLocale, "affiliateDisclaimer"))}</p>
      </div>
    </main>
  );

  const renderQuiz = () => (
    <QuizComponent
      questions={questions}
      onQuizComplete={handleQuizComplete}
      currentLocale={currentLocale}
    />
  );

  const renderResults = () => (
    <div className="min-h-screen p-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        {String(getTranslation(currentLocale, "yourPersonalizedRoutine"))}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              recommendationKey: String(getRecommendationTranslation(
                currentLocale,
                product.recommendationKey
              )),
            }}
            isUS={quizAnswers[0]?.[0] === 1}
          />
        ))}
      </div>
      <div className="mt-8">
        <AdBanner dataAdSlot="6300978111" /> {/* TODO: Replace with your actual AdSense ad unit ID */}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold text-pink-500 mb-8">
        {String(getTranslation(currentLocale, "findingYourPerfectMatch"))}
      </h1>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
    </div>
  );

  switch (appState) {
    case "onboarding":
      return renderOnboarding();
    case "quiz":
      return renderQuiz();
    case "loading":
      return renderLoading();
    case "results":
      return renderResults();
    default:
      return renderOnboarding();
  }
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  onQuizComplete: (answers: { [key: number]: number[] }) => void;
  currentLocale: "en" | "ko";
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  onQuizComplete,
  currentLocale,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      if (currentQuestion.allowMultipleSelection) {
        const current = newAnswers[currentQuestionIndex] || [];
        if (current.includes(optionIndex)) {
          newAnswers[currentQuestionIndex] = current.filter(
            (item) => item !== optionIndex
          );
        } else {
          newAnswers[currentQuestionIndex] = [...current, optionIndex];
        }
      } else {
        newAnswers[currentQuestionIndex] = [optionIndex];
      }
      return newAnswers;
    });
  };

  const handleNext = () => {
    // Basic validation: ensure an answer is selected for non-multiple choice questions
    if (
      !currentQuestion.allowMultipleSelection &&
      (!selectedAnswers[currentQuestionIndex] ||
        selectedAnswers[currentQuestionIndex]?.length === 0)
    ) {
      alert(String(getTranslation(currentLocale, "selectAnAnswer"))); // TODO: Localize this alert
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      onQuizComplete(selectedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-pink-500 h-2.5 rounded-full"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {String(currentQuestion.questionText)}
        </h2>
        <div className="flex flex-col space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full px-4 py-3 border rounded-lg text-lg transition-all duration-200
                ${selectedAnswers[currentQuestionIndex]?.includes(index)
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-800 border-gray-300 hover:border-pink-300"}
              `}
            >
              {String(option)}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full"
            >
              {String(getTranslation(currentLocale, "previous"))}
            </button>
          )}
          <button
            onClick={handleNext}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full ml-auto"
          >
            {currentQuestionIndex === questions.length - 1
              ? String(getTranslation(currentLocale, "finish"))
              : String(getTranslation(currentLocale, "next"))}
          </button>
        </div>
      </div>
    </main>
  );
};