<script setup>
import { ref, onMounted } from 'vue'

const entries = ref([])
const newContent = ref('')
const selectedMood = ref('happy')
const isLoading = ref(false)

const moods = [
  { id: 'happy', emoji: '😊', label: '开心', color: 'bg-[#FFDE59]', active: 'ring-4 ring-black scale-110' },
  { id: 'calm', emoji: '😌', label: '平静', color: 'bg-[#5492FE]', active: 'ring-4 ring-black scale-110' },
  { id: 'sad', emoji: '😢', label: '难过', color: 'bg-[#8C52FF]', active: 'ring-4 ring-black scale-110' },
  { id: 'angry', emoji: '😡', label: '生气', color: 'bg-[#FF5757]', active: 'ring-4 ring-black scale-110' },
  { id: 'excited', emoji: '🤩', label: '兴奋', color: 'bg-[#FF914D]', active: 'ring-4 ring-black scale-110' },
]

// Fetch entries
const fetchEntries = async () => {
  try {
    const res = await fetch('/api/entries')
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newContent.value,
        mood: selectedMood.value
      })
    })
    
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
    const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' })
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
    <div class="space-y-8">
      <transition-group name="list">
        <div 
          v-for="entry in entries" 
          :key="entry.id"
          class="group relative rounded-2xl p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
        >
          <!-- Mood Color Strip -->
          <div class="absolute top-0 left-8 w-16 h-4 border-b-4 border-x-4 border-black rounded-b-lg" :class="getMoodConfig(entry.mood).color"></div>

          <!-- Delete Button -->
          <button 
            @click="deleteEntry(entry.id)"
            class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors"
            title="删除"
          >
            ✕
          </button>

          <div class="flex items-start gap-6 mt-4">
            <!-- Mood Icon -->
            <div 
              class="w-16 h-16 rounded-xl flex items-center justify-center text-4xl shrink-0 border-4 border-black"
              :class="getMoodConfig(entry.mood).color"
            >
              {{ getMoodConfig(entry.mood).emoji }}
            </div>
            
            <div class="flex-1">
              <div class="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded mb-2 transform -rotate-1">
                {{ formatDate(entry.created_at) }}
              </div>
              <p class="text-black whitespace-pre-wrap leading-relaxed text-xl font-bold">{{ entry.content }}</p>
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
