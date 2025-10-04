import React, { useState } from "react";
import { QUIZ_QUESTIONS } from "../constants";
import { calculateCarbonFootprint } from "../services/geminiService.ts";
import type { QuizAnswers, CarbonFootprintResult } from "../types";
import Spinner from "./Spinner.tsx";

interface CarbonFootprintQuizProps {
  onBack: () => void;
}

const initialAnswers: QuizAnswers = {
  transport: "",
  diet: "",
  energy: "",
  flights: "",
  shopping: "",
};

const CarbonFootprintQuiz: React.FC<CarbonFootprintQuizProps> = ({
  onBack,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerSelect = (option: string) => {
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.key]: option };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiResult = await calculateCarbonFootprint(answers);
      setResult(apiResult);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers(initialAnswers);
    setResult(null);
    setError(null);
  };

  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Spinner />
        <p className="mt-4 text-lg text-brand-gray">
          Calculating your footprint...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h3 className="text-2xl font-bold text-red-600 mb-4">
          Calculation Failed
        </h3>
        <p className="text-brand-gray mb-6">{error}</p>
        <button
          onClick={handleReset}
          className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-dark-green transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-brand-dark-green">
          Your Result
        </h2>
        <div className="text-center mb-6">
          <p className="text-lg text-brand-gray">
            Your estimated annual carbon footprint is:
          </p>
          <p className="text-6xl font-extrabold text-brand-green my-2">
            {result.score.toFixed(1)}
          </p>
          <p className="text-lg text-brand-gray">tonnes of CO₂ equivalent</p>
        </div>
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-bold">Analysis:</h3>
          <p className="text-brand-gray">{result.analysis}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Personalized Tips:</h3>
          <ul className="list-disc list-inside space-y-2 text-brand-gray">
            {result.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleReset}
            className="bg-brand-green text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="text-brand-green hover:text-brand-dark-green mb-4"
      >
        &larr; Back to Home
      </button>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-6">
          <p className="text-sm text-brand-gray text-right mb-2">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </p>
          <div className="w-full bg-brand-light-gray rounded-full h-2.5">
            <div
              className="bg-brand-green h-2.5 rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease-in-out",
              }}
            ></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6 text-center">
          {currentQuestion.question}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                answers[currentQuestion.key] === option
                  ? "bg-brand-green border-brand-dark-green text-white"
                  : "bg-white border-brand-light-gray hover:border-brand-green hover:bg-green-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 &&
          !!answers[QUIZ_QUESTIONS[QUIZ_QUESTIONS.length - 1].key] && (
            <div className="text-center mt-8">
              <button
                onClick={handleSubmit}
                className="bg-brand-green text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors"
              >
                Calculate My Footprint
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default CarbonFootprintQuiz;
