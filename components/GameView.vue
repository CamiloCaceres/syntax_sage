<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PythonEditor from "~/components/editors/PythonEditor.vue";
import CodeEditor from "~/components/editors/CodeEditor.vue";

const store = useGameStore();
const showFeedback = ref(false);
const hintVisible = ref(false);
const isCorrect = ref(false);
const feedbackMessage = ref("");
const { currentLanguage } = useLanguage();

const currentExercise = computed(() => store.currentExercise);
const isGameFinished = computed(() => store.isGameFinished);
const progress = computed(() => store.progress);

// Compute the initial content for the editor
const editorContent = computed(() => {
  if (!currentExercise.value) return "";
  return [
    `${currentLanguage.value === "python" ? "# Question:" : "// Question:"} ${
      currentExercise.value.question
    }`,
    "",
    currentExercise.value.code,
    "",
    `${
      currentLanguage.value === "python"
        ? "# Write your answer below:"
        : "// Write your answer below:"
    }`,
    "", // Add an empty line for the answer
  ].join("\n");
});

// Track the user's answer from the editor content
const fullContent = ref(editorContent.value);

// Extract answer from the full content
const getUserAnswer = (content: string) => {
  const lines = content.split("\n");
  const answerMarkerIndex = lines.findIndex(
    (line) => line.trim() === "// Write your answer below:"
  );

  if (answerMarkerIndex === -1 || answerMarkerIndex === lines.length - 1) {
    return "";
  }

  // Get the next non-empty line after the marker
  for (let i = answerMarkerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith("//")) {
      return line;
    }
  }

  return "";
};
defineShortcuts({
  meta_enter: {
    usingInput: true,
    handler: () => {
      checkAnswer();
    },
  },
});

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
  <div
    class="max-w-4xl mx-auto px-2 py-4 md:p-8 rounded-3xl bg-gradient-to-br from-blue-800/10 via-slate-500/10 to-slate-800/10 backdrop-blur-sm"
  >
    <div class="flex justify-center">
      <h1
        class="text-4xl p-4 font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent text-center"
      >
        SyntaxSage
      </h1>
    </div>
    <!-- Progress Bar -->
    <div class="mt-4 mb-8 backdrop-blur-xl bg-white/0 rounded-2xl p-4 shadow-2xl">
      <div class="flex justify-between mb-3 text-blue-100">
        <span class="font-medium"
          >Progress: {{ progress.current }}/{{ progress.total }}</span
        >
        <span class="font-medium"
          >Score: {{ progress.score }}/{{ progress.attempted }}</span
        >
      </div>
      <div class="w-full bg-blue-950/50 rounded-full h-3">
        <div
          class="bg-blue-400 h-3 rounded-full transition-all duration-300 ease-out"
          :style="`width: ${(progress.current / progress.total) * 100}%`"
        ></div>
      </div>
    </div>

    <!-- Exercise Card -->
    <div
      v-if="currentExercise"
      class="backdrop-blur-2xl bg-white/0 rounded-3xl shadow-2xl px-4 py-8 md:p-8 border border-white/0"
    >
      <component
        :is="currentLanguage === 'python' ? PythonEditor : CodeEditor"
        v-model:content="fullContent"
        :initial-content="editorContent"
        :readonly="showFeedback"
        height="250px"
        class="mb-6"
        :availableVariables="[
          {
            name: 'numbers',
            type: 'list',
            info: 'List of numbers to work with',
          },
        ]"
      />

      <div class="space-y-6">
        <div class="flex gap-4">
          <button
            @click="checkAnswer"
            class="flex-1 bg-blue-500/80 hover:bg-blue-600/80 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="showFeedback"
          >
            Submit
          </button>
          <button
            @click="showHint"
            class="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-blue-100 py-3 px-6 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
            :disabled="showFeedback"
          >
            Hint
          </button>
          <button
            @click="skipQuestion"
            class="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-blue-100 py-3 px-6 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
            :disabled="showFeedback"
          >
            Skip
          </button>
        </div>

        <!-- Feedback Area -->
        <div v-if="showFeedback" class="space-y-4">
          <div
            :class="isCorrect ? 'text-green-400' : 'text-red-400'"
            class="text-lg font-medium"
          >
            {{ feedbackMessage }}
          </div>
          <div v-if="!isCorrect" class="text-blue-200">
            Correct answer:
            <code class="bg-blue-900/50 px-2 py-1 rounded">{{
              currentExercise.answer
            }}</code>
          </div>
          <div class="bg-blue-950/50 p-4 rounded-xl text-blue-100">
            <p>{{ currentExercise.explanation }}</p>
          </div>

          <button
            @click="nextQuestion"
            class="w-full bg-blue-500/80 hover:bg-blue-600/80 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
          >
            {{ isGameFinished ? "See Results" : "Next Question" }}
          </button>
        </div>

        <!-- Hint Area -->
        <div
          v-if="hintVisible && !showFeedback"
          class="bg-blue-950/50 p-4 rounded-xl text-blue-100"
        >
          <p>💡 {{ currentExercise.hint }}</p>
        </div>
      </div>
    </div>

    <!-- Results Screen -->
    <div
      v-else-if="isGameFinished"
      class="text-center backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20"
    >
      <h2 class="text-3xl font-bold mb-6 text-blue-100">Game Complete!</h2>
      <p class="text-xl mb-6 text-blue-200">
        Your score: {{ progress.score }}/{{ progress.total }} ({{
          Math.round((progress.score / progress.total) * 100)
        }}%)
      </p>
      <button
        @click="restartGame"
        class="bg-blue-500/80 hover:bg-blue-600/80 text-white py-3 px-8 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
      >
        Play Again
      </button>
    </div>
  </div>
</template>
