import { createMemoryHistory, createRouter } from 'vue-router'

import SecureRoute from 'src/components/auth/SecureRoute.vue'

const routes = [
  { path: '/', component: SecureRoute, children: [
    {
      path: '/login',
      name: 'login',
      component: () => import('src/views/Login.vue')
    }
  ] },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router