<template>
  <div class="user-wrap">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model="searchName" placeholder="搜索用户名"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-col>
    </el-row>

    <el-button type="primary" style="margin:20px 0" @click="openDialog">新增用户</el-button>

    <el-table :data="tableData" border style="width:100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="age" label="年龄"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:20px;text-align:right"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="getUserData"
      @current-change="getUserData"
    />

    <!-- 新增编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="用户信息">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model.number="formData.age"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserList, delUser, addUser, editUser } from '../api/user'

const loading = ref(false)
const originData = ref<any[]>([])
const searchName = ref('')
const currentPage = ref(1)
const pageSize = ref(3)

// 弹窗相关
const dialogVisible = ref(false)
const formData = ref({
  id: 0,
  name: '',
  age: 0,
  phone: ''
})
const isEdit = ref(false)

// 筛选数据
const filterData = computed(() => {
  if(!searchName.value) return originData.value
  return originData.value.filter(item => 
    item.name.includes(searchName.value)
  )
})

const total = computed(() => filterData.value.length)
const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filterData.value.slice(start, end)
})

// 获取列表
const getUserData = async () => {
  loading.value = true
  try {
    const res:any = await getUserList()
    originData.value = res.data
  } catch (err) {
    ElMessage.error('数据请求失败')
  } finally {
    loading.value = false
  }
}

// 搜索重置
const handleSearch = () => currentPage.value = 1
const resetSearch = () => {
  searchName.value = ''
  currentPage.value = 1
}

// 删除
const handleDel = async (row: any) => {
  await delUser(row.id)
  ElMessage.success('删除成功')
  getUserData()
}

// 打开弹窗
const openDialog = (row?: any) => {
  if(row) {
    isEdit.value = true
    formData.value = {...row}
  } else {
    isEdit.value = false
    formData.value = {id:0,name:'',age:0,phone:''}
  }
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if(isEdit.value){
    await editUser(formData.value)
    ElMessage.success('编辑成功')
  }else{
    await addUser(formData.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getUserData()
}

onMounted(() => {
  getUserData()
})
</script>