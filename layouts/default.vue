<script setup lang="ts">
import Navbar from '@/components/ui/Navbar.vue'
</script>
<template>
    <div class="min-h-screen bg-gradient-to-tl from-blue-900 to-slate-900  text-white">
        <Navbar />
        <slot />
    </div>
</template>
