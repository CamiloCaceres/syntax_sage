<script setup lang="ts">
import LangToggle from './LangToggle.vue'
import { useLanguage } from '@/composables/useLanguage'

const { currentLanguage } = useLanguage()
</script>

<template>
  <nav
    class="w-full backdrop-blur-sm bg-blue-950/30 border-b border-blue-800/50 shadow-lg z-50"
  >
    <div class="container mx-auto px-4 py-6 flex justify-end items-center">

      <!-- Language Toggle -->
      <LangToggle v-model="currentLanguage" />
    </div>
  </nav>
</template>
