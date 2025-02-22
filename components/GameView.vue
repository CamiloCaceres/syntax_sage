<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const store = useGameStore();
const userAnswer = ref("");
const showFeedback = ref(false);
const hintVisible = ref(false);
const isCorrect = ref(false);
const feedbackMessage = ref("");

const currentExercise = computed(() => store.currentExercise);
const isGameFinished = computed(() => store.isGameFinished);
const progress = computed(() => store.progress);

onMounted(() => {
  store.initializeGame();
});

const checkAnswer = () => {
  if (!currentExercise.value) return;

  isCorrect.value = userAnswer.value.trim() === currentExercise.value.answer;
  feedbackMessage.value = isCorrect.value
    ? "Correct! Well done!"
    : "Not quite right.";

  if (isCorrect.value) {
    store.addScore();
  }

  showFeedback.value = true;
};

const r = userAnswer.value;

const nextQuestion = () => {
  userAnswer.value = "";
  showFeedback.value = false;
  hintVisible.value = false;
  store.nextExercise();
};

const skipQuestion = () => {
  store.skipExercise();
  userAnswer.value = "";
  hintVisible.value = false;
};

const showHint = () => {
  hintVisible.value = true;
};

const restartGame = () => {
  store.initializeGame();
  userAnswer.value = "";
  showFeedback.value = false;
  hintVisible.value = false;
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between mb-2">
        <span>Progress: {{ progress.current }}/{{ progress.total }}</span>
        <span>Score: {{ progress.score }}/{{ progress.attempted }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-blue-600 h-2.5 rounded-full"
          :style="`width: ${(progress.current / progress.total) * 100}%`"
        ></div>
      </div>
    </div>

    <!-- Exercise Card -->
    <div v-if="currentExercise" class="bg-white rounded-lg shadow-lg p-6">
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <pre><code>{{ currentExercise.code }}</code></pre>
      </div>

      <p class="text-lg mb-4">{{ currentExercise.question }}</p>

      <div class="space-y-4">
        <div>
          <input
            v-model="userAnswer"
            type="text"
            class="w-full p-3 border rounded-lg"
            placeholder="Type your answer..."
            :disabled="showFeedback"
            @keyup.enter="checkAnswer"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="checkAnswer"
            class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            :disabled="showFeedback"
          >
            Submit
          </button>
          <button
            @click="showHint"
            class="flex-1 bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300"
            :disabled="showFeedback"
          >
            Hint
          </button>
          <button
            @click="skipQuestion"
            class="flex-1 bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300"
            :disabled="showFeedback"
          >
            Skip
          </button>
        </div>

        <!-- Feedback Area -->
        <div v-if="showFeedback" class="space-y-3">
          <div :class="isCorrect ? 'text-green-600' : 'text-red-600'">
            {{ feedbackMessage }}
          </div>
          <div v-if="!isCorrect" class="text-gray-600">
            Correct answer: <code>{{ currentExercise.answer }}</code>
          </div>
          <div class="bg-yellow-50 p-3 rounded">
            <p>{{ currentExercise.explanation }}</p>
          </div>
          
          <button
            @click="nextQuestion"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            {{ isGameFinished ? "See Results" : "Next Question" }}
          </button>
        </div>

        <!-- Hint Area -->
        <div
          v-if="hintVisible && !showFeedback"
          class="bg-yellow-50 p-3 rounded"
        >
          <p>💡 {{ currentExercise.hint }}</p>
        </div>
      </div>
    </div>

    <!-- Results Screen -->
    <div v-else-if="isGameFinished" class="text-center">
      <h2 class="text-2xl font-bold mb-4">Game Complete!</h2>
      <p class="text-lg mb-4">
        Your score: {{ progress.score }}/{{ progress.total }} ({{
          Math.round((progress.score / progress.total) * 100)
        }}%)
      </p>
      <button
        @click="restartGame"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Play Again
      </button>
    </div>
  </div>
</template>
