<template>
  <el-container style="height: 100vh;">
    <el-header style="text-align:right;padding:20px">
      <el-button @click="handleLogout" type="success">退出登录</el-button>
    </el-header>
     <el-container>
    <el-aside width="200px" background="#304156">
      <el-menu
        router
        text-color="#000"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/home">
          <template #icon><House /></template>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <template #icon><User /></template>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-main>
      <router-view />
    </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>