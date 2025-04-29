<script setup lang="ts">
import { request } from '@/utils'
import { onMounted, ref } from 'vue'

const welcome = ref('')

onMounted(async () => {
  const data = await request('/api')
  welcome.value = data
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold text-primary">
      {{ welcome }}
    </h1>
  </div>
</template>
