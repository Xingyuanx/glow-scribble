<script setup>
import { ref, onMounted } from 'vue'

const currentQuote = ref('')
const quotes = [
  "✨ 哪怕再微小的光，也能照亮前路。",
  "🌱 种一棵树最好的时间是十年前，其次是现在。",
  "🌈 生活不只是眼前的苟且，还有诗和远方。",
  "🚀 每一天都是新的开始，去创造奇迹吧！",
  "🎨 你是自己生活的艺术家，尽情涂鸦吧！",
  "🍬 收集今日份的小确幸，酿成明天的糖。",
  "💪 坚持不是因为看到希望，而是坚持了才有希望。"
]

onMounted(() => {
  currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
})
</script>

<template>
  <div class="relative py-10 px-4">
    
    <!-- Hero Section -->
    <div class="text-center mb-10 md:mb-16 space-y-6 relative">
      <h2 class="text-5xl md:text-8xl font-black text-black drop-shadow-sm tracking-tighter transform -rotate-2">
        捕捉你的 <span class="bg-[#FF914D] px-4 text-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-3 hover:rotate-6 transition-transform">心情</span>
      </h2>
      
      <!-- Daily Quote -->
      <div class="inline-block relative group max-w-full">
        <p class="text-lg md:text-2xl text-black font-bold bg-white border-4 border-black px-4 md:px-8 py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 group-hover:-rotate-1 transition-transform cursor-default whitespace-normal break-words">
          💡 每日灵感：{{ currentQuote }}
        </p>
        <div class="absolute -top-4 -right-4 text-4xl animate-bounce hidden md:block">✨</div>
      </div>
    </div>

    <!-- Action Cards -->
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:gap-12 px-2 md:px-4">
      
      <!-- Diary Card -->
      <div 
        @click="$router.push('/diary')"
        class="group relative bg-[#7FBC8C] rounded-3xl p-6 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer overflow-hidden"
      >
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div class="w-20 h-20 bg-white border-4 border-black rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
              📒
            </div>
            <h3 class="text-4xl font-black mb-4 text-black tracking-tight">心情日记</h3>
            <p class="text-black font-bold text-lg mb-8 leading-relaxed">写下当下的想法，记录情绪的起伏，珍藏每一段回忆。</p>
          </div>
          <button class="w-full py-4 px-6 bg-black text-white font-black text-xl rounded-xl border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
            开始书写 ->
          </button>
        </div>
        
        <!-- Decoration -->
        <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-[#58A46A] rounded-full border-4 border-black"></div>
      </div>

      <!-- Todo Card -->
      <div 
        @click="$router.push('/todos')"
        class="group relative bg-[#5492FE] rounded-3xl p-6 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer overflow-hidden"
      >
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div class="w-20 h-20 bg-white border-4 border-black rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-12 transition-transform">
              ✅
            </div>
            <h3 class="text-4xl font-black mb-4 text-black tracking-tight">愿望清单</h3>
            <p class="text-black font-bold text-lg mb-8 leading-relaxed">规划今日任务，打卡小目标，让生活井井有条。</p>
          </div>
          <button class="w-full py-4 px-6 bg-black text-white font-black text-xl rounded-xl border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
            查看任务 ->
          </button>
        </div>

        <!-- Decoration -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-[#3B7ADD] rounded-full border-4 border-black"></div>
      </div>

      <!-- Focus Timer Card -->
      <div 
        @click="$router.push('/focus')"
        class="md:col-span-2 group relative bg-[#FF5757] rounded-3xl p-6 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer overflow-hidden"
      >
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex-1 text-center md:text-left">
            <div class="inline-flex w-20 h-20 bg-white border-4 border-black rounded-2xl items-center justify-center mb-6 text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
              🍅
            </div>
            <h3 class="text-4xl font-black mb-4 text-white tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">番茄专注</h3>
            <p class="text-white font-bold text-xl leading-relaxed drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">开启 25 分钟的高效专注，让每一个目标都触手可及。</p>
          </div>
          <div class="shrink-0">
             <button class="py-4 px-8 bg-black text-white font-black text-xl rounded-xl border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
              开始专注 ->
            </button>
          </div>
        </div>

        <!-- Decoration -->
        <div class="absolute -bottom-20 left-20 w-56 h-56 bg-[#E04848] rounded-full border-4 border-black"></div>
        <div class="absolute top-10 right-20 text-9xl opacity-20 -rotate-12 select-none">⏰</div>
      </div>

      <!-- Games Card -->
      <div 
        @click="$router.push('/games')"
        class="group relative bg-[#8C52FF] rounded-3xl p-6 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer overflow-hidden"
      >
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div class="w-20 h-20 bg-white border-4 border-black rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
              🎮
            </div>
            <h3 class="text-4xl font-black mb-4 text-white tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">解压乐园</h3>
            <p class="text-white font-bold text-lg mb-8 leading-relaxed drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">累了吗？来玩个小游戏放松一下吧！</p>
          </div>
          <button class="w-full py-4 px-6 bg-black text-white font-black text-xl rounded-xl border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
            开始游戏 ->
          </button>
        </div>

        <!-- Decoration -->
        <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-[#703CC2] rounded-full border-4 border-black"></div>
      </div>



      <!-- About Card -->
      <div 
        @click="$router.push('/about')"
        class="group relative bg-[#FFDE59] rounded-3xl p-6 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer overflow-hidden"
      >
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div class="w-20 h-20 bg-white border-4 border-black rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-12 transition-transform">
              😎
            </div>
            <h3 class="text-4xl font-black mb-4 text-black tracking-tight">关于我</h3>
            <p class="text-black font-bold text-lg mb-8 leading-relaxed">查看个人档案，统计数据，以及更多联系方式。</p>
          </div>
          <button class="w-full py-4 px-6 bg-black text-white font-black text-xl rounded-xl border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
            查看档案 ->
          </button>
        </div>

        <!-- Decoration -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-[#FFE57A] rounded-full border-4 border-black"></div>
      </div>

    </div>
  </div>
</template>
