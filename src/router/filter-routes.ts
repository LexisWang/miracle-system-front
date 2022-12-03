import router from "@/router/index";
import dynamicRoutes from "@/router/dynamic-routes";
import type { RouteRecordRaw } from "vue-router";
import type { BackendRoute } from "@/type/layout-type";

//与后端获取到的路由对比过滤出动态的路由
const filterRoutesByBackendRoutes: (dynamicRoutes: RouteRecordRaw[], backendRoutes: BackendRoute[]) => RouteRecordRaw[]
    = (dynamicRoutes, backendRoutes) => {
  const realRoutes: RouteRecordRaw[] = []
  dynamicRoutes.forEach(dynItem => {
    backendRoutes.forEach(backItem => {
      if (backItem.name === dynItem.name) {
        if (backItem.children && backItem.children.length > 0 && dynItem.children && dynItem.children.length > 0) {
          dynItem.children = filterRoutesByBackendRoutes(dynItem.children, backItem.children);
        }
        realRoutes.push(dynItem);
      }
    })
  });
  return realRoutes;
};

//添加动态路由
export default function addDynamicRoutes(roleMenus: BackendRoute[]) {
  const backDynamicRoutes = filterRoutesByBackendRoutes(dynamicRoutes, roleMenus);
  backDynamicRoutes.forEach(item => {
    router.addRoute(item);
  });
}
