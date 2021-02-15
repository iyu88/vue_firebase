import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('../views/board/index.vue')
  },
  {
    path: '/board/:list',
    name: 'board-list',
    component: () => import('../views/board/list.vue')
  },
  {
    path: '/board/:list/:article',
    name: 'board-list-article',
    component: () => import('../views/board/article.vue')
  },
  {
    path: '/chatRoom',
    name: 'chatRoom',
    component: () => import('../views/chatRoom/index.vue')
  },
  {
    path: '/chatRoom/:roomNumber',
    name: 'chatRoom-roomNumber',
    component: () => import('../views/chatRoom/roomNumber.vue')
  },
  {
    path: '*',
    name: 'error',
    component: () => import('../views/error.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
