<script setup lang="ts">
import '@/assets/theme.css'
import { useTempAiSetting } from '../../stores/globalStore'
import { onMounted, ref, watch } from 'vue'
import Knowledge from './Knowledge.vue'

const tempAiSetting = useTempAiSetting()
const localText = ref(tempAiSetting.input)

const updateTempAiSetting = () => {
  tempAiSetting.setValue(localText.value)
  console.log(tempAiSetting.getValue())
}

onMounted(() => {
  localText.value = tempAiSetting.input
})

watch(
  () => tempAiSetting.input,
  (newValue) => {
    localText.value = newValue
  },
)
</script>

<template>
  <div
    class="bg-[var(--theme-aside)] from-[#f0f9ff] to-[#e0e7ef] p-8 min-h-[87vh] w-full flex flex-col gap-6 rounded-2xl"
  >
    <div
      class="bg-[var(--theme-body)] rounded-2xl shadow-[0_4px_24px_0_rgba(96,165,250,0.08),0_1.5px_6px_0_rgba(59,130,246,0.06)] border-[1.5px] border-[#e0e7ef] p-10 w-full max-w-4xl min-w-[320px] min-h-[320px] mx-auto flex flex-col justify-start box-border transition-all"
    >
      <div class="flex justify-between items-center border-b border-blue-100 pb-2 mb-3">
        <span class="text-lg font-bold flex items-center gap-2">
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
          人设
        </span>
        <img src="@/assets/images/pen.png" alt="pen" class="w-6 h-6 opacity-70" />
      </div>
      <div class="pt-2">
        <textarea
          id="content"
          class="w-full min-h-[180px] cursor-target p-5 bg-white/50 rounded-lg border-[1.5px] border-[#c7d2fe] bg-[#f9fafb] text-[1.1rem] text-[#2563eb] shadow-[0_1px_4px_0_rgba(96,165,250,0.06)] transition-all resize-vertical focus:outline-none focus:border-[#60a5fa] focus:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]"
          placeholder="请输入您对ai的人设..."
          v-model.lazy="localText"
          @blur="updateTempAiSetting"
        ></textarea>
      </div>
    </div>
    <Knowledge />
  </div>
</template>
