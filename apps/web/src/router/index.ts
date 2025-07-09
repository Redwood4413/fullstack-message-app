import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/LoginForm.vue'

import MainView from '@/views/MainView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
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
  ],
})

export default router
