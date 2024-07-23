import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes
})
