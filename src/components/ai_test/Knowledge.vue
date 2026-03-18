<script setup>
import '@/assets/theme.css'
import { computed,onMounted } from 'vue'
import { useKnowledgeStore } from '@/stores/konwledge'
import { useKonwledgeTestStore } from '@/stores/konwledgeTest'
import http from "@/api/http.js";
import {message} from "ant-design-vue";

const knowledgeStore = useKnowledgeStore()
const konwledgeTestStore = useKonwledgeTestStore()
const selectedKnowledgeUuids = computed({
  get: () => konwledgeTestStore.selectedKnowledgeUuids,
  set: (v) => konwledgeTestStore.setSelectedKnowledgeUuids(v),
})
onMounted(async () => {
  await http
      .listNamespace(1, 20)
      .then(async (res) => {
        const filteredData = res
            .filter((a) => a.uuid !== '')
            .map((item) => ({
              uuid: item.uuid,
              name: item.name,
              description: item.description || '',
            }))
        await knowledgeStore.setKnowledgeList(filteredData)
      })
      .catch((err) => {
        console.error('加载知识库列表失败:', err)
        message.error('加载知识库列表失败，请稍后重试')
      })
})
const knowledgeOptions = computed(() =>
  knowledgeStore.knowledges.map((k) => ({ label: k.name, value: k.uuid })),
)
</script>
<template>
  <div
    class="bg-[var(--theme-body)] shadow-[0_4px_24px_0_rgba(96,165,250,0.08),0_1.5px_6px_0_rgba(59,130,246,0.06)] border-[1.5px] w-full h-full max-w-none min-h-0 p-8 box-border flex flex-col rounded-2xl justify-start border-gray-200"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="text-lg font-extrabold m-2 text-gray-800 tracking-wide">
        <svg
            class="inline-block bg-gradient-to-r from-[var(--theme-main)] to-emerald-400 bg-clip-text"
            width="20"
            height="20"
            fill="#60a5fa"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
          </svg>
        选择知识库
      </div>
      <a-select
      :disabled="konwledgeTestStore.isWebSearch"
      :title="konwledgeTestStore.isWebSearch ? '联网搜索模式下禁用知识库选择' : ''"
        v-model:value="selectedKnowledgeUuids"
        mode="multiple"
        style="min-width: 380px; max-width: 500p  x"
        placeholder="选择知识库(可多选)"
        :options="knowledgeOptions"
        class="ml-4 cursor-target"
      ></a-select>
    </div>
    <div class="mt-6 p-8 bg-white/60 rounded-2xl shadow-[0_2px_12px_0_rgba(96,165,250,0.08)] border border-blue-100 flex flex-col items-start">
      <div class="text-xl font-bold text-[var(--theme-main)] mb-2 flex items-center">
        <svg class="icon mr-2" viewBox="0 0 1024 1024" width="28" height="28" fill="var(--theme-main)">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.2 0-372-166.8-372-372S306.8 140 512 140s372 166.8 372 372-166.8 372-372 372z"/>
        </svg>
        智能知识库简介
      </div>
      <div class="text-base text-gray-700 leading-relaxed mb-2">
        智能知识库是智能问答和知识管理的核心。您可以在此选择知识库，支持多知识库并行问答，提升智能助手的专业性和准确率。
      </div>
      <ul class="list-disc pl-6 text-gray-600 text-sm space-y-1">
        <li>支持多知识库选择，问答优先匹配所选知识库内容</li>
        <li>知识库内容可持续扩展，适配企业多场景需求</li>
        <li>安全隔离，保障企业数据隐私</li>
        <li>可视化管理，便捷维护与检索</li>
      </ul>
    </div>
  </div>
</template>
