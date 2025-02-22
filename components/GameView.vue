<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PythonEditor from './PythonEditor.vue'

const store = useGameStore();
const showFeedback = ref(false);
const hintVisible = ref(false);
const isCorrect = ref(false);
const feedbackMessage = ref("");

const currentExercise = computed(() => store.currentExercise);
const isGameFinished = computed(() => store.isGameFinished);
const progress = computed(() => store.progress);

// Compute the initial content for the editor
const editorContent = computed(() => {
  if (!currentExercise.value) return '';
  return [
    `// Question: ${currentExercise.value.question}`,
    '',
    currentExercise.value.code,
    '',
    '// Write your answer below:',
    ''  // Add an empty line for the answer
  ].join('\n');
});

// Track the user's answer from the editor content
const fullContent = ref(editorContent.value);

// Extract answer from the full content
const getUserAnswer = (content: string) => {
  const lines = content.split('\n');
  const answerMarkerIndex = lines.findIndex(line => 
    line.trim() === '// Write your answer below:');
  
  if (answerMarkerIndex === -1 || answerMarkerIndex === lines.length - 1) {
    return '';
  }

  // Get the next non-empty line after the marker
  for (let i = answerMarkerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('//')) {
      return line;
    }
  }
  
  return '';
};

onMounted(() => {
  store.initializeGame();
});

const checkAnswer = () => {
  if (!currentExercise.value) return;

  const userAnswer = getUserAnswer(fullContent.value);
  isCorrect.value = userAnswer === currentExercise.value.answer;
  feedbackMessage.value = isCorrect.value
    ? "Correct! Well done!"
    : "Not quite right.";

  if (isCorrect.value) {
    store.addScore();
  }

  showFeedback.value = true;
};

const nextQuestion = () => {
  showFeedback.value = false;
  hintVisible.value = false;
  store.nextExercise();
  // Reset the editor content for the next question
  fullContent.value = editorContent.value;
};

const skipQuestion = () => {
  store.skipExercise();
  hintVisible.value = false;
};

const showHint = () => {
  hintVisible.value = true;
};

const restartGame = () => {
  store.initializeGame();
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
      <PythonEditor
        v-model:content="fullContent"
        :initial-content="editorContent"
        :readonly="showFeedback"
        height="200px"
        :availableVariables="[
          { name: 'numbers', type: 'list', info: 'List of numbers to work with' }
        ]"
      />

      <div class="space-y-4 mt-4">
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
