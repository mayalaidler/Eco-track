export enum AppView {
  HOME,
  QUIZ,
  RECYCLING,
  ECO_ACTIONS,
}

export interface QuizQuestion {
  question: string;
  options: string[];
  key: keyof QuizAnswers;
}

export interface QuizAnswers {
  transport: string;
  diet: string;
  energy: string;
  flights: string;
  shopping: string;
}

export interface CarbonFootprintResult {
  score: number;
  analysis: string;
  tips: string[];
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface RecyclingResult {
  info: string;
  sources: GroundingChunk[];
}

export interface EcoAction {
  id: string;
  text: string;
  points: number;
  analysis: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  isUser?: boolean;
}

export interface EcoActionResult {
  points: number;
  analysis: string;
}
