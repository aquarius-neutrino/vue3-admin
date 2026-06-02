<template>
  <!-- 3D 星空背景 -->
  <StarBackground />
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>用户总数</h3>
          <p class="num">{{ userTotal }}</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>今日新增</h3>
          <p class="num">{{ newUser }}</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>活跃人数</h3>
          <p class="num">{{ activeUser }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12">
        <el-card shadow="hover">
          <div id="barChart" style="width:100%;height:350px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div id="pieChart" style="width:100%;height:350px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import StarBackground from '../components/StarBackground.vue'

// 统计数据
const userTotal = 1286
const newUser = 36
const activeUser = 892

// 柱状图
let barChart: echarts.ECharts | null = null
const initBarChart = () => {
  const dom = document.getElementById('barChart')
  if(!dom) return
  barChart = echarts.init(dom)
  const option = {
    title: { text: '月度用户增长' },
    xAxis: {
      type: 'category',
      data: ['1月','2月','3月','4月','5月','6月']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 80, 70, 130],
      type: 'bar',
      smooth: true
    }]
  }
  barChart.setOption(option)
}

// 饼图
let pieChart: echarts.ECharts | null = null
const initPieChart = () => {
  const dom = document.getElementById('pieChart')
  if(!dom) return
  pieChart = echarts.init(dom)
  const option = {
    title: { text: '用户年龄分布' },
    series: [{
      type: 'pie',
      radius: '70%',
      data: [
        { value: 335, name: '20岁以下' },
        { value: 310, name: '20-25岁' },
        { value: 234, name: '25-30岁' },
        { value: 135, name: '30岁以上' }
      ]
    }]
  }
  pieChart.setOption(option)
}
// 监听窗口缩放
onMounted(() => {
  initBarChart()
  initPieChart()
  window.addEventListener('resize', () => {
    barChart?.resize()
    pieChart?.resize()
  })
})
</script>

<style scoped>
.home{
  padding: 10px;
}
.num{
  font-size: 28px;
  color: #409eff;
  font-weight: bold;
  margin: 10px 0;
}
</style>