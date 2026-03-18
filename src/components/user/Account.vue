<template>
  <div class="relative h-full flex-1 min-h-0 flex justify-center bg-[var(--theme-body)] overflow-y-auto">
    <div
      class="z-10 w-full max-w-6xl mx-auto mt-10 mb-[10vh] rounded-2xl shadow-xl border border-gray-200 bg-white/60 backdrop-blur-xl p-8 md:p-12"
    >
      <div class="flex flex-col md:flex-row gap-12 md:gap-10">
        <!-- 左栏：账号管理 -->
        <div class="w-full flex flex-col md:flex-1">
          <!-- 标题 -->
          <div class="flex items-center gap-3 mb-8 border-b border-gray-200/50 pb-4">
            <svg
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
            >
              <path
                d="M827.4 86.3H164.8c-55.5 0-100.6 45.1-100.6 100.6v628.8c0 55.5 45.1 100.6 100.6 100.6h662.6c55.5 0 100.6-45.1 100.6-100.7V186.9c0-55.5-45.1-100.6-100.6-100.6z m0 769.5H164.8c-22.1 0-40.2-18-40.2-40.2V186.9c0-22.1 18-40.2 40.2-40.2h662.6c22.1 0 40.2 18 40.2 40.2v95.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.7H716.7c-16.7 0-30.2 13.5-30.2 30.2S700 705 716.7 705h150.9v110.6c0 22.1-18 40.2-40.2 40.2z"
                fill="var(--theme-main)"
              ></path>
              <path
                d="M506.5 498.4c28.1-25.9 45.7-63 45.7-104.2 0-78.2-63.7-141.8-141.9-141.8S268.5 316 268.5 394.2c0 41.1 17.6 78.2 45.6 104.1-70.8 35.4-119.5 108.6-119.5 193 0 16.7 13.5 30.2 30.2 30.2S255 708 255 691.3c0-85.7 69.7-155.3 155.3-155.3s155.3 69.7 155.3 155.3c0 16.7 13.5 30.2 30.2 30.2S626 708 626 691.3c0-84.3-48.8-157.5-119.5-192.9z m-96.2-185.7c45 0 81.5 36.6 81.5 81.5s-36.6 81.5-81.5 81.5-81.5-36.6-81.5-81.5 36.6-81.5 81.5-81.5z"
                fill="var(--theme-main)"
              ></path>
            </svg>
            <span class="text-2xl font-bold bg-gradient-to-r from-[var(--theme-main)] to-emerald-300 bg-clip-text text-transparent tracking-tight">账号管理</span>
          </div>
          
          <!-- 内容 -->
          <div class="flex flex-col gap-7 pl-1 flex-1">
            <div class="group">
              <label class="block text-gray-500 text-base mb-1 group-hover:text-[var(--theme-main)] transition-colors">用户名</label>
              <div class="text-gray-900 text-xl font-semibold border-b border-gray-200 pb-2 flex items-center">
                 {{ user.name || '未登录' }}
              </div>
            </div>
            <div class="group">
              <label class="block text-gray-500 text-base mb-1 group-hover:text-[var(--theme-main)] transition-colors">用户ID</label>
              <div class="text-gray-900 text-xl font-mono font-semibold border-b border-gray-200 pb-2 break-all">
                {{ user.uuid || '-' }}
              </div>
            </div>
            <div class="group">
              <label class="block text-gray-500 text-base mb-1 group-hover:text-[var(--theme-main)] transition-colors">邮箱</label>
              <div class="text-gray-900 text-xl font-semibold border-b border-gray-200 pb-2">
                {{ user.email || '未绑定' }}
              </div>
            </div>
            
            <div class="pt-6">
              <router-link
                to="/AI/change-password"
                class="cursor-target inline-flex items-center justify-center w-full px-5 py-4 bg-[var(--theme-main)] hover:bg-[var(--theme-button-hover)] text-white rounded-xl shadow-md hover:shadow-lg text-base font-bold transition transform active:scale-95"
              >
                点击修改密码
              </router-link>
            </div>
          </div>
        </div>

        <div class="hidden md:block w-px bg-gray-200/70 my-2" />

        <!-- 右栏：主题 + 法律条款 -->
        <div class="w-full flex flex-col md:flex-1">
          <!-- 主题设置区域 -->
          <div class="w-full">
            <div class="flex items-center gap-3 mb-8 border-b border-gray-200/50 pb-4">
               <span class="text-2xl font-bold bg-gradient-to-r from-[var(--theme-main)] to-emerald-300 bg-clip-text text-transparent tracking-tight">界面主题</span>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button
                v-for="item in themeOptions"
                :key="item.value"
                type="button"
                @click="selectTheme(item.value)"
                :class="[
                  'cursor-target px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-2 border text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1',
                  theme === item.value
                    ? 'border-[var(--theme-main)] bg-white/90 ring-2 ring-[var(--theme-main)]/20'
                    : 'border-gray-200 bg-white/50 hover:bg-white/80',
                ]"
              >
                <span
                  :class="item.color"
                  class="w-8 h-8 rounded-full shadow-md"
                ></span>
                <span class="font-medium text-gray-700">{{ item.label }}</span>
              </button>
            </div>
          </div>

          <!-- 法律条款区域 -->
          <div class="w-full mt-auto">
            <div class="h-px bg-gray-200/70 w-full mx-auto my-8" />
            <div class="flex items-center gap-3 mb-8 border-b border-gray-200/50 pb-4">
              <span class="text-2xl font-bold bg-gradient-to-r from-[var(--theme-main)] to-emerald-300 bg-clip-text text-transparent tracking-tight">法律条款</span>
            </div>
            <div class="flex flex-col gap-4">
              <router-link
                to="/privacy"
                class="cursor-target flex items-center justify-between px-6 py-4 rounded-xl border border-gray-200 bg-white/50 hover:bg-white/80 hover:border-[var(--theme-main)] hover:shadow-md transition group"
              >
                <span class="text-base font-medium text-gray-700 group-hover:text-[var(--theme-main)]">隐私政策</span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-[var(--theme-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </router-link>
              <router-link
                to="/terms"
                class="cursor-target flex items-center justify-between px-6 py-4 rounded-xl border border-gray-200 bg-white/50 hover:bg-white/80 hover:border-[var(--theme-main)] hover:shadow-md transition group"
              >
                <span class="text-base font-medium text-gray-700 group-hover:text-[var(--theme-main)]">用户使用协议</span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-[var(--theme-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http.js'

const userStore = useUserStore()
const user = ref(userStore.user)
const router = useRouter()

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
  {
    value: 'cyber-dark',
    label: '赛博暗色',
    color: 'bg-gradient-to-r from-cyan-400 via-fuchsia-600 to-black',
  },
]
const theme = ref(localStorage.getItem('theme') || 'default')

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

onMounted(async () => {
  await http.getUserInfo().then((res) => {
    userStore.setUser({
      name: res.name,
      email: res.email,
      uuid: res.uuid,
    })
    user.value = userStore.user
  })
  applyTheme(theme.value as string)
})
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
