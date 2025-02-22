<script setup lang="ts">
import Navbar from '@/components/ui/Navbar.vue'
</script>
<template>
    <div class="min-h-screen bg-pattern  text-white">
        <Navbar />
        <slot />
    </div>
</template>
<style scoped>
.bg-pattern {
  background-image: url('@/assets/bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
