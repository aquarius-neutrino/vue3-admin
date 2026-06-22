<template>
  <div class="ai-chat-container">
    <div class="chat-box" ref="chatBoxRef">
      <div v-for="(item, index) in msgList" :key="index" class="msg-item" :class="item.role">
        <div class="avatar">{{ item.role === 'user' ? '我' : 'AI' }}</div>
        <div class="content">{{ item.content }}</div>
      </div>
      <div v-if="loading" class="loading">AI 思考中...</div>
    </div>

    <div class="action-bar">
      <el-button type="default" size="small" @click="clearChat">清空聊天记录</el-button>
    </div>

    <div class="input-bar">
      <el-input v-model="inputText" placeholder="输入消息..." @keyup.enter="sendMsg" />
      <el-button type="primary" @click="sendMsg" :loading="loading">发送</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 从本地缓存读取聊天记录（刷新不丢失）
const msgList = ref(JSON.parse(localStorage.getItem('aiChatHistory') || '[{"role":"assistant","content":"你好！我是通义千问AI助手～"}]'))

const inputText = ref('')
const chatBoxRef = ref(null)
const loading = ref(false)

// ====================
// 填入你自己的阿里云 KEY
// ====================
const API_KEY = ''

// 保存聊天记录到本地
const saveToLocal = () => {
  localStorage.setItem('aiChatHistory', JSON.stringify(msgList.value))
}

// 打字机效果
const typewriter = async (index, text) => {
  msgList.value[index].content = ''
  for (let i = 0; i < text.length; i++) {
    msgList.value[index].content += text[i]
    await new Promise(r => setTimeout(r, 15))
    scrollToBottom()
    saveToLocal()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  const el = chatBoxRef.value
  if (el) el.scrollTop = el.scrollHeight
}

// 发送消息
const sendMsg = async () => {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  msgList.value.push({ role: 'user', content: text })
  inputText.value = ''
  saveToLocal()
  await scrollToBottom()

  const aiIndex = msgList.value.length
  msgList.value.push({ role: 'assistant', content: '' })
  loading.value = true

  try {
    const res = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages: msgList.value.slice(0, -1) },
        parameters: { result_format: 'message' }
      })
    })

    const data = await res.json()
    const reply = data.output?.choices?.[0]?.message?.content || '我暂时无法回答，请换个问题~'
    await typewriter(aiIndex, reply)
  } catch (err) {
    await typewriter(aiIndex, '请求失败，请检查API_KEY或网络')
    ElMessage.error('AI 请求异常')
  } finally {
    loading.value = false
    saveToLocal()
  }
}

// 清空聊天
const clearChat = () => {
  msgList.value = [{ role: 'assistant', content: '你好！我是通义千问AI助手～' }]
  saveToLocal()
  ElMessage.success('已清空聊天记录')
}

// 页面加载自动滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.ai-chat-container {
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.chat-box {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px;
  background: #f9f9f9;
}
.msg-item {
  display: flex;
  margin-bottom: 12px;
  gap: 10px;
}
.msg-item.user {
  flex-direction: row-reverse;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.content {
  max-width: 75%;
  padding: 10px 14px;
  background: #fff;
  border-radius: 8px;
  line-height: 1.5;
  white-space: pre-wrap;
}
.user .content {
  background: #e0f7ff;
}
.loading {
  padding: 10px;
  color: #999;
  font-size: 13px;
}
.action-bar {
  margin: 8px 0;
  text-align: left;
}
.input-bar {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}
</style>