<template>
  <div class="min-h-0 flex flex-1  justify-center bg-[var(--theme-body)]">
    <div
      class="w-full max-w-xl bg-white/60 mt-20 mb-[20vh] dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800"
    >
      <h2
        class="text-2xl font-extrabold mb-6 bg-gradient-to-r from-[var(--theme-main)] to-emerald-400 bg-clip-text text-transparent tracking-tight flex items-center gap-2"
      >
        <svg class="inline-block" width="28" height="28" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 17.93V20a1 1 0 0 1-2 0v-.07A8.06 8.06 0 0 1 4.07 13H4a1 1 0 0 1 0-2h.07A8.06 8.06 0 0 1 11 4.07V4a1 1 0 0 1 2 0v.07A8.06 8.06 0 0 1 19.93 11H20a1 1 0 0 1 0 2h-.07A8.06 8.06 0 0 1 13 19.93Z"
          />
        </svg>
        系统设置
      </h2>
      <div class="border-b border-gray-300 dark:border-gray-700 mb-7"></div>
      <!-- 通用设置内容区，主题切换 -->
      <div class="mb-8">
        <label
          class="block text-lg font-semibold mb-3 bg-gradient-to-r from-[var(--theme-main)] to-emerald-400 bg-clip-text text-transparent"
          >主题</label
        >
        <div class="flex flex-wrap gap-3 mt-2">
          <span
            v-for="item in themeOptions"
            :key="item.value"
            @click="selectTheme(item.value)"
            :class="[
              'cursor-pointer px-4 py-2 cursor-target rounded-xl flex items-center gap-3 border transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5',
              theme === item.value
                ? 'border-purple-500 bg-white/50 dark:bg-purple-900/30 scale-105 ring-2 ring-purple-200'
                : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800',
            ]"
            style="min-width: 120px"
          >
            <span
              :class="item.color"
              class="w-5 h-5 rounded-full inline-block shadow-md transition-all duration-200"
              :style="theme === item.value ? 'box-shadow:0 0 0 4px #c4b5fd55' : ''"
            ></span>
            <span class="text-base font-medium">{{ item.label }}</span>
            <svg
              v-if="theme === item.value"
              class="ml-1 text-purple-400"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M9 16.2 4.8 12l1.4-1.4 2.8 2.8 5.6-5.6L16.2 9z" />
            </svg>
          </span>
        </div>
        <div class="flex flex-col gap-4 mt-10">
          <button
            class="w-full flex cursor-target items-center justify-between px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-900/40 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all shadow group"
            @click="goPrivacy"
          >
            <span class="text-lg text-black">隐私政策</span>
            <svg
              class="opacity-60 group-hover:opacity-100 transition"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M13.293 5.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L16.586 12H6a1 1 0 0 1 0-2h10.586l-3.293-3.293a1 1 0 0 1 0-1.414z"
              />
            </svg>
          </button>
          <button
            class="w-full flex cursor-target items-center justify-between px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-900/40 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all shadow group"
            @click="goTerms"
          >
            <span class="text-lg text-black">用户协议</span>
            <svg
              class="opacity-60 group-hover:opacity-100 transition"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M13.293 5.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L16.586 12H6a1 1 0 0 1 0-2h10.586l-3.293-3.293a1 1 0 0 1 0-1.414z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()

function goPrivacy() {
  router.push('/privacy')
}

function goTerms() {
  router.push('/terms')
}

const themeOptions = [
  { value: 'default', label: '蓝色主题', color: 'bg-blue-400' },
  { value: 'pink', label: '粉色主题', color: 'bg-pink-400' },
  { value: 'brown', label: '棕色主题', color: 'bg-amber-700' },
  {
    value: 'gradient-blue-pink',
    label: '蓝粉渐变',
    color: 'bg-gradient-to-r from-blue-400 to-pink-400',
  },
  { value: 'new-theme', label: '绿色主题', color: 'bg-green-400' },
  { value: 'cyber-dark', label: '赛博暗色', color: 'bg-gradient-to-r from-cyan-400 via-fuchsia-600 to-black' },
]
const theme = ref(localStorage.getItem('theme') || 'default')

function changeTheme() {
  applyTheme(theme.value)
}

function selectTheme(val: string) {
  theme.value = val
  applyTheme(val)
}

function applyTheme(val: string) {
  if ([
    'default', 'pink', 'brown', 'gradient-blue-pink', 'new-theme', 'cyber-dark'
  ].includes(val)) {
    document.body.setAttribute('data-theme', val)
    localStorage.setItem('theme', val)
    document.documentElement.classList.remove('dark')
  } else if (val === 'light') {
    document.body.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else if (val === 'dark') {
    document.body.removeAttribute('data-theme')
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.body.removeAttribute('data-theme')
    localStorage.setItem('theme', 'system')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

onMounted(() => {
  applyTheme(theme.value)
})
</script>

<style scoped></style>
