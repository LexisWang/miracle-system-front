<template>
  <el-dialog
    :width="width + 'px'"
    :append-to-body="true"
    v-model="modalVisible"
    custom-class="miracle-dialog"
    :before-close="beforeClose"
    :title="modalTitle"
  >
    <miracle-form
      ref="form"
      :opts="opts"
      :formData="addEditData"
      :displayData="displayData"
      :rules="formRules"
      :select-opts="selectOpts"
      :cascade-opts="cascadeOpts"
      :suggest-opts="suggestOpts"
      :radio-opts="radioOpts"
      :editing="editing"
    />
    <template v-if="editing && footerButton" #footer>
      <el-button
        @click="footerButton?.[0]?.onClick"
        v-permission="footerButton?.[0]?.permission"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="footerButton?.[1]?.onClick"
        v-permission="footerButton?.[1]?.permission"
      >
        提 交
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, onUpdated, ref, withDefaults } from 'vue';
import MiracleForm from '@/pages/components/MiracleForm.vue';
import type { AddEditButtonType, SearchColumnType } from '@/type/base-type';

const props = withDefaults(defineProps<{
  title?: string;
  width?: number;
  modalAddEdit: boolean;
  addEditData: any;
  displayData?: SearchColumnType[];
  formRules?: any;
  selectOpts?: any;
  cascadeOpts?: any;
  suggestOpts?: any;
  radioOpts?: any;
  opts?: any;
  footerButton?: AddEditButtonType[];
  editing?: boolean
}>(), {
  width: 600,
  title: ''
});
const modalVisible = computed(() => props.modalAddEdit);
const modalTitle = ref('新增');
const beforeClose = (done: any) => {
  props.footerButton?.[0]?.onClick();
  done()
};
onUpdated(() => {
  if (!props.editing && props.addEditData?.id) {
    modalTitle.value = props.title + `详情(${props.addEditData?.name})`;
  } else if (props.editing && props.addEditData?.id) {
    modalTitle.value = props.title + `修改(${props.addEditData?.name})`;
  } else {
    modalTitle.value = props.title + modalTitle.value;
  }
});
</script>

<style lang="scss" scoped>

</style>