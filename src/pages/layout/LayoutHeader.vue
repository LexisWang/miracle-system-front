<template>
  <div class="header-container">
    <div class="l-content">
      <el-button size="small" @click="onChangeMenuCollapse">
        <el-icon>
          <Menu/>
        </el-icon>
      </el-button>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-for="menu in globalStore.currentMenu?.filter(item => item.name !== 'home')"
          :to="menu.path"
          :key="menu.path"
        >
          {{ menu.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown class="notify-message" trigger="click">
        <el-badge :value="200" :max="99">
          <el-button class="new-msg">新消息</el-button>
        </el-badge>
        <template #dropdown>
          <el-dropdown-item>你有新的消息1111</el-dropdown-item>
          <el-dropdown-item>你有新的消息2222</el-dropdown-item>
          <el-dropdown-item>你有新的消息3333</el-dropdown-item>
        </template>
      </el-dropdown>
      <el-dropdown>
        <img class="user-icon" src="../../assets/userIcon.png" alt="加载图片失败">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="updPwdVisible = true">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logoutHandler">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog
      width="500"
      title="修改密码"
      :show-close="false"
      v-model="updPwdVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" label-width="80px">
        <el-form-item label="新密码">
          <el-input type="password" v-model="formData.newPwd"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" text @click="updPwdVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="updatePwdHandler">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/global';
import { ArrowRight } from '@element-plus/icons-vue';
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { staffUpdatePwd } from "@/service/system/staff-api"; //@ts-ignore
import md5 from 'js-md5';

const router = useRouter();
const globalStore = useGlobalStore();
const onChangeMenuCollapse = () => {
  globalStore.isCollapse = !globalStore.isCollapse;
};
const logoutHandler = () => {
  globalStore.$reset();
  router.replace({ path: '/login' });
};

const formData = reactive<{ id?: number; newPwd: string }>({ newPwd: '' });
const updPwdVisible = ref<boolean>(false);
const updatePwdHandler = () => {
  if (!formData.newPwd) {
    ElMessage.error("必须输入新密码");
  } else {
    staffUpdatePwd({ id: globalStore.loginData?.userid as number, newPwd: md5(formData.newPwd) })
      .then(() => {
        updPwdVisible.value = false;
        formData.newPwd = '';
      });
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  height: 50px;

  .l-content {
    display: flex;

    .el-button {
      margin: 0 10px;
    }

    .crumbs {
      color: white;
      font-size: 14px;
    }

    .el-breadcrumb {
      ::v-deep(span) {
        color: white;
        line-height: 24px;
      }
    }
  }

  .r-content {
    .notify-message {
      margin-right: 26px;
      .new-msg {
        background-color: #333;
        font-weight: 700;
        color: white;
        border: none;
        padding: 8px;
      }
    }
    .user-icon {
      width: 30px;
      height: 30px;
      margin: 0 10px;
    }
  }
}
</style>