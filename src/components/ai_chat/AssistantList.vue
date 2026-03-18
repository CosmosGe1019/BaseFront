<!--aside-->
<template>
  <Transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div class="relative">
      <!-- 折叠/展开按钮，始终垂直居中 -->
      <button
        v-if="!isManage"
        class="cursor-target absolute top-1/2 -translate-y-1/2 right-2 z-50 w-8 h-8 border border-gray-200 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition"
        @click="toggleCollapse"
        title="折叠/展开助手列表"
        style="transform: translateY(-50%)"
      >
        <svg v-if="!collapsed" width="20" height="20" viewBox="0 0 1024 1024" fill="none">
          <!-- 右箭头（折叠） -->
          <path
            d="M256 874.057143l76.8 76.8L768 512 332.8 73.142857 256 149.942857l358.4 362.057143z"
            fill="#333"
          />
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 1024 1024" fill="none">
          <!-- 左箭头（展开） -->
          <path
            d="M768 149.942857L691.2 73.142857 256 512l435.2 438.857143 76.8-76.8-358.4-362.057143z"
            fill="#333"
          />
        </svg>
      </button>
      <div
        class="p-4 flex flex-col min-h-[695px] h-full transition-all duration-500 ease-in-out"
        :style="
          isManage
            ? 'width:100%;min-width:0;max-width:none;'
            : collapsed
              ? 'width:2px;min-width:2px;max-width:2px;padding-left:0;padding-right:0'
              : 'width:100%;min-width:200px;max-width:260px;'
        "
      >
        <!-- 新建助手部分（仅管理模式显示） -->
        <div v-if="isManage" class="mb-4">
          <button
            class="cursor-target block w-full py-3 px-6 bg-[var(--theme-main)] hover:bg-[var(--theme-button-hover)] text-white rounded-xl text-base font-medium transition shadow"
            @click="onAddClick"
          >
            + 新建智能体
          </button>
          <CreateAssistantModal v-if="assistantStore.showAddModal" />
          <EditAssistantModal v-if="assistantStore.showEditModal" />
        </div>
        <!-- 删除助手二次确认弹窗（仅管理模式使用） -->
        <div
          v-if="isManage && assistantStore.showDeleteModal"
          class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
            <div class="font-bold text-lg mb-2">确认删除助手</div>
            <div class="mb-4">确定要删除该智能体吗？此操作不可恢复。</div>
            <div class="flex gap-4 justify-end">
              <button class="cursor-target px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" @click="cancelDelete">
                取消
              </button>
              <button
                class="cursor-target px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                @click="confirmDelete"
              >
                确定
              </button>
            </div>
          </div>
        </div>
        <!-- 对话助手列表部分 -->
        <div class="flex-1 overflow-y-auto pr-2 pb-4">
          <div v-if="isManage" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="item in assistantStore.assistants.filter((a) => a.uuid !== '')"
              :key="item.uuid"
              class="bg-white/50 cursor-target rounded-lg shadow"
            >
              <div
                :class="[
                  'rounded-lg px-4 py-3 cursor-pointer transition relative min-h-[96px] h-full',
                  assistantStore.selectedId === item.uuid ? 'bg-[var(--theme-select-button)]' : '',
                ]"
                @click="onSelect(item)"
              >
                <div class="absolute top-2 right-2 flex gap-1 z-10">
                  <button
                    class="text-gray-500 hover:text-blue-500 cursor-target transition"
                    style="background: none"
                    @click.stop="onEdit(item)"
                    title="编辑"
                  >
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                  <button
                    class="text-red-500 hover:text-red-700 cursor-target transition"
                    style="background: none"
                    @click.stop="onDelete(item.uuid)"
                    title="删除"
                  >
                    <svg
                      width="23"
                      height="23"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                      />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
                <div class="w-full">
                  <div class="font-bold text-base mb-1 truncate pr-8">
                    {{ item.name && item.name.trim() ? item.name : '未命名助手' }}
                  </div>
                  <div class="text-xs text-gray-500 line-clamp-2">
                    {{ item.desc && item.desc.trim() ? item.desc : '暂无简介' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template v-else>
          <!-- 默认智能体盒子 -->
          <div v-show="!collapsed" class="bg-white/50 rounded-lg shadow mb-4 cursor-target ">
            <div
              v-for="item in assistantStore.assistants.filter((a) => a.uuid === 'defult-uuid')"
              :key="item.uuid"
              class="mb-1"
            >
              <div
                :class="[
                  'rounded-lg px-4 py-3 cursor-pointer transition relative',
                  assistantStore.selectedId === item.uuid ? 'bg-[var(--theme-select-button)]' : '',
                ]"
                @click="onSelect(item)"
              >
                <div :class="['relative w-full', isManage ? 'pr-24' : '']">
                  <div v-if="isManage" class="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                      class="text-gray-500 hover:text-blue-500 cursor-target transition"
                      style="background: none"
                      @click.stop="onEdit(item)"
                      title="编辑"
                    >
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                    <button
                      class="p-1 text-blue-500 hover:text-blue-700 cursor-target transition"
                      @click.stop="onSetting(item)"
                      title="设置"
                    >
                      <svg
                        t="1753338826732"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="1540"
                        width="28"
                        height="28"
                      >
                        <path
                          d="M511.62 656.52c-79.84 0-144.64-64.8-144.64-144.64s64.8-144.64 144.64-144.64 144.64 64.8 144.64 144.64-64.8 144.64-144.64 144.64z m0-231.42c-47.82 0-86.78 38.96-86.78 86.78s38.96 86.78 86.78 86.78 86.78-38.96 86.78-86.78-38.96-86.78-86.78-86.78z"
                          fill="#1296db"
                          p-id="1541"
                        ></path>
                        <path
                          d="M635.42 904.9c-8.1 0-16.2-1.16-24.3-3.08-23.92-6.56-43.96-21.6-56.7-42.82l-4.62-7.72c-22.76-39.34-54-39.34-76.76 0l-4.24 7.32c-12.72 21.6-32.78 37.02-56.7 43.2-24.3 6.56-49.36 3.08-70.58-9.64l-66.34-38.18c-23.52-13.5-40.5-35.48-47.82-62.1-6.94-26.62-3.48-54 10.02-77.52 11.18-19.66 14.28-37.42 7.72-48.6s-23.14-17.74-45.9-17.74c-56.32 0-102.2-45.9-102.2-102.2v-67.88c0-56.32 45.9-102.2 102.2-102.2 22.76 0 39.34-6.56 45.9-17.74 6.56-11.18 3.86-28.92-7.72-48.6-13.5-23.52-16.98-51.3-10.02-77.52 6.94-26.62 23.92-48.6 47.82-62.1l66.72-38.18c43.58-25.84 101.06-10.8 127.28 33.56l4.62 7.72c22.76 39.34 54 39.34 76.76 0l4.24-7.32c26.22-44.74 83.7-59.78 127.66-33.56l66.34 38.18c23.52 13.5 40.5 35.48 47.82 62.1 6.94 26.62 3.48 54-10.02 77.52-11.18 19.68-14.28 37.42-7.72 48.6s23.14 17.74 45.9 17.74c56.32 0 102.2 45.9 102.2 102.2v67.88c0 56.32-45.9 102.2-102.2 102.2-22.76 0-39.34 6.56-45.9 17.74-6.56 11.18-3.86 28.92 7.72 48.6 13.5 23.52 17.36 51.3 10.02 77.52-6.94 26.62-23.92 48.6-47.82 62.1l-66.72 38.18c-14.64 8.1-30.46 12.34-46.66 12.34z m-123.8-142.7c34.32 0 66.34 21.6 88.32 59.78l4.24 7.32c4.62 8.1 12.34 13.88 21.6 16.2 9.26 2.32 18.52 1.16 26.22-3.48l66.72-38.56c10.02-5.78 17.74-15.42 20.82-27 3.08-11.58 1.54-23.52-4.24-33.56-21.98-37.8-24.68-76.76-7.72-106.46 16.98-29.7 52.06-46.66 96.04-46.66 24.68 0 44.36-19.68 44.36-44.36v-67.88c0-24.3-19.66-44.36-44.36-44.36-43.96 0-79.06-16.98-96.04-46.66-16.98-29.7-14.28-68.66 7.72-106.44 5.78-10.02 7.32-21.98 4.24-33.56-3.08-11.58-10.42-20.82-20.44-27L652.4 181.34c-16.58-10.02-38.56-4.24-48.6 12.72l-4.24 7.32c-21.98 38.18-54 59.78-88.32 59.78-34.32 0-66.34-21.6-88.32-59.78l-4.24-7.72c-9.64-16.2-31.24-21.98-47.82-12.34l-66.72 38.56c-10.02 5.78-17.74 15.42-20.82 27-3.08 11.58-1.54 23.52 4.24 33.56 21.98 37.8 24.68 76.76 7.72 106.44-16.98 29.7-52.06 46.66-96.04 46.66-24.68 0-44.36 19.66-44.36 44.36v67.88c0 24.3 19.68 44.36 44.36 44.36 43.96 0 79.06 16.98 96.04 46.66 16.96 29.7 14.28 68.66-7.72 106.44-5.78 10.02-7.32 21.98-4.24 33.56 3.08 11.58 10.42 20.82 20.44 27l66.72 38.18c8.1 5.02 17.74 6.18 26.62 3.86 9.26-2.32 16.98-8.48 21.98-16.58l4.24-7.32c21.96-37.76 53.96-59.74 88.3-59.74z"
                          fill="#1296db"
                          p-id="1542"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="text-red-500 hover:text-red-700 cursor-target transition"
                      style="background: none"
                      @click.stop="onDelete(item.uuid)"
                      title="删除"
                    >
                      <svg
                        width="23"
                        height="23"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                        />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                  <div class="w-full">
                    <div class="font-bold text-base mb-1">{{ item.name }}</div>
                    <div class="text-xs text-gray-500">{{ item.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 新建智能体每个单独盒子 -->
          <template
            v-for="item in assistantStore.assistants.filter((a) => a.uuid !== '')"
            :key="item.uuid"
          >
            <div v-show="!collapsed" class="bg-white/50 cursor-target rounded-lg shadow mb-4">
              <div
                :class="[
                  'rounded-lg px-4 py-3 cursor-pointer transition relative min-h-[80px]',
                  assistantStore.selectedId === item.uuid ? 'bg-[var(--theme-select-button)]' : '',
                ]"
                @click="onSelect(item)"
              >
                <div :class="['relative w-full', isManage ? 'pr-20' : '']">
                  <div v-if="isManage" class="absolute -top-1 -right-4 flex gap-1 z-10 bg-white/80 rounded-bl-lg pl-1 pb-1">
                    <button
                      class="text-gray-500 hover:text-blue-500 cursor-target transition p-1"
                      @click.stop="onEdit(item)"
                      title="编辑"
                    >
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                    <button
                      class="p-1 text-blue-500 hover:text-blue-700 cursor-target transition"
                      @click.stop="onSetting(item)"
                      title="设置"
                    >
                      <svg
                        t="1753338826732"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="1540"
                        width="28"
                        height="28"
                      >
                        <path
                          d="M511.62 656.52c-79.84 0-144.64-64.8-144.64-144.64s64.8-144.64 144.64-144.64 144.64 64.8 144.64 144.64-64.8 144.64-144.64 144.64z m0-231.42c-47.82 0-86.78 38.96-86.78 86.78s38.96 86.78 86.78 86.78 86.78-38.96 86.78-86.78-38.96-86.78-86.78-86.78z"
                          fill="#1296db"
                          p-id="1541"
                        ></path>
                        <path
                          d="M635.42 904.9c-8.1 0-16.2-1.16-24.3-3.08-23.92-6.56-43.96-21.6-56.7-42.82l-4.62-7.72c-22.76-39.34-54-39.34-76.76 0l-4.24 7.32c-12.72 21.6-32.78 37.02-56.7 43.2-24.3 6.56-49.36 3.08-70.58-9.64l-66.34-38.18c-23.52-13.5-40.5-35.48-47.82-62.1-6.94-26.62-3.48-54 10.02-77.52 11.18-19.66 14.28-37.42 7.72-48.6s-23.14-17.74-45.9-17.74c-56.32 0-102.2-45.9-102.2-102.2v-67.88c0-56.32 45.9-102.2 102.2-102.2 22.76 0 39.34-6.56 45.9-17.74 6.56-11.18 3.86-28.92-7.72-48.6-13.5-23.52-16.98-51.3-10.02-77.52 6.94-26.62 23.92-48.6 47.82-62.1l66.72-38.18c43.58-25.84 101.06-10.8 127.28 33.56l4.62 7.72c22.76 39.34 54 39.34 76.76 0l4.24-7.32c26.22-44.74 83.7-59.78 127.66-33.56l66.34 38.18c23.52 13.5 40.5 35.48 47.82 62.1 6.94 26.62 3.48 54-10.02 77.52-11.18 19.68-14.28 37.42-7.72 48.6s23.14 17.74 45.9 17.74c56.32 0 102.2 45.9 102.2 102.2v67.88c0 56.32-45.9 102.2-102.2 102.2-22.76 0-39.34 6.56-45.9 17.74-6.56 11.18-3.86 28.92 7.72 48.6 13.5 23.52 17.36 51.3 10.02 77.52-6.94 26.62-23.92 48.6-47.82 62.1l-66.72 38.18c-14.64 8.1-30.46 12.34-46.66 12.34z m-123.8-142.7c34.32 0 66.34 21.6 88.32 59.78l4.24 7.32c4.62 8.1 12.34 13.88 21.6 16.2 9.26 2.32 18.52 1.16 26.22-3.48l66.72-38.56c10.02-5.78 17.74-15.42 20.82-27 3.08-11.58 1.54-23.52-4.24-33.56-21.98-37.8-24.68-76.76-7.72-106.46 16.98-29.7 52.06-46.66 96.04-46.66 24.68 0 44.36-19.68 44.36-44.36v-67.88c0-24.3-19.66-44.36-44.36-44.36-43.96 0-79.06-16.98-96.04-46.66-16.98-29.7-14.28-68.66 7.72-106.44 5.78-10.02 7.32-21.98 4.24-33.56-3.08-11.58-10.42-20.82-20.44-27L652.4 181.34c-16.58-10.02-38.56-4.24-48.6 12.72l-4.24 7.32c-21.98 38.18-54 59.78-88.32 59.78-34.32 0-66.34-21.6-88.32-59.78l-4.24-7.72c-9.64-16.2-31.24-21.98-47.82-12.34l-66.72 38.56c-10.02 5.78-17.74 15.42-20.82 27-3.08 11.58-1.54 23.52 4.24 33.56 21.98 37.8 24.68 76.76 7.72 106.44-16.98 29.7-52.06 46.66-96.04 46.66-24.68 0-44.36 19.66-44.36 44.36v67.88c0 24.3 19.68 44.36 44.36 44.36 43.96 0 79.06 16.98 96.04 46.66 16.96 29.7 14.28 68.66-7.72 106.44-5.78 10.02-7.32 21.98-4.24 33.56 3.08 11.58 10.42 20.82 20.44 27l66.72 38.18c8.1 5.02 17.74 6.18 26.62 3.86 9.26-2.32 16.98-8.48 21.98-16.58l4.24-7.32c21.96-37.76 53.96-59.74 88.3-59.74z"
                          fill="#1296db"
                          p-id="1542"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="text-red-500 hover:text-red-700 cursor-target transition p-1"
                      @click.stop="onDelete(item.uuid)"
                      title="删除"
                    >
                      <svg
                        width="23"
                        height="23"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                        />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                  <div class="w-full pb-1">
                    <div class="font-bold text-base mb-1 truncate pr-2">
                      {{ item.name && item.name.trim() ? item.name : '未命名助手' }}
                    </div>
                    <div class="text-xs text-gray-500 line-clamp-2">
                      {{ item.desc && item.desc.trim() ? item.desc : '暂无简介' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CreateAssistantModal from './CreateAssistantModal.vue'
import EditAssistantModal from './EditAssistantModal.vue'
import http from '@/api/http'
import { useAssistantStore } from '@/stores/assistant'

const props = defineProps<{
  mode?: 'manage' | 'select'
}>()

const isManage = computed(() => props.mode !== 'select')

const collapsed = ref(false)
const minWidth = 1300

function handleResize() {
  collapsed.value = window.innerWidth < minWidth
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

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

const assistantStore = useAssistantStore()
const router = useRouter()

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  http
    .getAISettings(1, 20)
    .then((res) => {
      if (Array.isArray(res)) {
        const filteredData = res
          .filter((a) => a.uuid !== 'default-uuid')
          .map((a) => ({
            uuid: a.uuid,
            name: a.name,
            desc: a.desc,
            personality: a.personality || '',
            knowledge: a.knowledge || [],
            history: a.history || [],
          }))
        assistantStore.setAssistants([
          {
            uuid: 'default-uuid',
            name: '默认智能体',
            desc: '这是一个用于基础问答和测试的默认智能体。',
            personality: '你是一个温和、耐心且专业的智能知识助手，会结合已接入的知识库为用户提供准确、清晰的回答。',
            knowledge: [],
            history: [],
          },
          ...filteredData,
        ])
      }
    })
    .catch((err) => {
      console.error('请求失败:', err)
    })
  if (!assistantStore.selectedId && assistantStore.assistants.length > 0) {
    onSelect(assistantStore.assistants[0])
  }
})

function onAddClick() {
  assistantStore.newAssistant = {
    uuid: '',
    name: '',
    personality: '',
    knowledge: [],
    desc: '',
    history: [],
  }
  assistantStore.setShowAddModal(true)
  http.getAISettings(1, 20).then((res) => {
    console.log(res)
  })
}

function onEdit(item) {
  if (item.uuid === 'default-uuid') {
    alert('默认智能体不能编辑')
    return
  }
  assistantStore.setEditingAssistant({ ...item })
  assistantStore.setShowEditModal(true)
}

function onSetting(item) {
  if (item.uuid === 'default-uuid') {
    alert('默认智能体不能设置')
    return
  }
  assistantStore.setEditingAssistant({ ...item })
  assistantStore.setShowEditKnowledge(true)
}

function onDelete(uuid) {
  assistantStore.setToDeleteId(uuid)
  assistantStore.setShowDeleteModal(true)
}

function confirmDelete() {
  const uuid = assistantStore.toDeleteId
  if (uuid === 'default-uuid') {
    alert('默认智能体不能删除')
    return
  }
  http
    .deleteAISetting(uuid)
    .then(() => {
      assistantStore.setAssistants(assistantStore.assistants.filter((a) => a.uuid !== uuid))
      assistantStore.setShowDeleteModal(false)
      if (assistantStore.selectedId === uuid && assistantStore.assistants.length > 0) {
        assistantStore.setSelectedId(assistantStore.assistants[0].uuid)
        onSelect(assistantStore.assistants[0])
      }
      assistantStore.setToDeleteId(null)
      console.log('删除成功')
    })
    .catch((error) => {
      console.error('删除失败:', error)
    })
}

function cancelDelete() {
  assistantStore.setShowDeleteModal(false)
  assistantStore.setToDeleteId(null)
}

function onSelect(item) {
  assistantStore.setSelectedId(item.uuid)
  router.push({ path: `/AI/chat/${encodeURIComponent(item.uuid)}` })
}

defineOptions({
  name: 'AssistantList',
})
</script>
