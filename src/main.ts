import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import * as ElementPlusIcons from '@element-plus/icons-vue'

import App from './App.vue';
import router from './router';
import request from "@/utils/request";
import { permission } from '@/utils/directive';
import { useGlobalStore } from "@/stores/global";
import addDynamicRoutes from "@/router/filter-routes";
import permanentPlugin from '@/stores/permanent-plugin';

import '@/assets/css/reset.scss';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

declare module 'vue' {
    interface ComponentCustomProperties {
        $request: typeof request;
    }
}

declare module 'vue-router' {
    interface RouteMeta {
        isShow? : boolean;
        title?: string;
        icon?: string;
        parent?: string;
        transition?: string;
    }
}

const store = createPinia();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIcons)) {
    app.component(key, component);
}
app.config.globalProperties.$request = request;

store.use(permanentPlugin({}));
app.use(store)
    .use(router)
    .use(ElementPlus, { locale: zhCn })
    .directive('permission', permission)
    .mount('#app');


//1.路由守卫配置
const globalStore = useGlobalStore();
//1.1.前置路由守卫(初始化时被调用，每次路由切换时也调用)
router.beforeEach(async (to, from, next) => {
    const loginStateData = globalStore.loginData;
    const jwtToken = loginStateData?.jwtToken;
    const roleMenus = loginStateData?.roleMenus;

    if (!jwtToken && to.path !== '/login') {
        globalStore.nextPath = to.path;
        next({ path: '/login' });
    } else if (router.getRoutes().length === 4 && roleMenus) {
        addDynamicRoutes(roleMenus);
        next({ path: to.path, replace: true });
    } else if (router.hasRoute(to.name!)) {
        next();
    } else {
        next({ path: '/404' });
    }
})
//1.2.后置路由守卫(初始化时被调用，每次路由切换时也调用)
router.afterEach((to, from) => {
    if (from.path === '/login') {
        globalStore.nextPath = undefined;
    } else if (to.path === '/login') {
        globalStore.nextPath = from.path;
    } //@ts-ignore
    globalStore.setCurrentMenu(to);
    document.title = to.meta.title as string;
})
