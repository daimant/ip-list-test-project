import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { type RouterOptions } from 'vue-router'
import App from './App.vue'
import { createPinia } from "pinia";

const routes = [
  {
    name: 'ip-list',
    path: '/ip-list',
    component: () => import('@/pages/ip-list.vue'),
    alias: '/'
  },
  {
    name: 'ip-detail',
    path: '/ip-detail/:ip',
    component: () => import('@/pages/ip-detail.vue'),
  },
] as any

const router = createRouter(<RouterOptions>{
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')
