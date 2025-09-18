import LoginForm from '@/components/forms/LoginForm.vue';
import RegisterForm from '@/components/forms/RegisterForm.vue';
import MainView from '@/views/MainView.vue';
import WelcomeView from '@/views/WelcomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores';
import RoomListView from '@/views/RoomListView.vue';
import { Notify } from 'quasar';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      meta: { requiresAuth: true },
      beforeEnter: async () => {
        const store = useUserStore();

        if (!store.user) {
          await store.fetchUser();

          if (!store.user) {
            Notify.create({
              message: 'First, you have to log-in to your account.',
            });
            return { name: 'welcome' };
          }
        }

        return true;
      },
      children: [
        {
          path: '/',
          name: 'room-list',
          component: RoomListView,
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomeView,
      beforeEnter: async () => {
        const store = useUserStore();
        if (!store.user) {
          await store.fetchUser();
        }
        if (store.user) {
          return { name: 'main' };
        }
      },
      redirect: { name: 'login-form' },
      children: [
        {
          path: 'login',
          name: 'login-form',
          meta: { transition: 'slide-right' },
          beforeEnter(to, from) {
            if (from.path === '/welcome/register') {
              to.meta.transition = 'slide-left';
            }
          },
          component: LoginForm,
        },
        {
          path: 'register',
          name: 'register-form',
          meta: { transition: 'slide-left' },
          beforeEnter(to, from) {
            if (from.path === '/welcome/login') {
              to.meta.transition = 'slide-right';
            }
          },
          component: RegisterForm,
        },
      ],
    },
    { path: '/reset-password', name: 'reset-password', component: MainView },
  ],
});

export default router;
