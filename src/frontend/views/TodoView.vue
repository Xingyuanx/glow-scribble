<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const todos = ref([])
const habits = ref([])
const newTask = ref('')
const newHabitName = ref('')
const showHabitInput = ref(false)
const isLoading = ref(false)

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

// Fetch todos
const fetchTodos = async () => {
  try {
    const res = await fetch('/api/todos', {
      headers: getHeaders()
    })
    
    if (handleAuthError(res)) return

    const data = await res.json()
    if (data.message === 'success') {
      todos.value = data.data
    }
  } catch (err) {
    console.error('Failed to fetch todos:', err)
  }
}

// Fetch habits
const fetchHabits = async () => {
  try {
    const res = await fetch('/api/habits', { headers: getHeaders() })
    if (handleAuthError(res)) return
    const data = await res.json()
    if (data.message === 'success') {
      habits.value = data.data
    }
  } catch (err) {
    console.error('Failed to fetch habits:', err)
  }
}

// Add habit
const addHabit = async () => {
  if (!newHabitName.value.trim()) return
  
  const icons = ['💧', '🏃', '📚', '🧘', '🥗', '💊', '🧹', '🎨']
  const colors = ['bg-[#7FBC8C]', 'bg-[#5492FE]', 'bg-[#FF914D]', 'bg-[#FF5757]']
  
  try {
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        name: newHabitName.value,
        icon: icons[Math.floor(Math.random() * icons.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    })
    
    if (handleAuthError(res)) return
    if (res.ok) {
      newHabitName.value = ''
      showHabitInput.value = false
      await fetchHabits()
    }
  } catch (err) {
    console.error('Failed to add habit:', err)
  }
}

// Check-in habit
const checkinHabit = async (habit) => {
  try {
    const res = await fetch(`/api/habits/${habit.id}/checkin`, {
      method: 'PUT',
      headers: getHeaders()
    })
    
    if (handleAuthError(res)) return
    
    const data = await res.json()
    if (res.ok) {
      // Update local state
      const index = habits.value.findIndex(h => h.id === habit.id)
      if (index !== -1) {
        habits.value[index] = data.data
      }
    }
  } catch (err) {
    console.error('Failed to checkin habit:', err)
  }
}

// Delete habit
const deleteHabit = async (id) => {
  if (!confirm('确定要删除这个习惯吗？')) return
  try {
    const res = await fetch(`/api/habits/${id}`, { 
      method: 'DELETE',
      headers: getHeaders()
    })
    if (handleAuthError(res)) return
    if (res.ok) {
      habits.value = habits.value.filter(h => h.id !== id)
    }
  } catch (err) {
    console.error('Failed to delete habit:', err)
  }
}

// Add todo
const addTodo = async () => {
  if (!newTask.value.trim()) return

  isLoading.value = true
  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ task: newTask.value })
    })
    
    if (handleAuthError(res)) return

    if (res.ok) {
      newTask.value = ''
      await fetchTodos()
    }
  } catch (err) {
    console.error('Failed to add todo:', err)
  } finally {
    isLoading.value = false
  }
}

// Toggle completion
const toggleTodo = async (todo) => {
  try {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ completed: todo.completed ? 0 : 1 })
    })
    
    if (handleAuthError(res)) return

    if (res.ok) {
      // Optimistic update locally
      todo.completed = !todo.completed
    }
  } catch (err) {
    console.error('Failed to update todo:', err)
  }
}

// Delete todo
const deleteTodo = async (id) => {
  if (!confirm('确定要删除这个任务吗？')) return

  try {
    const res = await fetch(`/api/todos/${id}`, { 
      method: 'DELETE',
      headers: getHeaders()
    })
    
    if (handleAuthError(res)) return

    if (res.ok) {
      todos.value = todos.value.filter(t => t.id !== id)
    }
  } catch (err) {
    console.error('Failed to delete todo:', err)
  }
}

onMounted(() => {
  fetchTodos()
  fetchHabits()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
    <!-- Header -->
    <div class="flex items-center gap-4 md:gap-6 mb-8">
      <button 
        @click="$router.push('/')" 
        class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-[#5492FE] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
      >
        <span class="text-xl md:text-2xl font-black text-white group-hover:scale-110 transition-transform">←</span>
      </button>
      <h2 class="text-3xl md:text-5xl font-black text-black tracking-tighter bg-white px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
        愿望清单
      </h2>
    </div>

    <!-- Habit Tracker Section -->
    <div class="mb-12">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-2xl font-black text-black">🌱 小习惯打卡</h3>
        <button 
          @click="showHabitInput = !showHabitInput"
          class="text-sm font-bold bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {{ showHabitInput ? '取消' : '添加习惯' }}
        </button>
      </div>

      <!-- Add Habit Input -->
      <div v-if="showHabitInput" class="flex gap-2 mb-4 animate-slide-down">
        <input 
          v-model="newHabitName"
          @keyup.enter="addHabit"
          type="text" 
          placeholder="习惯名称 (如: 喝水)" 
          class="flex-1 px-4 py-2 border-4 border-black rounded-xl focus:outline-none"
        >
        <button @click="addHabit" class="px-4 py-2 bg-[#7FBC8C] border-4 border-black rounded-xl font-bold">OK</button>
      </div>

      <!-- Habits Horizontal Scroll -->
      <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <div 
          v-for="habit in habits" 
          :key="habit.id"
          class="flex-shrink-0 w-32 h-32 bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group cursor-pointer hover:-translate-y-1 transition-transform flex flex-col items-center justify-center gap-2 select-none"
          @click="checkinHabit(habit)"
        >
          <button 
            @click.stop="deleteHabit(habit.id)"
            class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >✕</button>
          
          <div class="text-4xl transition-transform" :class="{ 'scale-125': habit.lastCompleted === new Date().toISOString().split('T')[0] }">
            {{ habit.icon }}
          </div>
          <div class="font-bold text-sm">{{ habit.name }}</div>
          
          <!-- Streak Badge -->
          <div v-if="habit.streak > 0" class="absolute -bottom-2 bg-black text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            🔥 {{ habit.streak }}
          </div>
          
          <!-- Done Overlay -->
          <div v-if="habit.lastCompleted === new Date().toISOString().split('T')[0]" class="absolute inset-0 bg-[#7FBC8C] opacity-20 rounded-xl pointer-events-none"></div>
        </div>
        
        <!-- Empty State for Habits -->
        <div v-if="habits.length === 0 && !showHabitInput" class="flex-shrink-0 w-32 h-32 border-4 border-black border-dashed rounded-2xl flex items-center justify-center text-gray-400 font-bold text-sm text-center p-2">
          点击右上角<br>添加习惯
        </div>
      </div>
    </div>

    <!-- Todo Input Section -->
    <div class="flex gap-4 mb-8 md:mb-12 flex-col sm:flex-row">
      <input 
        v-model="newTask"
        @keyup.enter="addTodo"
        type="text" 
        placeholder="添加一个新的小目标..." 
        class="flex-1 px-6 py-4 bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-xl font-bold text-black placeholder:text-gray-400 transition-all"
      >
      <button 
        @click="addTodo"
        :disabled="!newTask.trim() || isLoading"
        class="px-8 py-4 bg-[#5492FE] text-black font-black rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all flex items-center justify-center text-3xl"
      >
        +
      </button>
    </div>

    <!-- Todo List -->
    <div class="space-y-4">
      <transition-group name="list">
        <div 
          v-for="todo in todos" 
          :key="todo.id"
          class="group flex items-center gap-3 md:gap-5 bg-white p-4 md:p-5 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer select-none"
          :class="{ 'bg-gray-100 opacity-80': todo.completed }"
          @click="toggleTodo(todo)"
        >
          <!-- Checkbox -->
          <div 
            class="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-black flex items-center justify-center transition-all duration-200 flex-shrink-0"
            :class="todo.completed ? 'bg-[#7FBC8C] rotate-6' : 'bg-white group-hover:bg-gray-50'"
          >
            <span v-if="todo.completed" class="text-black text-lg md:text-xl font-black animate-check">✓</span>
          </div>

          <!-- Task Text -->
          <div 
            class="flex-1 text-lg md:text-2xl font-bold text-black transition-all duration-300 break-words min-w-0" 
            :class="{ 'line-through text-gray-400': todo.completed }"
          >
            {{ todo.task }}
          </div>

          <!-- Delete Button -->
          <button 
            @click.stop="deleteTodo(todo.id)"
            class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg border-4 border-black bg-[#FF5757] text-black font-black hover:bg-red-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:rotate-3 md:hover:rotate-6 flex-shrink-0"
            title="删除"
          >
            ✕
          </button>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="todos.length === 0" class="text-center py-20 bg-white rounded-3xl border-4 border-black border-dashed opacity-70">
        <div class="text-7xl mb-6 animate-pulse">🎯</div>
        <p class="text-2xl font-black text-black">空空如也！<br>定个小目标吧！</p>
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
  transform: translateX(-30px) rotate(-2deg);
}
@keyframes check {
  0% { transform: scale(0); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}
.animate-check {
  animation: check 0.2s ease-out forwards;
}
</style>
