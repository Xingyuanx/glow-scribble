<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Timer Configuration
const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60

const timeLeft = ref(WORK_TIME)
const isRunning = ref(false)
const mode = ref('work') // 'work' or 'break'
let timerInterval = null

// Computed
const minutes = computed(() => Math.floor(timeLeft.value / 60).toString().padStart(2, '0'))
const seconds = computed(() => (timeLeft.value % 60).toString().padStart(2, '0'))
const progress = computed(() => {
  const total = mode.value === 'work' ? WORK_TIME : BREAK_TIME
  return ((total - timeLeft.value) / total) * 100
})

// Actions
const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval)
    isRunning.value = false
  } else {
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        // Timer finished
        playAlarm()
        switchMode()
      }
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timerInterval)
  isRunning.value = false
  timeLeft.value = mode.value === 'work' ? WORK_TIME : BREAK_TIME
}

const switchMode = () => {
  clearInterval(timerInterval)
  isRunning.value = false
  mode.value = mode.value === 'work' ? 'break' : 'work'
  timeLeft.value = mode.value === 'work' ? WORK_TIME : BREAK_TIME
}

const playAlarm = () => {
  // Simple browser beep sequence or visual alert
  if (navigator.vibrate) navigator.vibrate([200, 100, 200])
  alert(mode.value === 'work' ? '专注时间结束！休息一下吧 ☕️' : '休息结束！开始专注吧 🚀')
}

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
    
    <!-- Header -->
    <div class="flex items-center gap-4 md:gap-6 mb-8">
      <button 
        @click="$router.push('/')" 
        class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-[#FF5757] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
      >
        <span class="text-xl md:text-2xl font-black text-white group-hover:scale-110 transition-transform">←</span>
      </button>
      <h2 class="text-3xl md:text-5xl font-black text-black tracking-tighter bg-white px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
        番茄专注
      </h2>
    </div>

    <!-- Main Timer Card -->
    <div class="bg-white rounded-3xl p-6 md:p-16 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-center">
      
      <!-- Mode Indicator -->
      <div class="mb-8 md:mb-12 flex flex-col sm:flex-row justify-center gap-4">
        <button 
          @click="mode !== 'work' && switchMode()"
          class="px-6 py-2 rounded-xl border-4 border-black font-black text-xl transition-all"
          :class="mode === 'work' ? 'bg-[#FF5757] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-400 hover:bg-gray-50'"
        >
          🍅 专注模式
        </button>
        <button 
          @click="mode !== 'break' && switchMode()"
          class="px-6 py-2 rounded-xl border-4 border-black font-black text-xl transition-all"
          :class="mode === 'break' ? 'bg-[#7FBC8C] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-400 hover:bg-gray-50'"
        >
          ☕️ 休息模式
        </button>
      </div>

      <!-- Timer Display -->
      <div class="relative inline-block mb-12 md:mb-16">
        <div class="text-6xl sm:text-8xl md:text-[12rem] font-black text-black leading-none tracking-tighter tabular-nums drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
          {{ minutes }}:{{ seconds }}
        </div>
        
        <!-- Progress Bar Background -->
        <div class="absolute -bottom-4 md:-bottom-8 left-0 w-full h-4 md:h-6 bg-gray-200 rounded-full border-4 border-black overflow-hidden">
          <div 
            class="h-full transition-all duration-1000 ease-linear"
            :class="mode === 'work' ? 'bg-[#FF5757]' : 'bg-[#7FBC8C]'"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-center gap-6">
        <button 
          @click="toggleTimer"
          class="w-24 h-24 rounded-2xl border-4 border-black flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          :class="isRunning ? 'bg-yellow-400' : 'bg-white'"
        >
          {{ isRunning ? '⏸' : '▶️' }}
        </button>
        
        <button 
          @click="resetTimer"
          class="w-24 h-24 rounded-2xl border-4 border-black flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"
        >
          🔄
        </button>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-10 right-10 text-9xl opacity-10 pointer-events-none animate-spin-slow" style="animation-duration: 20s;">🍅</div>
      <div class="absolute bottom-10 left-10 text-9xl opacity-10 pointer-events-none animate-bounce" style="animation-duration: 3s;">⏰</div>
    </div>

    <!-- Tips -->
    <div class="mt-12 text-center">
      <p class="text-xl font-bold bg-[#FFDE59] inline-block px-8 py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        💡 保持专注 25 分钟，然后休息 5 分钟，让大脑更高效！
      </p>
    </div>

  </div>
</template>
