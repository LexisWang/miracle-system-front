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
          {
            path: 'permission',
            name: 'permission',
            meta: {
              isShow: true,
              title: '权限管理',
              icon: 'lock',
              parent: 'system',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/system-page/PermissionView.vue'),
          },
          {
            path: 'menu',
            name: 'menu',
            meta: {
              isShow: true,
              title: '菜单管理',
              icon: 'menu',
              parent: 'system',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/system-page/MenuView.vue'),
          },
          {
            path: 'button',
            name: 'button',
            meta: {
              isShow: true,
              title: '按钮管理',
              icon: 'pointer',
              parent: 'system',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/system-page/ButtonView.vue'),
          },
          {
            path: 'role',
            name: 'role',
            meta: {
              isShow: true,
              title: '角色管理',
              icon: 'avatar',
              parent: 'system',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/system-page/RoleView.vue'),
          },
          {
            path: 'staff',
            name: 'staff',
            meta: {
              isShow: true,
              title: '职员管理',
              icon: 'user',
              parent: 'system',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/system-page/StaffView.vue'),
          },
          {
            path: 'dict',
            name: 'dict',
            meta: {
              isShow: true,
              title: '字典配置',
              icon: 'tools',
              parent: 'system',
            },
            component: () => import(/* webpackChunkName: "order" */ '@/pages/system-page/DictView.vue'),
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
