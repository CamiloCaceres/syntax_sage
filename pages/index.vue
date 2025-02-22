<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-8">Programming Methods Game</h1>

    <div class="flex  ">
   <GameView />
   <MonacoEditor v-model="code"/>
    </div>
  </div>
</template>

<script setup lang="ts">

const code = ref('')

</script>
