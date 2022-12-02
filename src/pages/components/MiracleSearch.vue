<template>
  <el-card body-style="padding-top:8px;padding-bottom:8px">
    <el-row :gutter="8">
      <el-col
        :key="index"
        v-for="(item, index) in searchColumn"
        :span="item.span || 6"
      >
        <el-input
          v-if="item.type === 'input'"
          clearable
          v-model="searchData[item.prop]"
          style="margin-bottom: 8px"
          :placeholder="item.placeholder"
        />
        <el-select
          v-else-if="item.type === 'select'"
          :multiple="item.multiple || true"
          :clearable="true"
          :collapse-tags="true"
          :collapse-tags-tooltip="true"
          v-model="searchData[item.prop]"
          :placeholder="item.placeholder"
          style="width: 100%; margin-bottom: 8px"
        >
          <el-option
            :key="otp.value"
            :label="otp.label"
            :value="otp.value"
            v-for="otp in selectOpts[item.prop]"
          />
        </el-select>
        <el-autocomplete
          v-else-if="item.type === 'autocomplete'"
          clearable
          v-model="searchData[item.prop]"
          :placeholder="item.placeholder"
          :fetch-suggestions="(qs, cb) => getSuggestData(item.prop, qs, cb)"
          style="width: 100%; margin-bottom: 5px"
        />
        <el-cascader
          v-else-if="item.type === 'cascade'"
          clearable
          filterable
          collapse-tags
          :options="cascadeOpts[item.prop]"
          v-model="searchData[item.prop]"
          :placeholder="item.placeholder"
          :props="{checkStrictly: true, multiple: true}"
          style="width: 100%; margin-bottom: 8px"
        />
        <el-date-picker
          v-else-if="item.type === 'date-picker'"
          type="daterange"
          v-model="searchData[item.prop]"
          range-separator="至"
          :start-placeholder="item.startTimeStr"
          :end-placeholder="item.endTimeStr"
          style="width: 95%; margin-bottom: 8px"
        />
        <div class="button-col" v-else-if="item.type === 'button'">
          <el-button type="primary" @click="handleSearchData">搜索</el-button>
          <el-button type="info" @click="emits('reset-callback')">重置</el-button>
          <el-button
            plain type="primary"
            v-permission="item.addPermission"
            @click="emits('create-callback')"
          >
            新增
          </el-button>
          <el-button type="warning" v-if="otherOperates">
            <el-dropdown trigger="click">
              <el-icon size="large">
                <MoreFilled/>
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in otherOperates" :key="item.key">
                    <div v-permission="item.permission">
                      <el-icon>
                        <component :is="item.icon"/>
                      </el-icon>
                      <span @click="item.callback(ctx)">{{ item.name }}</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup="">
//a.公共引入
import { ref } from 'vue';
import { MoreFilled } from '@element-plus/icons-vue';
//b.自定义类型引入
import type { OperateMenuType, SearchColumnType } from "@/type/base-type";

//1.各可筛选项数据
//1.1父组件参数
const props = defineProps<{
  searchData: any;
  searchColumn: SearchColumnType[];
  otherOperates?: OperateMenuType[];
  selectOpts?: any;
  cascadeOpts?: any;
  suggestOpts?: any;
}>();
//1.2.本组件数据绑定
//1.2.1.该组件上下文参数
const ctx = ref<object>();

//2.各按钮处理函数
//2.1.父组件处理函数集
const emits = defineEmits<{
  (e: 'search-callback'): void
  (e: 'reset-callback'): void
  (e: 'create-callback'): void
}>();
//2.2.本组件处理函数
const getSuggestData = (key: string, qs: string, cb: (arg: any) => void) => {
  const suggestOpts = props.suggestOpts[key];
  const results = qs ?
    suggestOpts.filter((item: any) => item.value.toLowerCase().includes(qs.toLowerCase()))
    : suggestOpts;
  cb(results);
};
const handleSearchData = () => {
  const searchData = props.searchData;
  for (const key in searchData) {
    if (searchData[key] instanceof Object && searchData[key]?.[0] instanceof Array) {
      const cascadeKey: Array<Array<number | string>> = searchData[key];
      searchData[key + 'Cascade'] = cascadeKey?.map(item => item[item.length - 1]);
    } else if (searchData[key] instanceof Object && searchData[key]?.[0] instanceof Object && !(searchData[key]?.[0] instanceof Array)) {
      searchData[key + 'Start'] = searchData[key][0].valueOf();
      searchData[key + 'End'] = searchData[key][1].valueOf() + (24 * 60 * 60 * 1000);
    }
  }
  emits('search-callback');
};

</script>

<style lang="scss" scoped>
.button-col {
  text-align: right;
}
</style>