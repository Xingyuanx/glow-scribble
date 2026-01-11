<script setup>
import { ref, onMounted } from 'vue'

const entryCount = ref(0)
const todoCount = ref(0)
const completedTodoCount = ref(0)
const daysActive = ref(1) // Mock data for now

// Fetch simple stats
const fetchStats = async () => {
  try {
    // Entries
    const resEntries = await fetch('/api/entries')
    const dataEntries = await resEntries.json()
    if (dataEntries.message === 'success') {
      entryCount.value = dataEntries.data.length
    }

    // Todos
    const resTodos = await fetch('/api/todos')
    const dataTodos = await resTodos.json()
    if (dataTodos.message === 'success') {
      todoCount.value = dataTodos.data.length
      completedTodoCount.value = dataTodos.data.filter(t => t.completed).length
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
    
    <!-- Header -->
    <div class="flex items-center gap-4 md:gap-6 mb-8">
      <button 
        @click="$router.push('/')" 
        class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        <span class="text-xl md:text-2xl font-black">←</span>
      </button>
      <h2 class="text-3xl md:text-5xl font-black text-black tracking-tighter bg-white px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
        关于我
      </h2>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8 md:mb-12 relative overflow-hidden">
      <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
        <!-- Avatar Area -->
        <div class="shrink-0 relative">
          <div class="w-32 h-32 md:w-40 md:h-40 bg-[#FFDE59] rounded-full border-4 border-black flex items-center justify-center text-6xl md:text-8xl overflow-hidden relative z-10">
            😎
          </div>
          <!-- Decorative Elements behind avatar -->
          <div class="absolute -top-4 -left-4 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black bg-black z-0"></div>
        </div>

        <!-- Info Area -->
        <div class="flex-1 text-center md:text-left space-y-4">
          <h3 class="text-4xl font-black text-black">你的昵称</h3>
          <div class="flex flex-wrap gap-2 justify-center md:justify-start">
            <span class="px-3 py-1 bg-[#FF914D] border-2 border-black rounded-lg font-bold text-sm">全栈练习生</span>
            <span class="px-3 py-1 bg-[#5492FE] border-2 border-black rounded-lg font-bold text-sm">Vue 爱好者</span>
            <span class="px-3 py-1 bg-[#8C52FF] border-2 border-black rounded-lg font-bold text-sm text-white">多巴胺中毒</span>
          </div>
          <p class="text-xl font-bold text-gray-700 leading-relaxed max-w-lg">
            你好！这是我的个人空间。在这里记录生活，规划未来，享受当下的快乐。✨
          </p>
        </div>
      </div>

      <!-- Background Decorations -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full -translate-y-1/2 translate-x-1/2 border-4 border-black opacity-50"></div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <!-- Stat 1 -->
      <div class="bg-[#FF914D] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:-rotate-2 transition-transform">
        <div class="text-5xl mb-2">📅</div>
        <div class="text-4xl font-black text-black mb-1">{{ entryCount }}</div>
        <div class="font-bold text-black">篇日记</div>
      </div>

      <!-- Stat 2 -->
      <div class="bg-[#5492FE] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:rotate-2 transition-transform">
        <div class="text-5xl mb-2">✅</div>
        <div class="text-4xl font-black text-black mb-1">{{ completedTodoCount }}/{{ todoCount }}</div>
        <div class="font-bold text-black">任务完成</div>
      </div>

      <!-- Stat 3 -->
      <div class="bg-[#7FBC8C] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:-rotate-1 transition-transform">
        <div class="text-5xl mb-2">🌟</div>
        <div class="text-4xl font-black text-black mb-1">{{ daysActive }}</div>
        <div class="font-bold text-black">天加入</div>
      </div>
    </div>

    <!-- Links / Contact -->
    <div class="grid grid-cols-2 gap-6">
      <a href="https://github.com" target="_blank" class="flex items-center justify-center gap-3 p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black text-xl text-black no-underline">
        <span class="text-2xl">🐙</span> GitHub
      </a>
      <a href="mailto:example@email.com" class="flex items-center justify-center gap-3 p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black text-xl text-black no-underline">
        <span class="text-2xl">📧</span> Email
      </a>
    </div>

  </div>
</template>
