import { ref } from 'vue'
import type { ProgrammingLanguage } from '@/types'

export const useLanguage = () => {
  const currentLanguage = ref<ProgrammingLanguage>('python')

  const setLanguage = (language: ProgrammingLanguage) => {
    currentLanguage.value = language
  }

  return {
    currentLanguage,
    setLanguage
  }
} 