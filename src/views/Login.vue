<template>
  
  <div class="login-box">
    <el-card class="login-card">
      <h2 class="title">后台管理系统登录</h2>
      <el-form ref="loginRef" :model="loginForm" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'


const router = useRouter()
const userStore = useUserStore()
const loginForm = ref({
  username: '',
  password: ''
})

const handleLogin = () => {
  if(!loginForm.value.username || !loginForm.value.password) {
    alert('账号密码不能为空')
    return
  }
  // 模拟生成令牌
  const mockToken = 'admin_123456'
  userStore.setToken(mockToken)
  router.push('/home')
}
</script>

<style scoped>
.login-box{
  width: 99vw;
  height: 99vh;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: relative;
  z-index: 10; */
}
.login-card{
  width: 400px;
  padding: 30px;
}
.title{
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}
.login-btn{
  width: 100%;
}
</style>
