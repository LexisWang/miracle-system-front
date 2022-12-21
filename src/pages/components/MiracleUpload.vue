<template>
  <el-dialog
    width="400"
    :title="modalTitle"
    v-model="uploadVisible"
    :before-close="beforeClose"
    :close-on-click-modal="false"
  >
    <el-upload
      multiple
      ref="uploadRef"
      :auto-upload="false"
      v-model:file-list="attachments"
      :on-remove="onRemove"
      :before-upload="beforeUpload"
      :http-request="uploadFile"
      v-loading="loading"
    >
      <template #trigger>
        <el-button type="primary">附件上传</el-button>
      </template>
      <el-button class="ensure-submit" type="success" @click="ensureUpload">
        确认上传
      </el-button>
      <template #tip>
        <div class="el-upload__tip">
          如果是图片附件, 大小在2M以内
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { UploadFile, UploadFiles, UploadInstance, UploadRawFile, UploadRequestOptions } from "element-plus";
import { ElNotification } from "element-plus";
import type { UploadExtraDataType, UploadRespDataType } from "@/type/base-type";
import { deleteAttachment, miracleUpload } from "@/service/common/attachment-api";
import { CAN_PREVIEW_FILE_TYPE } from "@/utils/constant";

const props = withDefaults(defineProps<{
  visible: boolean;
  extraData: UploadExtraDataType;
  fileList?: UploadRespDataType[];
  closeCallback: () => void;
  modalTitle: string;
}>(), { visible: false, fileList: () => [] });

const uploadVisible = computed(() => props.visible);
const uploadRef = ref<UploadInstance>()
const attachments = computed(() => props.fileList.map(item => ({
  name: item.fileName,
  id: item.id,
  url: item.filePath
})));
const loading = ref(false);
const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => { //@ts-ignore
  deleteAttachment({ id: uploadFile.id, filePath: uploadFile.url });
};
const ensureUpload = () => {
  uploadRef.value?.submit();
};
const beforeUpload = (rawFile: UploadRawFile) => {
  const sizeCanGt2M = CAN_PREVIEW_FILE_TYPE.includes(rawFile.type);
  if (sizeCanGt2M && rawFile.size / 1024 / 1024 >= 2.05) {
    ElNotification({
      title: rawFile.name,
      message: '大小超过 2MB!',
      type: 'error',
    });
    return;
  }
};
const uploadFile = async (item: UploadRequestOptions) => {
  const formData = new FormData();
  formData.append('file', item.file);
  formData.append('category', props.extraData.category);
  if (props.extraData.relatedId) {
    formData.append('relatedId', props.extraData.relatedId + '');
  }
  if (props.extraData.relatedIds) {
    formData.append('relatedIds', props.extraData.relatedIds.join(','));
  }
  loading.value = true;
  await miracleUpload(formData);
  loading.value = false;
};
const beforeClose = (done: any) => {
  props.closeCallback();
  done()
};
</script>

<style lang="scss" scoped>
.ensure-submit {
  margin-left: 50px;
}
</style>