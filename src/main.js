import './assets/main.css'

import { createApp } from 'vue'
import pinia from './stores';
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { Icon } from '@iconify/vue';

const app = createApp(App)

app.use(pinia);
app.use(router);
app.component('VIcon', Icon);

app.mount('#app')
