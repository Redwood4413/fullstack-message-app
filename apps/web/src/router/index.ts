import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import MainView from '@/views/MainView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      meta: { requiresAuth: true },
      beforeEnter(to) {
        const userStore = useUserStore()

        if (!userStore.isAuthenticated && to.name !== 'welcome') {
          return { name: 'welcome' }
        }
      },
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomeView,
      redirect: { name: 'login-form' },
      children: [
        {
          path: 'login',
          name: 'login-form',
          component: LoginForm,
        },
        {
          path: 'register',
          name: 'register-form',
          component: RegisterForm,
        },
      ],
    },
    { path: '/reset-password', name: 'reset-password', component: MainView },
  ],
})

export default router
