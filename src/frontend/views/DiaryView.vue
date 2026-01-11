<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const entries = ref([])
const newContent = ref('')
const selectedMood = ref('happy')
const isLoading = ref(false)

// Calendar State
const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const moods = [
  { id: 'happy', emoji: '😊', label: '开心', color: 'bg-[#FFDE59]', active: 'ring-4 ring-black scale-110' },
  { id: 'calm', emoji: '😌', label: '平静', color: 'bg-[#5492FE]', active: 'ring-4 ring-black scale-110' },
  { id: 'sad', emoji: '😢', label: '难过', color: 'bg-[#8C52FF]', active: 'ring-4 ring-black scale-110' },
  { id: 'angry', emoji: '😡', label: '生气', color: 'bg-[#FF5757]', active: 'ring-4 ring-black scale-110' },
  { id: 'excited', emoji: '🤩', label: '兴奋', color: 'bg-[#FF914D]', active: 'ring-4 ring-black scale-110' },
]

// Computed for Calendar
const entryDates = computed(() => {
  const dates = new Set()
  entries.value.forEach(entry => {
    // Ensure we handle timezone correctly or just use UTC date part if backend stores ISO
    const date = new Date(entry.created_at).toLocaleDateString('en-CA') // YYYY-MM-DD local time
    dates.add(date)
  })
  return dates
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  
  // Padding for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push({ id: `pad-${i}`, val: '', isPadding: true })
  }
  
  // Days of current month
  const today = new Date().toLocaleDateString('en-CA')
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      id: dateStr,
      val: i,
      dateStr: dateStr,
      hasEntry: entryDates.value.has(dateStr),
      isToday: dateStr === today
    })
  }
  
  return days
})

const changeMonth = (delta) => {
  let newMonth = currentMonth.value + delta
  if (newMonth > 11) {
    currentYear.value++
    currentMonth.value = 0
  } else if (newMonth < 0) {
    currentYear.value--
    currentMonth.value = 11
  } else {
    currentMonth.value = newMonth
  }
}

const scrollToDate = (dateStr) => {
  if (!dateStr) return
  // Find first element with data-date attribute matching dateStr
  // We use querySelectorAll and pick the last one (newest) or first one? 
  // List is reversed (newest first), so querySelector finds the newest one for that day.
  const el = document.querySelector(`[data-date="${dateStr}"]`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // Flash effect
    el.classList.add('ring-4', 'ring-[#FF5757]', 'scale-[1.02]')
    setTimeout(() => el.classList.remove('ring-4', 'ring-[#FF5757]', 'scale-[1.02]'), 1500)
  } else {
    alert('那天没有日记哦！')
  }
}

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

const handleAuthError = (res) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token')
    router.push('/login')
    return true
  }
  return false
}

// Fetch entries
const fetchEntries = async () => {
  try {
    const res = await fetch('/api/entries', {
      headers: getHeaders()
    })
    
    if (handleAuthError(res)) return

    const data = await res.json()
    if (data.message === 'success') {
      entries.value = data.data
    }
  } catch (err) {
    console.error('Failed to fetch entries:', err)
  }
}

// Add entry
const addEntry = async () => {
  if (!newContent.value.trim()) return

  isLoading.value = true
  try {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        content: newContent.value,
        mood: selectedMood.value
      })
    })
    
    if (handleAuthError(res)) return

    if (res.ok) {
      newContent.value = ''
      await fetchEntries() // Refresh list
    }
  } catch (err) {
    console.error('Failed to add entry:', err)
  } finally {
    isLoading.value = false
  }
}

// Delete entry
const deleteEntry = async (id) => {
  if (!confirm('确定要删除这条日记吗？')) return

  try {
    const res = await fetch(`/api/entries/${id}`, { 
      method: 'DELETE',
      headers: getHeaders()
    })
    
    if (handleAuthError(res)) return

    if (res.ok) {
      entries.value = entries.value.filter(e => e.id !== id)
    }
  } catch (err) {
    console.error('Failed to delete entry:', err)
  }
}

// Format date
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMoodConfig = (moodId) => {
  return moods.find(m => m.id === moodId) || moods[0]
}

onMounted(() => {
  fetchEntries()
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
      <h2 class="text-3xl md:text-5xl font-black text-black tracking-tighter bg-white px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
        心情日记
      </h2>
    </div>
    
    <!-- Calendar Section -->
    <div class="bg-white rounded-3xl p-4 md:p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 md:mb-12">
      <div class="flex justify-between items-center mb-6">
        <button @click="changeMonth(-1)" class="p-2 hover:bg-gray-100 rounded-lg font-black text-xl border-2 border-transparent hover:border-black transition-all">←</button>
        <h3 class="text-xl md:text-2xl font-black text-black">
          {{ currentYear }}年 {{ currentMonth + 1 }}月
        </h3>
        <button @click="changeMonth(1)" class="p-2 hover:bg-gray-100 rounded-lg font-black text-xl border-2 border-transparent hover:border-black transition-all">→</button>
      </div>
      
      <div class="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
        <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" class="font-bold text-gray-500 text-sm md:text-base">
          {{ day }}
        </div>
      </div>
      
      <div class="grid grid-cols-7 gap-1 md:gap-2">
        <div 
          v-for="day in calendarDays" 
          :key="day.id"
          class="aspect-square flex items-center justify-center rounded-lg md:rounded-xl font-bold text-sm md:text-lg relative transition-all select-none"
          :class="[
            day.isPadding ? 'invisible' : 'cursor-pointer hover:bg-gray-100',
            day.isToday ? 'bg-black text-white' : '',
            day.hasEntry && !day.isToday ? 'bg-[#FFDE59] border-2 border-black' : '',
            day.hasEntry && day.isToday ? 'border-2 border-[#FFDE59]' : ''
          ]"
          @click="!day.isPadding && scrollToDate(day.dateStr)"
        >
          {{ day.val }}
          <!-- Indicator dot for entries -->
          <div v-if="day.hasEntry" class="absolute bottom-1 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full" :class="day.isToday ? 'bg-[#FFDE59]' : 'bg-black'"></div>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="bg-white rounded-3xl p-4 md:p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 md:mb-12">
      <textarea 
        v-model="newContent"
        placeholder="今天发生了什么有趣的事？..." 
        class="w-full h-40 p-4 bg-[#F0F0F0] rounded-xl border-4 border-black resize-none focus:ring-0 focus:bg-white transition-all text-black font-medium text-xl placeholder:text-gray-400 mb-6"
      ></textarea>
      
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
        <!-- Mood Selector -->
        <div class="flex gap-4 bg-[#F0F0F0] p-3 rounded-xl border-4 border-black flex-wrap justify-center sm:justify-start">
          <button 
            v-for="mood in moods" 
            :key="mood.id"
            @click="selectedMood = mood.id"
            class="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 border-2 border-black"
            :class="[mood.color, selectedMood === mood.id ? mood.active : 'opacity-50 hover:opacity-100 hover:scale-110']"
            :title="mood.label"
          >
            {{ mood.emoji }}
          </button>
        </div>

        <!-- Submit Button -->
        <button 
          @click="addEntry"
          :disabled="!newContent.trim() || isLoading"
          class="w-full sm:w-auto px-8 py-3 bg-[#FF914D] text-black border-4 border-black font-black text-xl rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="animate-spin">🌀</span>
          <span v-else>发布日记 🚀</span>
        </button>
      </div>
    </div>

    <!-- Entries List -->
    <div class="space-y-6 md:space-y-8">
      <transition-group name="list">
        <div 
          v-for="entry in entries" 
          :key="entry.id"
          :data-date="new Date(entry.created_at).toLocaleDateString('en-CA')"
          class="group relative rounded-2xl p-4 md:p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
        >
          <!-- Mood Color Strip -->
          <div class="absolute top-0 left-6 md:left-8 w-12 md:w-16 h-3 md:h-4 border-b-4 border-x-4 border-black rounded-b-lg" :class="getMoodConfig(entry.mood).color"></div>

          <!-- Delete Button -->
          <button 
            @click="deleteEntry(entry.id)"
            class="absolute top-3 md:top-4 right-3 md:right-4 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors"
            title="删除"
          >
            ✕
          </button>

          <div class="flex items-start gap-4 md:gap-6 mt-3 md:mt-4">
            <!-- Mood Icon -->
            <div 
              class="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-4xl shrink-0 border-4 border-black"
              :class="getMoodConfig(entry.mood).color"
            >
              {{ getMoodConfig(entry.mood).emoji }}
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="inline-block bg-black text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded mb-1 md:mb-2 transform -rotate-1">
                {{ formatDate(entry.created_at) }}
              </div>
              <p class="text-black whitespace-pre-wrap leading-relaxed text-lg md:text-xl font-bold break-words">{{ entry.content }}</p>
            </div>
          </div>
        </div>
      </transition-group>
      
      <!-- Empty State -->
      <div v-if="entries.length === 0" class="text-center py-20 bg-white rounded-3xl border-4 border-black border-dashed opacity-70">
        <div class="text-7xl mb-6 animate-bounce">🍃</div>
        <p class="text-2xl font-black text-black">空空如也！<br>快来填满这个框框！</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}
</style>
