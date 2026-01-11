import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DiaryView from '../views/DiaryView.vue'
import TodoView from '../views/TodoView.vue'
import GamesView from '../views/GamesView.vue'
import AboutView from '../views/AboutView.vue'
import FocusView from '../views/FocusView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/diary',
      name: 'diary',
      component: DiaryView
    },
    {
      path: '/todos',
      name: 'todos',
      component: TodoView
    },
    {
      path: '/games',
      name: 'games',
      component: GamesView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/focus',
      name: 'focus',
      component: FocusView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.name !== 'login' && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
