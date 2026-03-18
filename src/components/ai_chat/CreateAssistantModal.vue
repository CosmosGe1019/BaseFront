<template>
  <div class="fixed inset-0 z-[9999] bg-black bg-opacity-20 flex items-center justify-center">
    <div
      class="bg-white rounded-xl shadow-lg p-4 md:p-8 w-full max-w-md md:max-w-xl relative overflow-auto"
    >
      <button class="absolute top-4 right-4 cursor-target text-gray-400 hover:text-gray-600" @click="onClose">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div class="text-xl font-bold mb-6">新建智能体人设</div>
      <div class="mb-6">
        <label class="block font-semibold mb-2">智能体名称</label>
        <input
          v-model="localAssistant.name"
          class="w-full cursor-target border-2 border-blue-200 rounded-lg p-4 focus:outline-none focus:border-blue-400 text-gray-700 bg-white"
          placeholder="请输入机器人名称"
        />
      </div>
      <div class="mb-2">
        <label class="block font-semibold mb-2">智能体简介</label>
        <textarea
          v-model="localAssistant.desc"
          class="w-full min-h-[88px] border-2 cursor-target border-blue-200 rounded-lg p-4 focus:outline-none focus:border-blue-400 resize-none text-gray-700 bg-white"
          placeholder="请输入机器人简介"
        ></textarea>
      </div>
      <div class="flex justify-end mt-8 gap-4">
        <button
          type="button"
          class="px-4 py-2 bg-gray-200 cursor-target rounded hover:bg-gray-300 transition"
          @click="onClose"
        >
          取消
        </button>
        <button
          type="button"
          class="px-6 py-2 bg-blue-500 cursor-target text-white rounded hover:bg-blue-600 transition"
          @click="onSave"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import { useKnowledgeStore } from '@/stores/konwledge'
import http from '@/api/http'

const assistantStore = useAssistantStore()
const knowledgeStore = useKnowledgeStore()
const localAssistant = ref({
  uuid: 'default-uuid',
  name: '',
  personality: '',
  desc: '',
  knowledge: [] as { uuid: string; name: string }[],
})
// 新建弹窗每次打开都重置表单
watch(
  () => assistantStore.showAddModal,
  (val) => {
    if (val) {
      Object.assign(localAssistant.value, {
        uuid: 'default-uuid',
        name: '',
        personality: '',
        desc: '',
        knowledge: [],
      })
    }
  },
)

// 知识库多选弹窗
const showKnowledgeModal = ref(false)
const selectedKnowledgeUuids = ref<string[]>([])

function addKnowledge() {
  showKnowledgeModal.value = true
  selectedKnowledgeUuids.value = localAssistant.value.knowledge.map((k) => k.uuid)
}

function handleKnowledgeOk() {
  localAssistant.value.knowledge = selectedKnowledgeUuids.value
    .map((uuid) => {
      const k = knowledgeStore.knowledges.find((item) => item.uuid === uuid)
      return k ? { uuid: k.uuid, name: k.name } : null
    })
    .filter(Boolean) as { uuid: string; name: string }[]
  showKnowledgeModal.value = false
}

function handleKnowledgeCancel() {
  showKnowledgeModal.value = false
}

function onSave() {
  const newData = { ...localAssistant.value }
  if (!newData.name) {
    alert('请输入助手名称')
    return
  }
  const newAssistant = {
    name: newData.name,
    personality: newData.personality || '',
    desc: newData.desc || '',
    knowledge: newData.knowledge,
  }
  http
    .createAISetting(newAssistant)
    .then((res) => {
      console.log('创建助手成功:', res)
      newData.uuid = res.uuid
      assistantStore.assistants.push({ ...newData })
      Object.assign(assistantStore.newAssistant, {
        uuid: '',
        name: '',
        personality: '',
        desc: '',
        knowledge: [],
        history: [],
      })
      assistantStore.setShowAddModal(false)
    })
    .catch((err) => {
      console.error('创建助手失败:', err)
      alert('创建助手失败，请稍后重试')
    })
}

function onClose() {
  assistantStore.setShowAddModal(false)
}
</script>
