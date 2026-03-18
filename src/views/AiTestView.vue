<script setup lang="ts">
import AssistantList from '@/components/ai_chat/AssistantList.vue'
</script>

<template>
  <div class="h-full flex flex-col bg-[var(--theme-body)] overflow-hidden">
    <main class="flex-1 min-h-0 flex justify-center p-4 overflow-hidden">
      <div class="w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-6 flex flex-col min-h-0 overflow-hidden">
        <header class="flex items-center justify-between mb-4 shrink-0">
          <div class="flex items-center gap-3">
            <svg
              t="1753337769292"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
            >
              <path
                d="M827.4 86.3H164.8c-55.5 0-100.6 45.1-100.6 100.6v628.8c0 55.5 45.1 100.6 100.6 100.6h662.6c55.5 0 100.6-45.1 100.6-100.7V186.9c0-55.5-45.1-100.6-100.6-100.6z m0 769.5H164.8c-22.1 0-40.2-18-40.2-40.2V186.9c0-22.1 18-40.2 40.2-40.2h662.6c22.1 0 40.2 18 40.2 40.2v95.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.7H716.7c-16.7 0-30.2 13.5-30.2 30.2S700 705 716.7 705h150.9v110.6c0 22.1-18 40.2-40.2 40.2z"
                fill="#1296db"
              ></path>
              <path
                d="M506.5 498.4c28.1-25.9 45.7-63 45.7-104.2 0-78.2-63.7-141.8-141.9-141.8S268.5 316 268.5 394.2c0 41.1 17.6 78.2 45.6 104.1-70.8 35.4-119.5 108.6-119.5 193 0 16.7 13.5 30.2 30.2 30.2S255 708 255 691.3c0-85.7 69.7-155.3 155.3-155.3s155.3 69.7 155.3 155.3c0 16.7 13.5 30.2 30.2 30.2S626 708 626 691.3c0-84.3-48.8-157.5-119.5-192.9z m-96.2-185.7c45 0 81.5 36.6 81.5 81.5s-36.6 81.5-81.5 81.5-81.5-36.6-81.5-81.5 36.6-81.5 81.5-81.5z"
                fill="#1296db"
              ></path>
            </svg>
            <div>
              <div class="text-2xl font-bold bg-gradient-to-r from-[var(--theme-main)] to-emerald-300 bg-clip-text text-transparent">
                智能体人设管理
              </div>
              <div class="text-sm text-gray-500 mt-1">
                为不同业务场景创建和维护智能体的人设、简介和绑定知识库。
              </div>
            </div>
          </div>
        </header>
        <div class="mt-2 border-t border-gray-200 pt-4 flex-1 min-h-0 overflow-y-auto">
          <AssistantList />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
