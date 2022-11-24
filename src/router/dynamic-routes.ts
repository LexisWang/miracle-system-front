import type { RouteRecordRaw } from "vue-router";

const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "commonHome" */ '@/pages/layout/LayoutHome.vue'),
    children: [
      {
        path: '',
        name: 'commonHome',
        meta: {
          title: '首页',
          parent: 'home',
        },
        component: () => import(/* webpackChunkName: "commonHome" */ '@/pages/components/CommonHome.vue'),
      },
      {
        path: '/system',
        name: 'system',
        meta: {
          isShow: true,
          title: '系统管理',
          icon: 'setting',
          parent: 'home',
        },
        children: [
          {
            path: 'organization',
            name: 'organization',
            meta: {
              isShow: true,
              title: '组织管理',
              icon: 'home-filled',
              parent: 'system',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/system-page/OrganizationView.vue'),
          },
        ]
      },
      {
        path: '/order',
        name: 'order',
        meta: {
          isShow: true,
          title: '订单管理',
          icon: 'menu',
          parent: 'home',
        },
        children: [
          {
            path: 'order-track',
            name: 'orderTrack',
            meta: {
              isShow: true,
              title: '订单轨迹',
              icon: 'van',
              parent: 'order',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/order-page/components/OrderTrackView.vue'),
          },
          {
            path: 'order-fund',
            name: 'orderFund',
            meta: {
              isShow: true,
              title: '订单款项',
              icon: 'coin',
              parent: 'order',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/order-page/components/OrderFundView.vue'),
          },
        ]
      },
      {
        path: '/cargo',
        name: 'cargo',
        meta: {
          isShow: true,
          title: '货物列表',
          icon: 'goods-filled',
          parent: 'home',
        },
        component: () => import(/* webpackChunkName: "cargo" */ '@/pages/order-page/CargoView.vue'),
      },
    ],
  },
];

export default dynamicRoutes;
