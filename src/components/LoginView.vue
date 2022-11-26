<template>
  <div class="login">
    <el-card class="box-card">
      <template #header>
        <span class="system-title">后台管理系统</span>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="rules"
        label-width="60px"
        class="loginForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginData.username" clearable/>
        </el-form-item>
        <el-form-item label="密码" type="password" prop="password">
          <el-input
            clearable
            type="password"
            show-password
            v-model="loginData.password"
            @keydown.enter="submitForm"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="sub-btn" type="primary" @click="submitForm"
          >登陆
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useGlobalStore } from '@/stores/global';
import { usernameCheck } from "@/utils/validator";
import { staffLoginApi } from "@/service/system-api";
import type { LoginFormModel } from "@/type/layout-type";
import type { FormInstance } from "element-plus";

const loginFormRef = ref<FormInstance>();
const loginData = reactive<LoginFormModel>({ username: '', password: '' });

const rules = {
  username: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: usernameCheck, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 26, message: '密码长度在6~24之间', trigger: 'blur' },
  ]
};
const submitForm = () => {
  // createPerson({ orgName: 'Miracle-', orgAge: 26, createTime: new Date().valueOf() }).then(res => {
  //   console.log(res);
  // })
  loginFormRef?.value?.validate((valid: boolean) => {
    if (valid) {
      //发送登录请求
      staffLoginApi(loginData).then(({ data }) => {
        const globalStore = useGlobalStore();
        globalStore.setLongRespData(data);
      });
      ElMessage.success("登录成功");
    }
  });
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  background: url("@/assets/bg.jpg");

  .el-card {
    background: #65768557;
  }

  .box-card {
    width: 450px;
    margin: 200px auto;
    text-align: center;

    ::v-deep(.el-form-item__label) {
      color: white;
    }

    .system-title {
      color: white;
      font-size: 34px;
      font-weight: bold;
    }
  }

  .loginForm {
    width: 400px;

    .sub-btn {
      width: 100%;
    }
  }
}

</style>