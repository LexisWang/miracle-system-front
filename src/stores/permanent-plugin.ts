import { toRaw } from "vue";
import type { PiniaPluginContext } from "pinia";

const __piniaKey__ = 'miracle'

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key: string) => {
  const memoryValue = localStorage.getItem(key);
  return memoryValue ? JSON.parse(memoryValue) : {};
};

export default function (options: { key?: string }) {
  return (context: PiniaPluginContext) => {
    const { store } = context;
    const __key = `${options?.key ?? __piniaKey__}-${store.$id}`;
    const data = getStorage(__key);
    store.$subscribe(() => {
      setStorage(__key, toRaw(store.$state))
    });
    return { ...data };
  };
}
