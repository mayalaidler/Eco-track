
export enum AppView {
  HOME,
  QUIZ,
  RECYCLING,
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
