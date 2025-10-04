
import { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "How do you primarily commute to work or school?",
    options: ["Car (Gasoline/Diesel)", "Public Transportation", "Electric Vehicle", "Bicycle or Walking"],
    key: "transport",
  },
  {
    question: "Which of these best describes your typical diet?",
    options: ["High meat consumption (daily)", "Moderate meat consumption", "Low meat consumption (few times a week)", "Vegetarian/Vegan"],
    key: "diet",
  },
  {
    question: "How many round-trip flights do you take per year?",
    options: ["None", "1-2 short-haul flights", "1-2 long-haul flights", "More than 2 long-haul flights"],
    key: "flights",
  },
  {
    question: "How would you describe your energy usage at home?",
    options: ["I don't pay much attention to it", "I try to turn off lights", "I use energy-efficient appliances and am conscious of usage", "My home is powered by renewable energy"],
    key: "energy",
  },
  {
    question: "How often do you buy brand new clothing or electronics?",
    options: ["Multiple times a month", "Once a month", "A few times a year", "Rarely, I prefer second-hand or repairing"],
    key: "shopping",
  },
];
