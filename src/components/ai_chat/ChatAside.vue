<template>
  <Transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <aside
      v-show="!collapsed || collapsed"
      :class="[
        'flex flex-col h-[855px] overflow-hidden bg-[var(--theme-aside)] border-r border-gray-200 shadow-md relative',
        collapsed ? 'w-16' : 'w-64 md:w-72 ',
      ]"
    >
      <div class="px-3 py-3 min-h-[48px]">
        <div v-if="!collapsed" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg
              t="1752914624151"
              class="icon"
              viewBox="0 0 1051 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M210.393996 472.446294h73.053471v160.717636h-73.053471z"
                fill="var(--theme-main)"
              />
              <path
                d="M791.169091 531.619605V300.770637H431.746014v-50.406895a127.843574 127.843574 0 0 0 91.316838-121.268762 127.843574 127.843574 0 1 0-164.370309 121.268762v50.406895H0V804.839587h475.578096a230.118434 230.118434 0 0 0 127.11304 131.496248V1024l159.256567-52.598499c157.795497 0 285.639072-100.083255 285.639071-219.160413s-112.502345-207.471858-256.417683-220.621483zM341.15971 129.09498A54.059569 54.059569 0 0 1 395.219278 74.304877a54.790103 54.790103 0 1 1 0 108.849672 54.059569 54.059569 0 0 1-54.059568-54.059569zM73.053471 373.824108h645.062149v157.064963h-34.335131l-32.143528 8.035882-18.993902 5.844277-29.951923 11.688556-18.263368 13.149624h-6.574812V472.446294h-73.053471v160.717636H511.374297a239.615385 239.615385 0 0 0-23.377111 25.568715l-5.844277 13.149625a155.603893 155.603893 0 0 0-10.227486 25.568715 127.11304 127.11304 0 0 0 0 16.071763v16.071764H73.053471z m683.049954 522.332318l-80.358818 24.83818v-34.335131L651.636961 877.893058a159.256567 159.256567 0 0 1-113.23288-116.885554 56.251173 56.251173 0 0 1 0-10.95802c0-80.358818 97.891651-146.106942 219.160413-146.106942 118.346623 0 219.160413 67.939728 219.160413 146.106942s-100.083255 146.106942-220.621482 146.106942z"
                fill="var(--theme-main)"
              />
              <path
                d="M684.511023 714.253283a36.526736 36.526736 0 0 0-36.526735 36.526735 35.065666 35.065666 0 0 0 4.383208 17.532833 36.526736 36.526736 0 0 0 64.287055 0 35.065666 35.065666 0 0 0 4.383208-17.532833 36.526736 36.526736 0 0 0-36.526736-36.526735z"
                fill="var(--theme-main)"
              />
              <path
                d="M827.695826 750.780018m-36.526735 0a36.526736 36.526736 0 1 0 73.053471 0 36.526736 36.526736 0 1 0-73.053471 0Z"
                fill="var(--theme-main)"
              />
            </svg>
            <span class="font-bold text-base text-[var(--theme-main)] select-none">对话历史</span>
          </div>
          <button
            @click="toggleCollapse"
            class="p-1 rounded hover:bg-black/10 dark:hover:bg-gray-800 cursor-target transition-colors"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
        </div>
        <div v-else class="flex flex-col items-center">
          <button
            @click="toggleCollapse"
            class="p-1 rounded hover:bg-white dark:hover:bg-gray-800 transition-colors mb-2"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
            <div class="flex items-center justify-center mt-4 w-full">
          <button
            @click="newConversation"
            class="rounded bg-[var(--theme-main)] py-2 px-4 cursor-target text-white hover:bg-[var(--theme-button-hover)] transition-colors flex items-center"
            title="新建对话"
          >
            <PlusCircle class="w-5 h-5" />
            <span v-if="!collapsed" class="ml-2 font-medium"
              >点击新建对话</span
            >
          </button>
        </div>
      </div>

      <!-- 中部：对话历史列表（仅展开时显示） -->
      <div v-if="!collapsed" class="flex-1 min-h-0 overflow-y-auto px-2 py-1">
        <div
          v-if="conversationStore.conversations.length === 0"
          class="text-gray-400 text-center py-8 select-none"
        >
          暂无会话
        </div>
        <div
          v-for="conv in conversationStore.conversations"
          :key="conv.uuid"
          class="group flex items-center cursor-target gap-2 px-2 py-2 rounded cursor-pointer hover:bg-black/10 dark:hover:bg-gray-800 transition-colors mb-1 relative"
          :class="
            conversationStore.currentConversationuuId === conv.uuid
              ? 'bg-white/50 dark:bg-gray-800'
              : ''
          "
          @click="showConversation(conv.uuid)"
        >
          <div
            class="w-8 h-8 bg-[var(--theme-main)] rounded-full flex items-center justify-center text-white text-sm font-bold"
          >
            {{ conv.title ? conv.title[0] : '会' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="truncate font-medium">
              {{
                conv.title.length > 20
                  ? conv.title.slice(0, 20) + '...'
                  : conv.title || '未命名会话'
              }}
            </div>
            <div class="truncate text-xs text-gray-500">
              {{
                conv.messages.length > 0
                  ? conv.messages[conv.messages.length - 1].content
                  : '暂无消息'
              }}
            </div>
          </div>
          <!-- 操作按钮：悬停显示 -->
          <button
            class="absolute cursor-target right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            @click.stop="toggleMenu(conv, $event)"
          >
            <MoreHorizontal class="w-5 h-5 text-gray-400" />
          </button>
          <!-- 弹出菜单 -->
          <div
            v-if="menuVisible && menuItem && menuItem.uuid === conv.uuid"
            class="absolute right-8 top-[60%] -translate-y-0 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-100 dark:border-gray-800 z-10 flex flex-col min-w-[120px]"
          >
            <button
              class="flex cursor-target items-center gap-2 px-4 py-2 dark:hover:bg-gray-800 hover:bg-gray-100 text-gray-700 dark:text-gray-300"
              @click="handleRename(conv)"
            >
              <Edit3 class="w-4 h-4" />
              重命名
            </button>
            <button
              class="flex cursor-target items-center gap-2 px-4 py-2 dark:hover:bg-gray-800 text-red-500 hover:bg-red-50"
              @click="remove(conv)"
            >
              <Trash2 class="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
        <div v-if="currentConversationEmpty" class="text-gray-400 text-center py-4 select-none">
          当前已经是新对话
        </div>
      </div>

      <!-- 重命名弹窗 -->
      <Teleport to="body">
        <div v-if="showRenameModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 p-6">
            <h3 class="text-lg font-bold mb-4 dark:text-white">重命名会话</h3>
            <input
              v-model="renameTitle"
              type="text"
              class="w-full px-3 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-main)]"
              placeholder="请输入新的会话名称"
              @keyup.enter="confirmRename"
            />
            <div class="flex justify-end gap-2">
              <button
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                @click="showRenameModal = false"
              >
                取消
              </button>
              <button
                class="px-4 py-2 bg-[var(--theme-main)] text-white rounded hover:opacity-90"
                @click="confirmRename"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </aside>
  </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft, ChevronRight, MoreHorizontal, PlusCircle, Trash2, Edit3 } from 'lucide-vue-next'
import router from '@/router/index.js'
import { useConversationStore } from '@/stores/conversation.js'
import { useUserStore } from '@/stores/user.js'
import http from '@/api/http.js'
import { useAssistantStore } from '@/stores/assistant.js'

const conversationStore = useConversationStore()
const userStore = useUserStore()
const conversationStorageKey = 'chat_current_conversation_uuid'
const collapsed = ref(false)
const showLogoutModal = ref(false)
const minWidth = 1300
const showUserMenu = ref(false)

// 重命名相关
const showRenameModal = ref(false)
const renameTitle = ref('')
const renamingConv = ref(null)

// 系统设置弹窗相关
const showSettingsModal = ref(false)
const activeTab = ref('general')


function handleResize() {
  collapsed.value = window.innerWidth < minWidth
}

function handleRefreshConvList() {
  reloadConvList(false)
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  handleResize()
  await reloadConvList(true)
  window.addEventListener('chat-refresh-conversation-list', handleRefreshConvList)
  // 监听 AppHeader 触发的账号管理 tab 切换事件
  window.addEventListener('show-account-tab', handleShowAccountTab)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('chat-refresh-conversation-list', handleRefreshConvList)
  window.removeEventListener('show-account-tab', handleShowAccountTab)
})

function handleShowAccountTab() {
  showSettingsModal.value = true
  activeTab.value = 'account'
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

async function reloadConvList(shouldSelect) {
  try {
    const res = await http.listConversations(1, 20)
    // 批量获取所有会话的消息
    if (!res || res.length === 0) return
    const conversationPromises = res.map(fetchConvs)
    const conversations = await Promise.all(conversationPromises)
    // 统一添加，避免重复
    conversationStore.setConversations(conversations)

    if (!shouldSelect) return
    if (sessionStorage.getItem('chat_just_logged_in') === '1') {
      sessionStorage.removeItem('chat_just_logged_in')
      localStorage.removeItem(conversationStorageKey)
      conversationStore.setConfirmCreateConversation(true)
      conversationStore.setCurrentConversationuuId(null)
      window.dispatchEvent(new Event('chat-new-conversation'))
      return
    }
    if (sessionStorage.getItem('chat_enter_new') === '1') {
      sessionStorage.removeItem('chat_enter_new')
      localStorage.removeItem(conversationStorageKey)
      conversationStore.setConfirmCreateConversation(true)
      conversationStore.setCurrentConversationuuId(null)
      window.dispatchEvent(new Event('chat-new-conversation'))
      return
    }
    const storedUuid = localStorage.getItem(conversationStorageKey)
    const exists = storedUuid && conversations.some((c) => c.uuid === storedUuid)
    if (exists) {
      conversationStore.setCurrentConversationuuId(storedUuid)
      conversationStore.setConfirmCreateConversation(false)
      window.dispatchEvent(new CustomEvent('chat-select-conversation', { detail: { uuid: storedUuid } }))
      return
    }
    if (conversations.length > 0) {
      const uuid = conversations[0].uuid
      conversationStore.setCurrentConversationuuId(uuid)
      localStorage.setItem(conversationStorageKey, uuid)
      conversationStore.setConfirmCreateConversation(false)
      window.dispatchEvent(new CustomEvent('chat-select-conversation', { detail: { uuid } }))
    }
  } catch (e) {
    // 获取会话列表失败
    console.error('获取会话列表失败', e)
  }
}

async function fetchConvs(element) {
  const conversation = {
    uuid: element.uuid,
    title: element.title,
    user_id: userStore.user.uuid,
    setting_id: 0,
    messages: [],
  }
  try {
    const messages = await http.getConversationMessages(1, 20, conversation.uuid)
    if (messages && messages.length > 0) {
      if (!conversation.title || conversation.title === '新会话' || conversation.title === '未命名会话') {
        conversation.title = messages[0].content || '当前暂无对话，稍后为您清除'
      }
      conversation.messages = messages.map((message) => ({
        uuid: message.uuid,
        conversation_uuid: message.conversation_uuid,
        role: message.role,
        content: message.content,
        sequence: message.sequence,
      }))
    } 
  } catch {
    if (!conversation.title) {
      conversation.title = '新会话'
    }
  }
  return conversation
}

function handleRename(conv) {
  renameTitle.value = conv.title
  renamingConv.value = conv
  showRenameModal.value = true
  menuVisible.value = false
}

async function confirmRename() {
  if (!renameTitle.value || !renamingConv.value) return
  
  try {
    const result = await http.updateConversation({
      uuid: renamingConv.value.uuid,
      title: renameTitle.value
    })
    console.log('Update conversation result:', result)
    
    // Update local store
    const conv = conversationStore.conversations.find(c => c.uuid === renamingConv.value.uuid)
    if (conv) {
      conv.title = renameTitle.value
    }
    
    showRenameModal.value = false
    renamingConv.value = null
    renameTitle.value = ''
  } catch (e) {
    console.error('重命名失败', e)
    alert('重命名失败: ' + (e.message || '未知错误'))
  }
}



// 动画钩子
function beforeEnter(el) {
  el.style.height = '0'
  el.style.opacity = '0'
}


function enter(el) {
  const height = el.scrollHeight
  el.style.transition =
    'height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)'
  el.style.height = height + 'px'
  el.style.opacity = '1'
  el.addEventListener(
    'transitionend',
    () => {
      el.style.height = ''
      el.style.transition = ''
    },
    { once: true },
  )
}

function leave(el) {
  el.style.transition =
    'height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)'
  el.style.height = el.scrollHeight + 'px'
  void el.offsetHeight
  el.style.height = '0'
  el.style.opacity = '0'
}

const menuVisible = ref(false)
const menuItem = ref(null)

function toggleMenu(item, event) {
  if (menuVisible.value && menuItem.value === item) {
    hideMenu()
    return
  }
  menuItem.value = item
  menuVisible.value = true
  document.addEventListener('click', hideMenu, { once: true })
}

function hideMenu() {
  menuVisible.value = false
  menuItem.value = null
}

async function remove(conv) {
  console.log('删除会话', conv.uuid)
  await http.deleteConversation(conv.uuid).then(() => {
    if (conversationStore.currentConversationuuId === conv.uuid) {
      conversationStore.setCurrentConversationuuId(null)
      localStorage.removeItem(conversationStorageKey)
    }
  })
  menuVisible.value = false

  router.go(0)
}


function showConversation(uuid) {
  conversationStore.setConfirmCreateConversation(false)
 // console.log('showConversation:', uuid)
  conversationStore.setCurrentConversationuuId(uuid)
  localStorage.setItem(conversationStorageKey, uuid)
  window.dispatchEvent(new CustomEvent('chat-select-conversation', { detail: { uuid } }))
}

async function newConversation() {
  conversationStore.setConfirmCreateConversation(true)
  conversationStore.setCurrentConversationuuId(null)
  localStorage.removeItem(conversationStorageKey)
  window.dispatchEvent(new Event('chat-new-conversation'))
  await reloadConvList(false)
}

const currentConversationEmpty = computed(() => {
  const conv = conversationStore.conversations.find(
    (c) => c.uuid === conversationStore.currentConversationuuId,
  )
  return conv && conv.messages.length === 0
})
</script>
