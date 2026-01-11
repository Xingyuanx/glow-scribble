<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const todos = ref([])
const newTask = ref('')
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
        愿望清单
      </h2>
    </div>

    <!-- Input Section -->
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
