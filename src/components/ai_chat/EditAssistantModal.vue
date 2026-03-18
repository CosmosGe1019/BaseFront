<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import http from '@/api/http'

const assistantStore = useAssistantStore()
const emit = defineEmits(['close', 'save'])
const localAssistant = ref({ ...assistantStore.editingAssistant })
// 每次弹窗打开都刷新数据，防止上次编辑残留
watch(
  () => assistantStore.editingAssistant,
  (val) => {
    if (val) localAssistant.value = { ...val }
  },
  { immediate: true },
)

function onCancel() {
  emit('close')
  assistantStore.setShowEditModal(false)
  assistantStore.setEditingAssistant(null)
}

function onSave() {
  // desc 和 personality 分离，分别传递
  const updatedAssistant = {
    uuid: localAssistant.value.uuid,
    name: localAssistant.value.name,
    desc: localAssistant.value.desc || '',
    personality: localAssistant.value.personality || '',
  }
  if (updatedAssistant.uuid === 'default-uuid') {
    alert('默认机器人不能编辑')
    return
  }
  http
    .updateAISetting(updatedAssistant)
    .then(() => {
      // 实时更新 pinia
      const idx = assistantStore.assistants.findIndex((a) => a.uuid === localAssistant.value.uuid)
      if (idx !== -1) {
        for (const key in updatedAssistant) {
          assistantStore.assistants[idx][key] = updatedAssistant[key]
        }
      }
      emit('save', { ...updatedAssistant })
      emit('close')
      assistantStore.setShowEditModal(false)
      assistantStore.setEditingAssistant(null)
    })
    .catch((err) => {
      alert('编辑失败')
      console.error('编辑助手失败:', err)
    })
}
</script>
<template>
  <div class="fixed inset-0 z-[9999] bg-black bg-opacity-20 flex items-center justify-center">
    <div
      class="bg-white rounded-xl shadow-lg p-4 md:p-8 w-full max-w-md md:max-w-xl relative overflow-auto"
    >
      <button class="absolute top-4 right-4 cursor-target text-gray-400 hover:text-gray-600" @click="onCancel">
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
      <div class="text-xl font-bold mb-6">编辑机器人信息</div>
      <div class="mb-6">
        <label class="block font-semibold mb-2">机器人名称</label>
        <input
          v-model="localAssistant.name"
          class="w-full border-2 border-blue-200 rounded-lg cursor-target p-4 focus:outline-none focus:border-blue-400 text-gray-700 bg-white"
          placeholder="请输入机器人名称"
        />
      </div>
      <div class="mb-6">
        <label class="block font-semibold mb-2">简介</label>
        <textarea
          v-model="localAssistant.desc"
          class="w-full min-h-[80px] border-2 border-blue-200 cursor-target rounded-lg p-4 focus:outline-none focus:border-blue-400 resize-none text-gray-700 bg-white"
          placeholder="请输入机器人简介"
        ></textarea>
      </div>
      <div class="flex justify-end mt-8 gap-4">
        <button
          type="button"
          class="px-4 py-2 bg-gray-200 rounded cursor-target hover:bg-gray-300 transition"
          @click="onCancel"
        >
          取消
        </button>
        <button
          type="button"
          class="px-6 py-2 bg-blue-500 text-white cursor-target rounded hover:bg-blue-600 transition"
          @click="onSave"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>
