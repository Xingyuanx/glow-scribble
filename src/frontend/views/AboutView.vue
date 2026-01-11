<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const entryCount = ref(0)
const todoCount = ref(0)
const completedTodoCount = ref(0)
const daysActive = ref(1) // Mock data for now
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

// Colors for new tags
const tagColors = [
  'bg-[#FF914D]', 'bg-[#5492FE]', 'bg-[#8C52FF]', 
  'bg-[#FFDE59]', 'bg-[#FF5757]', 'bg-[#7FBC8C]'
]

// Avatar options
const avatarOptions = ['😎', '🤖', '👻', '🐱', '🐶', '🦊', '🦁', '🐼', '🐨', '🐯', '🦄', '🐲', '🌵', '🌻', '🍕', '🍔', '🍦', '🍩', '🚀', '⭐', '🌈', '🔥', '💻', '🎮']

// Editing state
const isEditing = ref(false)
const editBio = ref('')
const editTags = ref([])
const editAvatar = ref('')
const newTagText = ref('')
const isSaving = ref(false)

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

// Fetch simple stats
const fetchStats = async () => {
  try {
    // Entries
    const resEntries = await fetch('/api/entries', { headers: getHeaders() })
    if (handleAuthError(resEntries)) return
    const dataEntries = await resEntries.json()
    if (dataEntries.message === 'success') {
      entryCount.value = dataEntries.data.length
    }

    // Todos
    const resTodos = await fetch('/api/todos', { headers: getHeaders() })
    if (handleAuthError(resTodos)) return
    const dataTodos = await resTodos.json()
    if (dataTodos.message === 'success') {
      todoCount.value = dataTodos.data.length
      completedTodoCount.value = dataTodos.data.filter(t => t.completed).length
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}

const startEditing = () => {
  editBio.value = user.value.bio || '你好！这是我的个人空间。在这里记录生活，规划未来，享受当下的快乐。✨'
  // Initialize tags from user or empty
  editTags.value = (user.value.tags && user.value.tags.length > 0) 
    ? JSON.parse(JSON.stringify(user.value.tags)) 
    : []
  editAvatar.value = user.value.avatar || '😎'
  isEditing.value = true
}

const addTag = () => {
  if (!newTagText.value.trim()) return
  const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)]
  editTags.value.push({
    text: newTagText.value.trim(),
    color: randomColor
  })
  newTagText.value = ''
}

const removeTag = (index) => {
  editTags.value.splice(index, 1)
}

const saveBio = async () => {
  isSaving.value = true
  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ 
        bio: editBio.value,
        tags: editTags.value,
        avatar: editAvatar.value
      })
    })

    if (handleAuthError(res)) return

    const data = await res.json()
    if (res.ok) {
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
      isEditing.value = false
    } else {
      alert(data.error || '保存失败')
    }
  } catch (err) {
    console.error('Failed to save bio:', err)
    alert('网络错误，请稍后重试')
  } finally {
    isSaving.value = false
  }
}

const cancelEditing = () => {
  isEditing.value = false
  editBio.value = ''
  editTags.value = []
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4 md:gap-6">
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

      <!-- Logout Button -->
      <button 
        @click="handleLogout"
        class="px-4 py-2 bg-[#FF5757] border-4 border-black font-black text-white rounded-xl hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        退出登录 👋
      </button>
    </div>

    <!-- Profile Card Wrapper -->
    <div class="relative mb-8 md:mb-12">
      <!-- Visual Background Layer (Clipped) -->
      <div class="absolute inset-0 bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
         <!-- Background Decorations -->
         <div class="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full -translate-y-1/2 translate-x-1/2 border-4 border-black opacity-50"></div>
      </div>

      <!-- Content Layer (Visible Overflow) -->
      <div class="relative z-10 p-6 md:p-8">
        <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <!-- Avatar Area -->
          <div class="shrink-0 relative group">
            <div class="w-32 h-32 md:w-40 md:h-40 bg-[#FFDE59] rounded-full border-4 border-black flex items-center justify-center text-6xl md:text-8xl overflow-hidden relative z-10 transition-transform">
              {{ isEditing ? editAvatar : (user.avatar || '😎') }}
            </div>
            <!-- Decorative Elements behind avatar -->
            <div class="absolute -top-4 -left-4 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black bg-black z-0"></div>
            
            <!-- Avatar Selector Popup -->
            <div v-if="isEditing" class="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-64 z-50">
              <div class="grid grid-cols-6 gap-2">
                <button 
                  v-for="avatar in avatarOptions" 
                  :key="avatar"
                  @click="editAvatar = avatar"
                  class="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors"
                  :class="{ 'bg-[#FFDE59]': editAvatar === avatar }"
                >
                  {{ avatar }}
                </button>
              </div>
              <div class="text-center text-xs font-bold mt-2 text-gray-500">
                点击选择头像
              </div>
            </div>
          </div>

          <!-- Info Area -->
          <div class="flex-1 text-center md:text-left space-y-4 w-full">
            <h3 class="text-4xl font-black text-black">{{ user.username || '神秘访客' }}</h3>
            
            <!-- Tags Section -->
            <div v-if="isEditing" class="space-y-3">
              <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                <div 
                  v-for="(tag, index) in editTags" 
                  :key="index"
                  class="px-3 py-1 border-2 border-black rounded-lg font-bold text-sm flex items-center gap-2"
                  :class="tag.color"
                >
                  <span>{{ tag.text }}</span>
                  <button @click="removeTag(index)" class="hover:text-white transition-colors">✕</button>
                </div>
              </div>
              <div class="flex gap-2 justify-center md:justify-start">
                <input 
                  v-model="newTagText" 
                  @keyup.enter="addTag"
                  placeholder="新标签..." 
                  class="px-3 py-1 border-2 border-black rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                >
                <button 
                  @click="addTag"
                  :disabled="!newTagText.trim()"
                  class="px-3 py-1 bg-black text-white border-2 border-black rounded-lg text-sm font-bold disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            <div v-else class="flex flex-wrap gap-2 justify-center md:justify-start">
              <span 
                v-for="(tag, index) in (user.tags || [])" 
                :key="index"
                class="px-3 py-1 border-2 border-black rounded-lg font-bold text-sm"
                :class="[tag.color, tag.color === 'bg-[#8C52FF]' || tag.color === 'bg-[#FF5757]' ? 'text-white' : 'text-black']"
              >
                {{ tag.text }}
              </span>
            </div>
            
            <!-- Editable Bio Section -->
            <div class="relative group mt-4">
              <div v-if="isEditing" class="space-y-4">
                <textarea 
                  v-model="editBio"
                  class="w-full h-32 p-4 bg-[#F0F0F0] rounded-xl border-4 border-black resize-none focus:ring-0 focus:bg-white transition-all text-black font-medium text-xl placeholder:text-gray-400"
                  placeholder="写点什么介绍一下自己吧..."
                ></textarea>
                <div class="flex gap-4 justify-end">
                  <button 
                    @click="cancelEditing"
                    class="px-6 py-2 bg-gray-200 border-4 border-black font-bold text-black rounded-xl hover:bg-gray-300 transition-colors"
                    :disabled="isSaving"
                  >
                    取消
                  </button>
                  <button 
                    @click="saveBio"
                    class="px-6 py-2 bg-[#7FBC8C] border-4 border-black font-bold text-black rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                    :disabled="isSaving"
                  >
                    {{ isSaving ? '保存中...' : '保存 ✅' }}
                  </button>
                </div>
              </div>
              
              <div v-else @click="startEditing" class="cursor-pointer relative p-2 -m-2 rounded-xl hover:bg-gray-50 transition-colors group">
                <p class="text-xl font-bold text-gray-700 leading-relaxed max-w-lg whitespace-pre-wrap">
                  {{ user.bio || '你好！这是我的个人空间。在这里记录生活，规划未来，享受当下的快乐。✨' }}
                </p>
                <div class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded">
                  点击编辑 ✏️
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <!-- Stat 1 -->
      <div 
        @click="$router.push('/diary')"
        class="bg-[#FF914D] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:-rotate-2 transition-transform cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        <div class="text-5xl mb-2">📅</div>
        <div class="text-4xl font-black text-black mb-1">{{ entryCount }}</div>
        <div class="font-bold text-black">篇日记</div>
      </div>

      <!-- Stat 2 -->
      <div 
        @click="$router.push('/todos')"
        class="bg-[#5492FE] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:rotate-2 transition-transform cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        <div class="text-5xl mb-2">✅</div>
        <div class="text-4xl font-black text-black mb-1">{{ completedTodoCount }}/{{ todoCount }}</div>
        <div class="font-bold text-black">任务完成</div>
      </div>

      <!-- Stat 3 -->
      <div 
        @click="() => { window.open('https://yjfrbhgwylma.sealoshzh.site/diary', '_blank') }"
        class="bg-[#7FBC8C] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:-rotate-1 transition-transform cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        <div class="text-5xl mb-2">🌟</div>
        <div class="text-4xl font-black text-black mb-1">{{ daysActive }}</div>
        <div class="font-bold text-black">天加入</div>
      </div>
    </div>

    <!-- Links / Contact -->
    <div class="grid grid-cols-2 gap-6">
      <a href="https://github.com/Xingyuanx/glow-scribble" target="_blank" class="flex items-center justify-center gap-3 p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black text-xl text-black no-underline">
        <span class="text-2xl">🐙</span> GitHub
      </a>
      <a href="mailto:example@email.com" class="flex items-center justify-center gap-3 p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black text-xl text-black no-underline">
        <span class="text-2xl">📧</span> Email
      </a>
    </div>

  </div>
</template>
