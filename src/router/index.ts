import { createRouter, createWebHashHistory } from 'vue-router'

import routes from '@/router/init-routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
