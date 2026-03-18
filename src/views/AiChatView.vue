<script setup lang="ts">
import AssistantList from '@/components/ai_chat/AssistantList.vue'
import EditKnowledgeModal from '@/components/ai_chat/EditKnowledgeModal.vue'
import ChatAside from '@/components/ai_chat/ChatAside.vue'
import Orb from "@/color/Orb.vue";
</script>

<template>
  <div class="flex flex-1 min-h-0">
    <!-- 左侧：对话历史 -->
    <ChatAside />
    <!-- 中间：对话面板 -->
    <div class="flex flex-1 min-h-0 transition-all duration-300 bg-[var(--theme-body)]">
      <main class="flex-1 p-4 md:p-6 min-h-[200px] box-border theme-bg w-full min-w-0">
        <router-view />
      </main>
    </div>
    <!-- 右侧：仅选择智能体 -->
    <aside
      class="shrink-0 grow-0 theme-aside min-h-0 border-l border-gray-200 pt-0 relative flex flex-col transition-all duration-300"
    >
      <AssistantList mode="select" />
      <div class="flex-1" />
    </aside>
  </div>
</template>
