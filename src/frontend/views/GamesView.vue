<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeGame = ref(null) // null, 'mole', 'bubble'

// --- Game 1: Whack-a-Mole (Emoji Edition) ---
const score = ref(0)
const timeLeft = ref(30)
const isPlaying = ref(false)
const activeHole = ref(-1) // 0-8
let gameTimer = null
let moleTimer = null
const moles = ['🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁']
const currentMole = ref('🐭')

const startGame = () => {
  score.value = 0
  timeLeft.value = 30
  isPlaying.value = true
  
  // Game countdown
  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)

  // Mole movement
  moveMole()
}

const moveMole = () => {
  if (!isPlaying.value) return
  
  const randomHole = Math.floor(Math.random() * 9)
  const randomMole = moles[Math.floor(Math.random() * moles.length)]
  
  activeHole.value = randomHole
  currentMole.value = randomMole
  
  // Random speed between 500ms and 1000ms
  const speed = Math.max(400, 1000 - score.value * 20) 
  
  if (moleTimer) clearTimeout(moleTimer)
  moleTimer = setTimeout(moveMole, speed)
}

const whack = (index) => {
  if (!isPlaying.value) return
  if (index === activeHole.value) {
    score.value++
    activeHole.value = -1 // Hide immediately
    // Optional: Play sound or visual effect
    if (moleTimer) clearTimeout(moleTimer)
    moveMole() // Spawn next immediately
  } else {
    score.value = Math.max(0, score.value - 1) // Penalty
  }
}

const endGame = () => {
  isPlaying.value = false
  activeHole.value = -1
  clearInterval(gameTimer)
  clearTimeout(moleTimer)
}

// --- Game 2: Bubble Wrap ---
const bubbles = ref(Array(30).fill(false)) // false = unpopped, true = popped

const popBubble = (index) => {
  if (!bubbles.value[index]) {
    bubbles.value[index] = true
    // Vibration if supported
    if (navigator.vibrate) navigator.vibrate(50)
  }
}

const resetBubbles = () => {
  bubbles.value = bubbles.value.fill(false)
}

// --- Lifecycle ---
onUnmounted(() => {
  clearInterval(gameTimer)
  clearTimeout(moleTimer)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
    
    <!-- Header -->
    <div class="flex items-center gap-4 md:gap-6 mb-8">
      <button 
        @click="activeGame ? activeGame = null : router.push('/')" 
        class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        <span class="text-xl md:text-2xl font-black">←</span>
      </button>
      <h2 class="text-3xl md:text-5xl font-black text-black tracking-tighter bg-white px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
        {{ activeGame === 'mole' ? '打地鼠' : activeGame === 'bubble' ? '捏泡泡' : '解压乐园' }}
      </h2>
    </div>

    <!-- Game Selection Menu -->
    <div v-if="!activeGame" class="grid md:grid-cols-2 gap-8">
      <!-- Card 1: Whack-a-Mole -->
      <div 
        @click="activeGame = 'mole'"
        class="group cursor-pointer bg-[#FFDE59] p-6 md:p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden"
      >
        <div class="text-8xl mb-4 transform group-hover:scale-110 transition-transform">🐹</div>
        <h3 class="text-3xl font-black text-black mb-2">极速打地鼠</h3>
        <p class="text-lg font-bold">测试你的反应速度！不要让它们跑掉！</p>
        <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-300 rounded-full border-4 border-black opacity-50"></div>
      </div>

      <!-- Card 2: Bubble Wrap -->
      <div 
        @click="activeGame = 'bubble'"
        class="group cursor-pointer bg-[#FF914D] p-6 md:p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden"
      >
        <div class="text-8xl mb-4 transform group-hover:rotate-12 transition-transform">🫧</div>
        <h3 class="text-3xl font-black text-black mb-2">无限捏泡泡</h3>
        <p class="text-lg font-bold">强迫症福音，根本停不下来！</p>
        <div class="absolute -top-6 -right-6 w-32 h-32 bg-orange-300 rounded-full border-4 border-black opacity-50"></div>
      </div>
    </div>

    <!-- Game Interface: Whack-a-Mole -->
    <div v-else-if="activeGame === 'mole'" class="bg-white p-6 md:p-8 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div class="flex justify-between items-center mb-8">
        <div class="text-xl md:text-2xl font-black bg-[#FFDE59] px-4 py-2 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          得分: {{ score }}
        </div>
        <div class="text-xl md:text-2xl font-black bg-[#FF5757] px-4 py-2 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
          时间: {{ timeLeft }}s
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-8">
        <div 
          v-for="(n, index) in 9" 
          :key="index"
          @mousedown="whack(index)"
          class="aspect-square bg-[#F0F0F0] rounded-2xl border-4 border-black flex items-center justify-center text-6xl cursor-pointer relative overflow-hidden active:bg-gray-200"
        >
          <!-- Hole visual -->
          <div class="absolute bottom-2 w-3/4 h-1/4 bg-black/10 rounded-full"></div>
          
          <!-- Mole -->
          <transition name="pop">
            <div v-if="activeHole === index" class="absolute bottom-2 z-10 select-none">
              {{ currentMole }}
            </div>
          </transition>
        </div>
      </div>

      <div class="text-center">
        <button 
          v-if="!isPlaying"
          @click="startGame"
          class="px-12 py-4 bg-[#7FBC8C] text-black font-black text-2xl rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
        >
          {{ timeLeft === 0 ? '再来一局' : '开始游戏' }}
        </button>
      </div>
    </div>

    <!-- Game Interface: Bubble Wrap -->
    <div v-else-if="activeGame === 'bubble'" class="bg-white p-6 md:p-8 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div class="grid grid-cols-4 sm:grid-cols-6 gap-3 md:gap-4 mb-8">
        <button
          v-for="(popped, index) in bubbles"
          :key="index"
          @click="popBubble(index)"
          class="aspect-square rounded-full border-4 border-black transition-all duration-200 flex items-center justify-center relative"
          :class="popped ? 'bg-gray-200 shadow-inner' : 'bg-[#5492FE] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'"
        >
          <span v-if="popped" class="text-gray-400 font-black text-xl">POP</span>
          <div v-else class="w-1/3 h-1/3 bg-white/30 rounded-full absolute top-2 right-2"></div>
        </button>
      </div>

      <div class="text-center">
        <button 
          @click="resetBubbles"
          class="px-8 py-3 bg-[#FF914D] text-black font-black text-xl rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          全部还原 🔄
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.pop-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
