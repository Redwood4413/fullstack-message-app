import './assets/main.css';
import { createApp } from 'vue';

import { Quasar, Notify, Dialog } from 'quasar';
import quasarIconSet from 'quasar/icon-set/svg-material-icons';
import '@quasar/extras/mdi-v7/mdi-v7.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';
import 'quasar/src/css/index.sass';

import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);
app.use(Quasar, {
  plugins: { Notify, Dialog },
  iconSet: quasarIconSet,

  config: {
    dark: 'auto',

    notify: {
      position: 'top-right',
      progress: true,
      color: 'blue-13',
    },
    brand: {
      primary: '#83c2e7',
      secondary: '#711985',
      accent: '#da3ea6',
      dark: '#040f16',
      negative: '#ff2222',
    },
  },
});

app.mount('#app');
