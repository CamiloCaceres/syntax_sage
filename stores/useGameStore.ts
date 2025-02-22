import { defineStore } from 'pinia';
import type { Method, Exercise } from '@/types';
import { pythonArrayMethods } from '@/sample-data/python-array-metods';

export const useGameStore = defineStore('game', {
  state: () => ({
    exercises: [] as Exercise[],
    currentExerciseIndex: 0,
    score: 0,
    attempted: 0,
  }),
  
  actions: {
    initializeGame() {
        // Flatten all exercises from all methods into a single array
        this.exercises = pythonArrayMethods.flatMap((method: Method) => 
        method.exercises.map((exercise: Exercise)  => ({
          ...exercise,
          methodName: method.name,
          methodSyntax: method.syntax
        }))
      );
      
      // Shuffle exercises
      this.exercises = this.exercises
        .sort(() => Math.random() - 0.5);
      
      this.currentExerciseIndex = 0;
      this.score = 0;
      this.attempted = 0;
    },
    
    nextExercise() {
      if (this.currentExerciseIndex < this.exercises.length - 1) {
        this.currentExerciseIndex++;
      }
    },
    
    addScore() {
      this.score++;
      this.attempted++;
    },
    
    skipExercise() {
      this.attempted++;
      this.nextExercise();
    }
  },
  
  getters: {
    currentExercise: (state) => state.exercises[state.currentExerciseIndex],
    isGameFinished: (state) => state.currentExerciseIndex >= state.exercises.length - 1,
    progress: (state) => ({
      current: state.currentExerciseIndex + 1,
      total: state.exercises.length,
      score: state.score,
      attempted: state.attempted
    })
  }
});