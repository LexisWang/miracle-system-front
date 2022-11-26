<template>
  <el-input
    clearable
    ref="thisRef"
    v-model="dValue"
    v-bind="$attrs"
    @focus="onFocusHandle"
    @blur="handleBlur"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">  //@ts-ignore
import * as accounting from 'accounting-js';
import { withDefaults, onMounted, ref, watch  } from 'vue';

const props = withDefaults(defineProps<{
  value?: number;
  min?: number;
  max?: number;
  options: {
    symbol?: string;
    format?: string;
    thousand?: string;
    decimal?: string;
    precision?: string;
  };
  modalVisible?: boolean;
  placeholder?: string;
}>(), {
  value: 0,
  min: 0,
  max: 999999999999,
  modalVisible: true,
});
const emits = defineEmits(['change']);

const dValue = ref('');
const iValue = ref(-1);
const sValue = ref('');
const focus = ref(false);

const setValue = (v?: number) => {
  if (iValue.value !== v) {
    iValue.value = accounting.toFixed(v, +(props.options.precision || 0));
    dValue.value = iValue.value.toString();

    sValue.value = accounting.formatMoney(dValue.value, props.options);
    iValue.value = accounting.unformat(sValue.value);
    iValue.value = Math.min(props.max, iValue.value);
    iValue.value = Math.max(props.min, iValue.value);
    if (focus.value) {
      dValue.value = iValue.value.toString();
    } else {
      dValue.value = sValue.value;
    }
    emits('change', iValue.value);
  }
};
const onFocusHandle = () => {
  focus.value = true;
  dValue.value = iValue.value ? iValue.value.toString() : '';
};
const handleBlur = () => {
  focus.value = false;

  if (parseFloat(dValue.value).toString() === "NaN") {
    iValue.value = 0;
  } else {
    iValue.value = parseFloat(dValue.value);
  }
  iValue.value = accounting.toFixed(iValue.value, +(props.options.precision || 0));
  dValue.value = iValue.value.toString();

  sValue.value = accounting.formatMoney(dValue.value, { ...props.options });
  iValue.value = accounting.unformat(sValue.value);
  iValue.value = Math.min(props.max, iValue.value);
  iValue.value = Math.max(props.min, iValue.value);

  if (!iValue.value) {
    sValue.value = ''
  }

  dValue.value = sValue.value;
  emits('change', iValue.value);
}

onMounted(() => {
  setValue(props.value);
});
watch(() => props.modalVisible, () => {
  if (!props.modalVisible) {
    iValue.value = -1;
  } else {
    setValue(props.value);
  }
});
</script>

<style lang="scss" scoped>

</style>