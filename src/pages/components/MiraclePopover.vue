<template>
  <el-popover :visible="visible" placement="top" :width="isDelete ? 300: 150">
    <p style="padding-left: 12px; padding-bottom: 5px">{{ title }}</p>
    <el-form
      v-if="isDelete"
      :model="formData"
      label-width="80px"
    >
      <el-form-item label="备注信息">
        <el-input type="textArea" v-model="formData.remark"/>
      </el-form-item>
    </el-form>
    <div style="text-align: right; margin: 0">
      <el-button size="small" text @click="onCancel">取消</el-button>
      <el-button size="small" type="primary" @click="onConfirm">确认</el-button>
    </div>
    <template #reference>
      <span @click="visible = true">{{ text }}</span>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

withDefaults(defineProps<{
  title: string;
  text: string;
  isDelete?: boolean;
}>(), {
  isDelete: false,
});

const emits = defineEmits<{
  (e: 'confirm-callback', param: any): void;
}>();

const visible = ref<boolean>(false);
const formData = reactive<{ remark: string }>({ remark: '' });

const onCancel = () => {
  visible.value = false;
};
const onConfirm = () => {
  if (!formData.remark) {
    ElMessage.error("必须输入备注信息");
  } else {
    visible.value = false;
    emits('confirm-callback', formData.remark);
    formData.remark = '';
  }
};

</script>

<style lang="scss" scoped>

</style>