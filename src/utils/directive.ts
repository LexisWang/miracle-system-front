import type { Directive, DirectiveBinding } from "vue";
import type { ElPermissionType } from "@/type/base-type";
import { useGlobalStore } from '@/stores/global';

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ElPermissionType>, vNode) {
    const globalStore = useGlobalStore();
    const roleButtons = globalStore.loginData.roleButtons;
    const buttonCodeArr = roleButtons?.map(item => item.code);
    //1.1 如果该节点绑定了权限
    if (binding.value && binding.value.code) {
      if (!buttonCodeArr?.includes(binding.value.code)) {
        // el.remove();
      }
    }
  },
}
