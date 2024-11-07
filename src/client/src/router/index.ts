// src/router/index.ts
import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import WeekView from '@/views/WeekView.vue'
import DayView from '@/views/DayView.vue'
import FavoritesList from '@/views/FavoritesList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: WeekView
  },
  {
    path: '/day/:date?',
    name: 'day',
    component: DayView,
    props: (route: RouteLocationNormalized) => ({
      date: route.params.date || new Date().toISOString().split('T')[0]
    })
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesList
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router