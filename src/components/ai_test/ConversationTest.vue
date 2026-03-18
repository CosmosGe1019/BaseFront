<script setup lang="ts">
import '@/assets/theme.css'
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 路由跳转时自动断开 WebSocket
const router = useRouter()
onMounted(() => {
  router.beforeEach((to, from, next) => {
    if (wsConnected.value) {
      manualClose = true
      WebsocketClient.getInstance().close()
    }
    next()
  })
})
onBeforeUnmount(() => {
  if (wsConnected.value) {
    manualClose = true
    WebsocketClient.getInstance().close()
  }
})
import WebsocketClient from '@/api/websocket'
import { LlmSetting, WsMessage } from '@/types/request'
import { LlmMsg } from '@/types/response'
import { marked } from 'marked'
import { useTempAiSetting } from '../../stores/globalStore'
import { useConversationStore } from '../../stores/conversation'
import { useKonwledgeTestStore } from '@/stores/konwledgeTest'

const konwledgeTestStore = useKonwledgeTestStore()
const isWebSearch = computed({
  get: () => konwledgeTestStore.isWebSearch,
  set: (v) => konwledgeTestStore.setWebSearch(v),
})
// 支持图片消息，img 可选
type ChatTestMsg = { role: 1 | 0; content: string; img?: string; }
const messages = ref<ChatTestMsg[]>([])
// 存储用户输入内容
const inputMessage = ref('')
// 消息容器
const messageContainer = ref<HTMLElement | null>(null)
// 用于控制是否终端流式响应
const isStreamInterrupted = ref(false)
// 当前正在接受ai消息的对象
let currentAIMessage: { role: 1; content: string;play_id: string } | null = null

// 等待 AI 响应 loading 状态
const isLoading = ref(false)

// ai临时设定
const tempAiSetting = useTempAiSetting()

let isInit = false

//

// WebSocket 连接状态
const wsConnected = ref(false)

// 切换 WebSocket 连接/断开
// 标记是否为手动断开
let manualClose = false
function toggleWsConnection() {
  if (wsConnected.value) {
    manualClose = true
    WebsocketClient.getInstance().close()
    // wsConnected 状态将在 ws.onclose 里自动变红
    // 清空输入和当前AI消息，历史消息保留
    isInit = false
    inputMessage.value = ''
    currentAIMessage = null
  } else {
    manualClose = false
    initWebSocketListener()
    // wsConnected 状态将在 ws.onopen 里自动变绿
  }
}

const initWebSocketListener = () => {
  return new Promise((resolve) => {
    const wsClient = WebsocketClient.getInstance()
    const ws = wsClient.getWsConnection()
    const ts = []
    useKonwledgeTestStore().getTestData.forEach((item) => {
      ts.push(...item)
    })
    ws.onopen = () => {
      console.log('连接成功')
      wsConnected.value = true
      isInit = true
      // 连接成功后，发送 ping 消息
      wsClient.interval = setInterval(() => {
        wsClient.ping()
      }, 20000)
      let settingData: LlmSetting = {
        prompt_text: tempAiSetting.getValue(),
        prompt_uuid: '',
        namespace_uuid: ts,
      }
      console.log('发送设定hhhhhh', settingData.namespace_uuid)
      let settingMsg: WsMessage = {
        type: 'setting',
        data: JSON.stringify(settingData),
      }
      console.log('发送设定', settingMsg)
      wsClient.send(settingMsg)
      // 连接成功后 resolve
      resolve(true)
    }
    ws.onclose = () => {
      wsConnected.value = false
      isInit = false
      if (!manualClose) {
        // 自动断开，弹出提示，保留历史消息
        alert('WebSocket 连接已断开，请检查网络或重新连接')
      }
      manualClose = false
    }

    ws.onmessage = (event) => {
      const msg: WsMessage = JSON.parse(event.data)
      console.log('收到消息', msg)

      switch (msg.type) {
        case 'pong': {
          console.log('websocket 连接正常------------')
          break
        }

        case 'stop': {
          ws.close()
          isLoading.value = false
          break
        }

        case 'llmConv': {
          // AI回复开始，隐藏 loading
          isLoading.value = false
          // 过滤掉 base64 图片内容的 AI 消息
          if (typeof msg.data.content === 'string' && msg.data.content.startsWith('data:image/')) {
            // 不接收 base64 图片消息
            break
          }
          if(msg.data.role === 0) return
          // 如果当前 AI 消息对象不存在或 play_id 不匹配，则创建新的 AI
          if (!currentAIMessage || currentAIMessage.play_id !== msg.data.play_id ) {
            currentAIMessage = { role: 1, content: '', play_id: msg.data.play_id }
            messages.value.push(currentAIMessage)
          }
          console.log('流式消息内容', messages.value)
          currentAIMessage.content += msg.data.content
          // 关键：强制触发响应式更新
          messages.value = [...messages.value]
          break
        }
        default: {
          break
        }
      }
    }
  })
}
//修改这个部分的代码xianget instance,ranhou diaoyong close
// 发送文本或图片消息
const sendMessage = async () => {
  
  if (!wsConnected.value) {
    alert('请先连接 WebSocket')
    return
  }
  isStreamInterrupted.value = true
  isStreamInterrupted.value = false
  currentAIMessage = null

  const userMessage = inputMessage.value.trim()
  if (userMessage) {
    messages.value.push({ role: 0, content: userMessage })
    inputMessage.value = ''
    try {
      const msg: WsMessage = {
        type: isWebSearch.value ? 'web-search' : 'text', // 关键
        data: userMessage,
      }
      WebsocketClient.getInstance().send(msg)
      isLoading.value = true
    } catch (error) {
      console.error('AI 响应出错:', error)
      messages.value.push({ role: 1, content: '抱歉，暂时无法响应，请稍后再试。' })
      isLoading.value = false
    }
  }
}

// 发送图片消息
const onImageSelect = async (e: Event) => {
  if (!wsConnected.value) {
    alert('请先连接 WebSocket')
    return
  }
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    const file = files[0]

    isStreamInterrupted.value = true
    isStreamInterrupted.value = false
    currentAIMessage = null // 关键：每次发图片都重置 AI 消息对象，保证后续AI回复能正常 push

    setTimeout(() => {
  isLoading.value = true
  console.log('上传文件:', isLoading.value) // 这里才会打印 true
}, 0)
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      messages.value.push({ role: 0, content: '', img: base64Data })
      const msg: WsMessage = {
        type: 'img',
        data: base64Data,
      }
      WebsocketClient.getInstance().send(msg)
    } catch (error) {
      console.error('图片发送出错:', error)
      isLoading.value = false
    }
  }
}

// 处理回车键发送消息
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
    useConversationStore().setConfirmCreateConversation(true)
  }
}



// 消息变化时自动滚动到底部
watch(
  messages,
  () => {
    requestAnimationFrame(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    })
  },
  { deep: true },
)
</script>

<template>
  <div
    class="border-gray-400 bg-white/50 min-h-[91.5vh]  flex flex-col overflow-hidden justify-start"
  >
    <header class="flex justify-between items-center px-6 py-3 border-b-[1.5px] border-[#e0e7ef]">
      <div>
        <span class="text-xl font-bold text-black tracking-wide border-gray-200">效果测试</span>
      </div>
      
      <button
        class="flex cursor-target items-center gap-2 px-4 h-10 rounded-full shadow-lg transition border border-gray-200 backdrop-blur-sm font-semibold text-base focus:outline-none"
        :class="wsConnected ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[var(--theme-main)] hover:bg-[var(--theme-button-hover)] text-white'"
        @click="toggleWsConnection"
        :title="wsConnected ? '断开 WebSocket 连接' : '连接 WebSocket'"
      >
      <svg v-if="!wsConnected" class="icon" viewBox="0 0 1024 1024" width="22" height="22" fill="none">
        <circle cx="512" cy="512" r="400" :stroke="'#fff'" stroke-width="60" fill="none" />
        <path d="M512 312v200m0 0v200m0-200h200m-200 0H312" :stroke="'#fff'" stroke-width="60" stroke-linecap="round"/>
      </svg>
      <svg v-else class="icon" viewBox="0 0 1024 1024" width="22" height="22" fill="none">
        <circle cx="512" cy="512" r="400" :stroke="'#fff'" stroke-width="60" fill="none" />
        <path d="M312 312l400 400M312 712l400-400" :stroke="'#fff'" stroke-width="60" stroke-linecap="round"/>
      </svg>
        <span>
          {{ wsConnected ? '点击停止测试' : '点击开始测试' }}
        </span>
      </button>
    </header>
    <main ref="messageContainer" class="flex-1 overflow-y-auto px-6 py-4">
      <!-- 消息展示区域 -->
      <div v-for="(msg, index) in messages" :key="index" class="flex my-3">
        <div
          v-if="msg.role === 1"
          class="bg-gradient-to-r from-[#e0e7ef] to-[#f0f9ff] text-[#2563eb] rounded-[1.25rem_1.25rem_1.25rem_0.25rem] px-5 py-4 max-w-[70%] shadow-[0_2px_8px_0_rgba(96,165,250,0.08)] text-base border-[1.5px] border-[#bfcdec] break-words overflow-wrap"
        >
          <span v-if="msg.content" v-html="marked(msg.content)"></span>
        </div>
        <div
          v-else
          class="bg-gradient-to-r from-[#bae6fd] to-[#dbeafe] text-[#2563eb] rounded-[1.25rem_1.25rem_0.25rem_1.25rem] px-5 py-4 max-w-[70%] shadow-[0_2px_8px_0_rgba(96,165,250,0.08)] text-base border-[1.5px] border-[#60a5fa] break-words overflow-wrap ml-auto"
        >
          <template v-if="msg.img">
            <img :src="msg.img" class="max-w-[220px] max-h-[220px] rounded-lg border border-gray-200 shadow" alt="图片消息" />
          </template>
          <template v-else>
            {{ msg.content }}
          </template>
        </div>
      </div>
    </main>
    <!-- 等待 AI 响应 loading，移到消息盒子(main)外部 -->
    <div v-if="isLoading" class="flex justify-center items-center py-2">
      <div class="flex items-center gap-2 bg-gradient-to-r from-[#e0e7ef] to-[#f0f9ff] text-[#2563eb] rounded-[1.25rem] px-5 py-3 shadow-[0_2px_8px_0_rgba(96,165,250,0.08)] text-base border-[1.5px] border-[#bfcdec]">
        <svg class="animate-spin" width="22" height="22" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#60a5fa" stroke-width="5" stroke-linecap="round" stroke-dasharray="31.4 31.4"/>
        </svg>
        <span>正在思考...</span>
      </div>
    </div>
    <div class="px-6 py-4 bg-gradient-to-t relative">
      <button
  class="flex-shrink-0 h-[44px] cursor-target w-auto px-4 flex mb-4 items-center justify-center border border-blue-300 shadow rounded-full cursor-pointer hover:bg-[var(--theme-body)] transition disabled:opacity-50 disabled:cursor-not-allowed mr-2"
  :class="konwledgeTestStore.isWebSearch ? 'bg-[var(--theme-aside)] ' : ''"
  @click="konwledgeTestStore.isWebSearch = !konwledgeTestStore.isWebSearch"
  :title="konwledgeTestStore.isWebSearch ? '已开启联网搜索，禁用图片和知识库' : '点击开启联网搜索（禁用图片和知识库）'"
>
   {{ konwledgeTestStore.isWebSearch ? '已经开启联网搜索' : '联网搜索' }}
</button>
      <div class="flex items-end gap-3">
        <textarea
  v-model="inputMessage"
  @keypress="handleKeyPress"
  class="flex-1 min-h-[44px] cursor-target max-h-[120px] px-4 py-3 rounded-xl border-[1.5px] border-[#bfcdec] text-base text-[#2563eb] shadow-[0_1px_4px_0_rgba(96,165,250,0.06)] transition-all resize-vertical focus:outline-none focus:border-[#60a5fa] focus:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]"
  rows="2"
  placeholder="输入你的消息..."
  :maxlength="120"
  :disabled="!wsConnected"
  :title="!wsConnected ? '请先连接 WebSocket' : ''"
></textarea>
        <!-- 图片上传按钮 -->
         <label
          :class="['flex-shrink-0 h-[44px] w-[44px] flex items-center justify-center border border-blue-300 shadow rounded-full cursor-pointer hover:bg-blue-100 transition', !wsConnected ? 'opacity-50 cursor-not-allowed' : '']"
          :title="!wsConnected ? '请先连接 WebSocket' : ''"
        >
         <button
  @click="sendMessage"
  :disabled="!wsConnected"
  :title="!wsConnected ? '请先连接 WebSocket' : ''"
  class="flex-shrink-0 cursor-target h-[44px] w-[44px] flex items-center justify-center border border-blue-300 shadow rounded-full cursor-pointer hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
          <svg t="1754385205649" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1492" width="30" height="30"><path d="M511.3 63.2C264.4 63.2 63.6 264 63.6 510.9s200.8 447.7 447.7 447.7S959 757.7 959 510.9 758.2 63.2 511.3 63.2z m0 858.1C285.1 921.3 101 737.2 101 510.9s184.1-410.4 410.4-410.4 410.4 184.1 410.4 410.4-184.2 410.4-410.5 410.4z" p-id="1493" fill="#2c2c2c"></path><path d="M718.8 255.8c-11.5-7.8-26-8.1-37.9-0.9L230.7 528.1c-12.9 7.8-19.7 22.7-17.3 37.9 2.3 15 12.9 26.9 27.2 30.5L351.8 624c10.2 2.5 20.1-3.7 22.6-13.6 2.5-10-3.6-20.1-13.6-22.6L250 560l447.8-272.8-58.2 369.4-195.9-48.4 113.7-135.9c6.6-7.9 5.5-19.6-2.4-26.3-7.8-6.6-19.6-5.6-26.3 2.4l-130 155.5c-5.4 6.4-8.3 14.6-8.3 23.1v109.5c0 14.1 8.1 27 20.7 32.6 4.5 2 9.1 3 13.8 3 8.1 0 16-3 22.4-8.7l68.7-61.3c7.7-6.8 8.3-18.7 1.5-26.3-6.8-7.7-18.6-8.4-26.3-1.5L427.7 731l-0.3-88.2L630.6 693c2.8 0.7 5.7 1.1 8.5 1.1 6.8 0 13.4-2 19.3-5.9 8.6-5.7 14.4-14.9 16.1-25.2l60-369.6c2.5-14.8-3.7-29.5-15.7-37.6z" p-id="1494" fill="#2c2c2c"></path></svg>
        </button>
        </label>
        <label
          :class="['flex-shrink-0 cursor-target h-[44px] w-[44px] flex items-center justify-center border border-blue-300 shadow rounded-full cursor-pointer hover:bg-blue-100 transition', !wsConnected ? 'opacity-50 cursor-not-allowed' : '']"
         :title="!wsConnected ? '请先连接 WebSocket' : konwledgeTestStore.isWebSearch ? '联网搜索模式下禁用上传图片' : ''"
        >
          <input accept="image/*" class="hidden" type="file" @change="onImageSelect" :disabled="!wsConnected || isWebSearch"  />
          <svg t="1754385411688" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2535" width="24" height="24"><path d="M901.870933 31.744c68.266667 0 116.053333 54.613333 116.053334 122.88v723.626667c0 68.266667-54.613333 122.88-116.053334 122.88h-785.066666c-68.266667 0-116.053333-54.613333-116.053334-122.88v-730.453334c0-68.266667 54.613333-122.88 116.053334-122.88h785.066666z m-218.453333 471.04c-6.826667 0-20.48 6.826667-34.133333 13.653333-27.306667 20.48-54.613333 47.786667-88.746667 95.573334 0 6.826667-54.613333 68.266667-68.266667 88.746666l-6.826666 6.826667c-27.306667 34.133333-47.786667 47.786667-68.266667 47.786667-27.306667 0-47.786667-6.826667-75.093333-40.96l-20.48-13.653334-34.133334-40.96-34.133333-34.133333c-13.653333 0-61.44 34.133333-129.706667 102.4l-34.133333 34.133333v109.226667c0 20.48 13.653333 34.133333 34.133333 34.133333h785.066667c20.48 0 34.133333-13.653333 34.133333-34.133333v-81.92c-122.88-191.146667-218.453333-286.72-259.413333-286.72z m218.453333-389.12h-785.066666c-20.48 0-34.133333 13.653333-34.133334 34.133333v498.346667c81.92-68.266667 129.706667-102.4 170.666667-102.4 27.306667 0 47.786667 6.826667 75.093333 40.96l20.48 20.48 40.96 47.786667 13.653334 13.653333 6.826666 6.826667 6.826667-13.653334 6.826667-13.653333 6.826666-6.826667 54.613334-68.266666 13.653333-20.48c34.133333-40.96 61.44-75.093333 95.573333-95.573334 27.306667-20.48 54.613333-34.133333 81.92-34.133333 68.266667 0 150.186667 75.093333 259.413334 225.28v-491.52c0-27.306667-13.653333-40.96-34.133334-40.96z m-648.533333 116.053333c54.613333 0 95.573333 47.786667 95.573333 102.4s-40.96 95.573333-95.573333 95.573334-102.4-40.96-102.4-95.573334 40.96-102.4 102.4-102.4z m0 61.44c-27.306667 0-40.96 13.653333-40.96 40.96 0 20.48 20.48 40.96 40.96 40.96s34.133333-20.48 34.133333-40.96c0-27.306667-13.653333-40.96-34.133333-40.96z" fill="#2c2c2c" p-id="2536"></path></svg>
        </label>
        
        
      </div>
    </div>
  </div>
</template>
