// types/index.ts

// Supported programming languages
export type ProgrammingLanguage = 'python' | 'javascript';

// Method categories
export type MethodCategory = 'array' | 'string' | 'dictionary' | 'object';

// Exercise difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Base exercise interface
export interface Exercise {
  id: string;
  code: string;
  question: string;
  answer: string;
  hint?: string;
  explanation?: string;
  difficulty: DifficultyLevel;
}

// Method interface containing multiple exercises
export interface Method {
  id: string;
  name: string;
  language: ProgrammingLanguage;
  category: MethodCategory;
  description: string;
  syntax: string;
  exercises: Exercise[];
}

// User progress for a specific exercise
export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  attempts: number;
  lastAttemptDate?: Date;
  success: boolean;
}

// User progress for a specific method
export interface MethodProgress {
  userId: string;
  methodId: string;
  completedExercises: string[]; // Array of completed exercise IDs
  totalAttempts: number;
  masteryLevel: number; // 0-5 based on completed exercises
  lastPracticeDate: Date;
}

// User achievement interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: {
    category?: MethodCategory;
    language?: ProgrammingLanguage;
    requiredMethods?: number;
    requiredExercises?: number;
  };
}

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  preferredLanguage: ProgrammingLanguage;
  achievements: string[]; // Array of achievement IDs
  totalCompletedExercises: number;
  totalCompletedMethods: number;
  streakDays: number;
  lastLoginDate: Date;
}

// PocketBase Collections Structure
export interface Collections {
  users: UserProfile;
  methods: Method;
  exercises: Exercise;
  progress: MethodProgress;
  achievements: Achievement;
}