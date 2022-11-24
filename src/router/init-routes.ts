import type { RouteRecordRaw } from "vue-router";

//初始化路由
const initRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/components/AboutView.vue'),
    meta: {
      title: '关于',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "layout" */ '@/components/LoginView.vue'),
    props({ query }) { //參數是 $router,可以结解构使用
      return {
        currentId: +(query.currentId || '0'),
        currentName: query.currentName,
      }
    },
    meta: {
      title: '登录',
    },
    //独享路由守卫
    beforeEnter: (to, from, next) => {
      next();
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/components/NotFoundView.vue'),
  },
];

export default initRoutes;
