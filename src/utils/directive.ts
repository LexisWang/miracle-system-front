import type { Directive, DirectiveBinding } from "vue";
import type { ElPermissionType } from "@/type/base-type";

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ElPermissionType>, vNode) {
    //todo 对比vuex中的权限集合，判断是否展示该节点
    //1.1 如果该节点绑定了权限
    if (binding.value && binding.value.code) {
      // console.log('!!!!!!!!!你好啊', binding.value);
      // if ([1111, 3333].includes(binding.value.code)) {
      //     el.remove();
      // }
    }
  },
}
