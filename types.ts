
export type HabitKey = 
  | 'bibleReading' 
  | 'physicalExercise' 
  | 'hardWork' 
  | 'bookReading' 
  | 'sleepingWell' 
  | 'hygiene' 
  | 'drinkingWater' 
  | 'journaling'
  | 'healthyEating'
  | 'creativeIdle'
  | 'socialMediaLimit';

export interface HabitDefinition {
  id: HabitKey;
  label: string;
  icon: string;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type WeatherType = 1 | 2 | 3 | 4 | 5;

export interface DailyLog {
  date: string;
  habits: Record<HabitKey, boolean>;
  notes: string;
  mood: MoodLevel;
  weather: WeatherType;
  score: number;
}

export type AnalysisPeriod = 'Semanal' | 'Quinzenal' | 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';

export interface AIAnalysisReport {
  score: number;
  performance: string;
  positives: string[];
  toImprove: string[];
  alternatives: string;
}
