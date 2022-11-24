<template>
  <el-form
    ref="formData"
    class="miracle-form"
    :model="formData"
    :rules="rules"
    :label-width="opts && (defaultLabel + 'px') || ''"
    :label-position="(opts && opts.labelPosition) || 'left'"
  >
    <el-row>
      <el-col
        v-for="(item, index) in displayData" :key="index"
        :span="item.hasOwnProperty('span') ? item.span : defaultSpan"
        :offset="item.hasOwnProperty('offset') ? item.offset : defaultOffset"
        :class="item.class">
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
          <miracle-form
            :ref="`card${index}`"
            :formData="formData"
            :displayData="item.children"
            :rules="rules" :opts="opts"/>
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
            {{ item.format ? item.format(formData[item.prop]) : formData[item.prop] }}
          </span>
          <!--输入框input-->
          <el-input
            :disabled="!editing || item.disabled"
            :maxlength="item.maxlength || 999"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder || '请输入'"
            v-else-if="item.type === 'input' || !item.type"
            @blur="()=>{if(item.onBlur) {item.onBlur()} }"
            @change="(v)=>{ if(item.onChange) {item.onChange(v)} }"
          />
          <!--输入文本框textArea-->
          <el-input
            :style="item.style"
            :resize="item.resize"
            :autosize="item.autosize"
            :disabled="!editing || item.disabled"
            :maxlength="item.max || 999"
            v-model="formData[item.prop]"
            :show-word-limit="!!item.max"
            v-else-if="item.type === 'textArea'"
            type="textarea"
            :rows="item.rows"
            :placeholder="item.placeholder|| '请输入'"
          />
          <!--输入日期-->
          <el-date-picker
            style="width:100%"
            :disabled="!editing || item.disabled"
            v-else-if="item.type=== 'date' || item.type === 'datetime'"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder"
            :value-format="item.format || 'yyyy-MM-dd'"
            :type="item.type"
            :picker-options="item.pickerOptions || {}"
          />
<!--          <Upload
            v-else-if="item.type === 'upload'"
            name="importFile"
            :multiple="true"
            :maxSize="25"
            :fileList="item.fileList"
            :onSuccess="item.handleSuccess"
            :onRemove="item.handleRemove"
            :onDownload="item.onDownload"
            :disabled="!editing || item.disabled"
            :showDelete="item.showDelete"
            :action="item.action"
          >
            <el-button type="primary">点击上传</el-button>
          </Upload-->
          <!--选择框 select-->
          <el-select
            :multiple="item.multiple"
            v-else-if="item.type=== 'select'"
            v-model="formData[item.prop]"
            :filterable="item.filterable"
            :placeholder="item.placeholder"
            :collapse-tags="item.collapseTags"
            :disabled:disabled="!editing || item.disabled"
            :clearable="item.clearable"
            @change="(v)=>{ if(item.onChange) {item.onChange(v)} }"
          >
            <el-option
              v-for="opt in selectOpts[item.prop]"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            >
            </el-option>
          </el-select>
          <!--级联选择器 cascader-->
          <el-cascader
            v-else-if="item.type=== 'cascade'"
            v-model="formData[item.prop]"
            :options="cascadeOpts[item.prop]"
            :disabled="!editing || item.disabled"
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
              v-model="formData[item.prop]"
              @change="(v)=>{ if(item.onChange) {item.onChange(v)} }"
            >
              {{ opt.label }}
            </el-radio>
          </template>
          <!--输入建议-->
          <template v-else-if="item.type === 'autocomplete'">
            <el-autocomplete
              placeholder="请输入内容"
              :disabled="!editing || item.disabled"
              class="input-autocomplete"
              v-model="formData[item.prop]"
              :fetch-suggestions="(qs, cb) => getSuggestData(item.prop, qs, cb)"
              @select="(temp)=>{ if(item.onSelect) {item.onSelect(temp)} }"
            />
          </template>
          <!--数字输入-->
          <input-number
            :min="item.min"
            :options="item.options"
            :value="formData[item.prop]"
            v-else-if="item.type === 'number' && !(item.disabled || true)"
            @change="(v)=>{ if(item.onChange) {item.onChange(v)} }"
            @blur="(v)=>{ if(item.onBlur) {item.onBlur(v)} }"
            :disabled="!editing || item.disabled"
          />
          <slot v-else-if="item.type=== 'slotItem'" :name="item.slotName"></slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from 'vue';
import InputNumber from '@/pages/components/InputNumber.vue'
import type { SearchColumnType } from "@/type/base-type";

const props = withDefaults(defineProps<{
  opts?: any;
  formData: object;
  rules: object;
  displayData?: SearchColumnType[];
  selectOpts?: any;
  cascadeOpts?: any;
  suggestOpts?: any;
  radioOpts?: any;
  editing?: boolean
}>(), {
  opts: () => ({
    defaultLabel: 90,
    defaultSpan: 23,
    defaultOffset: 1,
    labelPosition: 'right'
  }),
  displayData: () => [],
});

const defaultSpan = ref(8);
const defaultLabel = ref(200);
const defaultOffset = ref(0);

const getSuggestData = (key: string, qs: string, cb: (arg: any) => void) => {
  const suggestOpts = props.suggestOpts[key];
  const results = qs ?
    suggestOpts.filter((item: any) => item.value.toLowerCase().includes(qs.toLowerCase()))
    : suggestOpts;
  cb(results);
};

onMounted(() => {
  if (props.opts) {
    defaultSpan.value = props.opts.defaultSpan ?? defaultSpan.value;
    defaultLabel.value = props.opts.defaultLabel ?? defaultLabel.value;
    defaultOffset.value = props.opts.defaultOffset ?? defaultOffset.value;
  }
});
</script>

<style lang="scss" scoped>

</style>