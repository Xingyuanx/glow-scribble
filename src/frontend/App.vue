<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'

const isBackendConnected = ref(false)
const connectionError = ref('')

// Check backend status
const checkConnection = async () => {
  try {
    const res = await fetch('/api/test')
    if (res.ok) {
      isBackendConnected.value = true
      connectionError.value = ''
    } else {
      throw new Error('Status ' + res.status)
    }
  } catch (err) {
    isBackendConnected.value = false
    connectionError.value = err.message
  }
}

onMounted(() => {
  checkConnection()
  setInterval(checkConnection, 10000)
})
</script>

<template>
  <!-- Global Background: Yellow Pop Art Style -->
  <div class="min-h-screen font-sans selection:bg-black selection:text-yellow-300 bg-[#FFDE59] relative overflow-x-hidden">
    
    <!-- Background Pattern (Polka Dots) -->
    <div class="fixed inset-0 opacity-10 pointer-events-none" 
         style="background-image: radial-gradient(#000 2px, transparent 2px); background-size: 30px 30px;">
    </div>

    <!-- Navbar / Header -->
    <header class="max-w-5xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center relative z-10">
      <!-- Logo: Chunky Box -->
      <div 
        class="flex items-center gap-3 cursor-pointer group bg-white border-4 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full md:w-auto justify-center"
        @click="$router.push('/')"
      >
        <div class="text-3xl animate-bounce">🎨</div>
        <h1 class="text-3xl font-black tracking-tighter text-black transform group-hover:scale-105 transition-transform">
          拾光涂鸦
        </h1>
      </div>
      
      <!-- Backend Status: Brutalist Badge -->
      <div 
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
      >
        <span class="relative flex h-3 w-3">
          <span v-if="isBackendConnected" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 border-2 border-black" :class="isBackendConnected ? 'bg-green-500' : 'bg-red-500'"></span>
        </span>
        <span class="uppercase tracking-widest">{{ isBackendConnected ? '在线' : '离线' }}</span>
      </div>
    </header>

    <!-- Main Content (Routed) -->
    <main class="w-full relative z-0">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="text-center py-12 text-black font-bold text-sm relative z-10">
      <p class="bg-white inline-block px-4 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        © 2026 拾光涂鸦 (Glow Scribble) • 为快乐而生
      </p>
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>
