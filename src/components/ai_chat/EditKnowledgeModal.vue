<!--新建后编辑人设-->
<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-xl p-4 md:p-6 overflow-auto">
      <div class="text-base font-bold mb-4 flex items-center justify-between">
        <span>人设</span>
        <button class="text-gray-400 cursor-target hover:text-red-500" @click="onClose">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="4" x2="14" y2="14" />
            <line x1="14" y1="4" x2="4" y2="14" />
          </svg>
        </button>
      </div>
      <textarea
        v-model="localAssistant.personality"
        class="w-full border cursor-target border-gray-200 rounded p-3 mb-6 min-h-[80px] resize-none"
        placeholder="请输入人设描述"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import http from '../../api/http'
import { UpdateAISetting } from '@/types/request'
import { useAssistantStore } from '@/stores/assistant'
import { useKnowledgeStore } from '@/stores/konwledge'

const assistantStore = useAssistantStore()
const knowledgeStore = useKnowledgeStore()

const visible = ref(false)
watch(
  () => assistantStore.showEditKnowledge,
  (v) => (visible.value = v),
  { immediate: true },
)

// knowledge结构调整为 {uuid, name}
const localAssistant = ref({
  uuid: '',
  name: '',
  desc: '',
  personality: '',
  knowledge: [] as { uuid: string; name: string }[],
})

// 自动填充表单，desc=简介，personality=人设
watch(
  () => assistantStore.editingAssistant,
  (val) => {
    if (val) {
      localAssistant.value = {
        uuid: val.uuid,
        name: val.name,
        desc: val.desc || '',
        personality: val.personality || '',
        knowledge: Array.isArray(val.knowledge)
          ? val.knowledge.map((k) =>
              typeof k === 'string'
                ? {
                    uuid: k,
                    name: k,
                  }
                : k,
            )
          : [],
      }
    } else {
      localAssistant.value = { uuid: '', name: '', desc: '', personality: '', knowledge: [] }
    }
  },
  { immediate: true },
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
  const updateData: UpdateAISetting = {
    uuid: localAssistant.value.uuid,
    name: localAssistant.value.name,
    desc: localAssistant.value.desc,
    personality: localAssistant.value.personality,
    knowledge: localAssistant.value.knowledge,
  }
  http
    .updateAISetting(updateData)
    .then((res) => {
      // 更新 pinia
      const idx = assistantStore.assistants.findIndex((a) => a.uuid === localAssistant.value.uuid)
      if (idx !== -1) {
        assistantStore.assistants[idx] = {
          ...assistantStore.assistants[idx],
          ...localAssistant.value,
        }
      }
      assistantStore.setShowEditKnowledge(false)
      assistantStore.setEditingAssistant(null)
    })
    .catch((err) => {
      console.error('请求失败:', err)
    })
}

function onClose() {
  assistantStore.setShowEditKnowledge(false)
  assistantStore.setEditingAssistant(null)
}
</script>
