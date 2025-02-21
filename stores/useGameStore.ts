import { defineStore } from "pinia";
import type { Method, Exercise, MethodProgress } from "@/types";
import { pythonArrayMethods } from "@/sample-data/python-array-metods";

export const useGameStore = defineStore("game", {
  state: () => ({
    currentLanguage: "python" as "python" | "javascript",
    currentCategory: "array" as "array" | "string" | "dictionary",
    currentMethod: null as Method | null,
    currentExercise: null as Exercise | null,
    progress: {} as Record<string, MethodProgress>,
    methods: pythonArrayMethods,
  }),

  actions: {
    setMethod(method: Method) {
      this.currentMethod = method;
      this.currentExercise = method.exercises[0];
    },

    setExercise(exercise: Exercise) {
      this.currentExercise = exercise;
    },

    updateProgress(methodId: string, exerciseId: string, completed: boolean) {
      if (!this.progress[methodId]) {
        this.progress[methodId] = {
          userId: "temp", // Replace with actual user ID
          methodId,
          completedExercises: [],
          totalAttempts: 0,
          masteryLevel: 0,
          lastPracticeDate: new Date(),
        };
      }

      if (
        completed &&
        !this.progress[methodId].completedExercises.includes(exerciseId)
      ) {
        this.progress[methodId].completedExercises.push(exerciseId);
        this.progress[methodId].masteryLevel =
          this.progress[methodId].completedExercises.length;
      }

      this.progress[methodId].totalAttempts++;
      this.progress[methodId].lastPracticeDate = new Date();
    },
  },

  getters: {
    methodProgress: (state) => (methodId: string) => state.progress[methodId],
    isExerciseCompleted: (state) => (methodId: string, exerciseId: string) => {
      return (
        state.progress[methodId]?.completedExercises.includes(exerciseId) ||
        false
      );
    },
  },
});
