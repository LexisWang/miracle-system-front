import router from '@/router';
import { defineStore } from 'pinia';
import { StoreName } from '@/stores/store-name';
import type { RouteRecordRaw } from "vue-router";
import type { GlobalDataType, LoginResDto } from "@/type/layout-type";

export const useGlobalStore = defineStore(StoreName.GLOBAL, {
  state: (): GlobalDataType => ({
    loginData: {},
    nextPath: undefined,
    isCollapse: false,
    currentMenu: undefined,
    currentFullPath: undefined,
    layoutTabList: [],
    tabMaxCount: 8,
    notifyMsg: undefined,
  }),
  actions: {
    async setLongRespData(data: LoginResDto) {
      this.loginData = data;
      if (this.nextPath && this.nextPath !== '/') {
        await router.push(this.nextPath);
      } else {
        await router.push('/home');
      }
    },
    setCurrentMenu(menuData: RouteRecordRaw) { //@ts-ignore
      const matched: RouteRecordRaw[] = menuData.matched;
      const menuFullList = matched.map(item => ({
        path: item.path,
        title: item.meta?.title as string,
        name: item.name as string,
        parent: item.meta?.parent
      }))
      const currentFullMenu = menuFullList?.[menuFullList.length - 1];
      this.currentMenu = menuFullList;
      this.currentFullPath = currentFullMenu?.path;
      //更新`layoutTabList`中的数据
      const tabItem = this.layoutTabList.find(item => item.path === currentFullMenu?.path);
      if (!tabItem && currentFullMenu?.parent) {
        if (this.tabMaxCount === this.layoutTabList.length) {
          this.layoutTabList.splice(0, 1);
        }
        this.layoutTabList.push(currentFullMenu);
      }
    },
  }
});
