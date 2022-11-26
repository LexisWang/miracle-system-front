<template>
  <el-dialog
    :width="width + 'px'"
    :append-to-body="true"
    v-model="modalVisible"
    custom-class="miracle-dialog"
    :before-close="beforeClose"
    :title="modalTitle"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      class="miracle-form"
      :model="addEditData"
      :rules="formRules"
      :label-width="opts && (defaultLabel + 'px') || ''"
      :label-position="(opts && opts.labelPosition) || 'left'"
    >
      <el-row>
        <el-col
          :class="item.class"
          v-for="(item, index) in displayData" :key="index"
          :span="item.hasOwnProperty('span') ? item.span : defaultSpan"
          :offset="item.hasOwnProperty('offset') ? item.offset : defaultOffset"
        >
          <!--层 div-->
          <div
            v-if="item.type === 'div'"
          >
            {{ item.label }}
          </div>
          <!--特殊格式_label-->
          <label
            class="miracle-form"
            v-else-if="item.type === 'label'"
          >
            {{ item.label }}
          </label>
          <!--特殊格式_card-->
          <el-card
            :class="item.class"
            v-else-if="item.type === 'card'"
          >
            <!--特殊格式_card可嵌套-->
            <miracle-modal
              :ref="`card${index}`"
              :modal-add-edit="modalAddEdit"
              :add-edit-data="addEditData"
              :displayData="item.children"
              :rules="formRules" :opts="opts"
            />
          </el-card>
          <!--自定义格式_slot-->
          <slot
            v-else-if="item.type=== 'slot'"
            :name="item.slotName"/>
          <!--表单格式组件-->
          <el-form-item
            v-else
            :label="item.label"
            :prop="item.prop"
          >
            <!--纯文本-->
            <span
              v-if="item.type === 'text'"
              :class="`miracle-form-text ${item.class}`"
            >
            {{ item.format ? item.format(addEditData[item.prop]) : addEditData[item.prop] }}
          </span>
            <!--输入框input-->
            <el-input
              :disabled="!editing || item.disabled"
              :maxlength="item.maxlength || 999"
              v-model="addEditData[item.prop]"
              :placeholder="editing? item.placeholder || '请输入' : ''"
              v-else-if="item.type === 'input' || !item.type"
              @blur="item.onBlur"
              @change="item.onChange"
            />
            <!--输入文本框textArea-->
            <el-input
              :style="item.style"
              :resize="item.resize"
              :autosize="item.autosize"
              :disabled="!editing || item.disabled"
              :maxlength="item.max || 999"
              v-model="addEditData[item.prop]"
              :show-word-limit="!!item.max"
              v-else-if="item.type === 'textArea'"
              type="textarea"
              :rows="item.rows"
              :placeholder="editing? item.placeholder || '请输入' : ''"
            />
            <!--输入日期-->
            <el-date-picker
              style="width:100%"
              :disabled="!editing || item.disabled"
              v-else-if="item.type=== 'date' || item.type === 'datetime'"
              v-model="addEditData[item.prop]"
              :placeholder="item.placeholder"
              :value-format="item.format || 'yyyy-MM-dd'"
              :type="item.type"
              :picker-options="item.pickerOptions || {}"
            />
            <!--选择框 select-->
            <el-select
              :multiple="item.multiple"
              v-else-if="item.type=== 'select'"
              v-model="addEditData[item.prop]"
              :filterable="item.filterable"
              :placeholder="editing? item.placeholder || '请选择' : ''"
              :collapse-tags="item.collapseTags"
              :disabled:disabled="!editing || item.disabled"
              :clearable="item.clearable"
              @change="item.onChange"
            >
              <el-option
                v-for="opt in selectOpts[item.prop]"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              >
              </el-option>
            </el-select>
            <!--级联选择器 cascade-->
            <el-cascader
              v-else-if="item.type=== 'cascade'"
              v-model="addEditData[item.prop]"
              :options="cascadeOpts[item.prop]"
              :disabled="!editing || item.disabled"
              :props="{checkStrictly: true, multiple: false}"
              style="width: 100%"
              :placeholder="editing? item.placeholder || '请选择' : ''"
            >
              <template #default="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
            <!--单选框radio-->
            <template v-else-if="item.type === 'radio'">
              <el-radio
                :key="opt.value"
                :label="opt.value"
                :disabled="!editing || item.disabled"
                v-for="opt in radioOpts[item.prop]"
                v-model="addEditData[item.prop]"
                @change="item.onChange"
              >
                {{ opt.label }}
              </el-radio>
            </template>
            <!--输入建议-->
            <template v-else-if="item.type === 'autocomplete'">
              <el-autocomplete
                :placeholder="editing? item.placeholder || '请输入' : ''"
                :disabled="!editing || item.disabled"
                class="input-autocomplete"
                v-model="addEditData[item.prop]"
                :fetch-suggestions="(qs, cb) => getSuggestData(item.prop, qs, cb)"
                @select="item.onSelect"
              />
            </template>
            <!--数字输入-->
            <input-number
              :min="item.min"
              :options="item.options"
              :value="addEditData[item.prop]"
              v-else-if="item.type === 'number'"
              :modal-visible="modalVisible"
              :disabled="!editing || item.disabled"
              @change="item.onChange"
              @blur="item.onBlur"
              :placeholder="editing? item.placeholder || '请输入' : ''"
            />
            <slot v-else-if="item.type=== 'slotItem'" :name="item.slotName"></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-if="editing && footerButton" #footer>
      <el-button
        @click="footerButton?.[0]?.onClick"
        v-permission="footerButton?.[0]?.permission"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="beforeSubmit"
        v-permission="footerButton?.[1]?.permission"
      >
        提 交
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, withDefaults } from 'vue';
import InputNumber from '@/pages/components/InputNumber.vue'
import type { AddEditButtonType, SearchColumnType } from '@/type/base-type';
import type { FormInstance } from "element-plus";

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
  editing?: boolean;
}>(), {
  width: 800,
  title: '',
  opts: () => ({
    defaultLabel: 85,
    defaultSpan: 23,
    defaultOffset: 1,
    labelPosition: 'right'
  }),
  displayData: () => [],
});

const formRef = ref<FormInstance>();
const defaultSpan = ref(8);
const defaultLabel = ref(80);
const defaultOffset = ref(0);
const modalTitle = ref('新增');

const getSuggestData = (key: string, qs: string, cb: (arg: any) => void) => {
  const suggestOpts = props.suggestOpts[key];
  const results = qs ?
    suggestOpts.filter((item: any) => item.value.toLowerCase().includes(qs.toLowerCase()))
    : suggestOpts;
  cb(results);
};
const modalVisible = computed(() => props.modalAddEdit);
const beforeClose = (done: any) => {
  props.footerButton?.[0]?.onClick();
  done()
};
const beforeSubmit = () => {
  formRef?.value?.validate((valid: boolean) => {
    if (valid) {
      props.footerButton?.[1]?.onClick();
    }
  });
};

onMounted(() => {
  if (props.opts) {
    defaultSpan.value = props.opts.defaultSpan ?? defaultSpan.value;
    defaultLabel.value = props.opts.defaultLabel ?? defaultLabel.value;
    defaultOffset.value = props.opts.defaultOffset ?? defaultOffset.value;
  }
});
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