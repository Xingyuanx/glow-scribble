<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMsg.value = ''
  username.value = ''
  password.value = ''
}

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register'

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (res.ok) {
      // Save token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Redirect to home
      router.push('/')
    } else {
      errorMsg.value = data.error || '操作失败'
    }
  } catch (err) {
    errorMsg.value = '网络错误，请稍后重试'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FFE159] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative">
      <!-- Decorative Elements -->
      <div class="absolute -top-6 -right-6 w-16 h-16 bg-[#FF5757] rounded-full border-4 border-black animate-bounce delay-100"></div>
      <div class="absolute -bottom-6 -left-6 w-12 h-12 bg-[#5492FE] rotate-12 border-4 border-black animate-bounce"></div>

      <h1 class="text-4xl font-black text-center mb-8 tracking-tighter transform -rotate-2">
        {{ isLogin ? '欢迎回来!' : '加入我们!' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-xl font-bold mb-2">用户名</label>
          <input 
            v-model="username"
            type="text" 
            class="w-full px-4 py-3 rounded-xl border-4 border-black bg-[#F0F0F0] text-xl focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
            placeholder="Username"
          >
        </div>

        <div>
          <label class="block text-xl font-bold mb-2">密码</label>
          <input 
            v-model="password"
            type="password" 
            class="w-full px-4 py-3 rounded-xl border-4 border-black bg-[#F0F0F0] text-xl focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
            placeholder="Password"
          >
        </div>

        <div v-if="errorMsg" class="bg-[#FF5757] text-white font-bold p-3 rounded-xl border-4 border-black text-center animate-shake">
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-4 bg-[#8C52FF] text-white text-2xl font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? '处理中...' : (isLogin ? '登录 Login' : '注册 Register') }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <button 
          @click="toggleMode"
          class="text-lg font-bold underline decoration-4 underline-offset-4 decoration-[#5492FE] hover:text-[#5492FE] transition-colors"
        >
          {{ isLogin ? '还没有账号？去注册 →' : '已有账号？去登录 →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
