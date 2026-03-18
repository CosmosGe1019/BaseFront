<template>
  <header
    class="w-full bg-[var(--theme-bg)] border-b border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-2 md:py-2 relative z-5 min-h-33"
  >
    <router-link to="/" class="flex items-center gap-5 w-1/6 md:w-auto">
      <!-- LOGO/图标 -->
      <div class="flex items-center justify-center rounded-full w-10 h-10 mr-2 dark:bg-transparent">
        <svg
          t="1752914624151"
          class="icon"
          viewBox="0 0 1051 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
        >
          <path
            d="M210.393996 472.446294h73.053471v160.717636h-73.053471z"
            fill="var(--theme-main)"
          />
          <path
            d="M791.169091 531.619605V300.770637H431.746014v-50.406895a127.843574 127.843574 0 0 0 91.316838-121.268762 127.843574 127.843574 0 1 0-164.370309 121.268762v50.406895H0V804.839587h475.578096a230.118434 230.118434 0 0 0 127.11304 131.496248V1024l159.256567-52.598499c157.795497 0 285.639072-100.083255 285.639071-219.160413s-112.502345-207.471858-256.417683-220.621483zM341.15971 129.09498A54.059569 54.059569 0 0 1 395.219278 74.304877a54.790103 54.790103 0 1 1 0 108.849672 54.059569 54.059569 0 0 1-54.059568-54.059569zM73.053471 373.824108h645.062149v157.064963h-34.335131l-32.143528 8.035882-18.993902 5.844277-29.951923 11.688556-18.263368 13.149624h-6.574812V472.446294h-73.053471v160.717636H511.374297a239.615385 239.615385 0 0 0-23.377111 25.568715l-5.844277 13.149625a155.603893 155.603893 0 0 0-10.227486 25.568715 127.11304 127.11304 0 0 0 0 16.071763v16.071764H73.053471z m683.049954 522.332318l-80.358818 24.83818v-34.335131L651.636961 877.893058a159.256567 159.256567 0 0 1-113.23288-116.885554 56.251173 56.251173 0 0 1 0-10.95802c0-80.358818 97.891651-146.106942 219.160413-146.106942 118.346623 0 219.160413 67.939728 219.160413 146.106942s-100.083255 146.106942-220.621482 146.106942z"
            fill="var(--theme-main)"
          />
          <path
            d="M684.511023 714.253283a36.526736 36.526736 0 0 0-36.526735 36.526735 35.065666 35.065666 0 0 0 4.383208 17.532833 36.526736 36.526736 0 0 0 64.287055 0 35.065666 35.065666 0 0 0 4.383208-17.532833 36.526736 36.526736 0 0 0-36.526736-36.526735z"
            fill="var(--theme-main)"
          />
          <path
            d="M827.695826 750.780018m-36.526735 0a36.526736 36.526736 0 1 0 73.053471 0 36.526736 36.526736 0 1 0-73.053471 0Z"
            fill="var(--theme-main)"
          />
        </svg>
      </div>
      <div class="min-w-0 w-full">
        <div
          class="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[var(--theme-main)] to-emerald-400 bg-clip-text text-transparent drop-shadow-sm select-none break-words"
        >
          智能知识库平台
        </div>
        <div
          class="text-sm md:text-base text-[var(--theme-main)] opacity-80 mt-0.5 select-none break-words"
        >
          AI驱动 · 知识库 · 智能体
        </div>
      </div>
    </router-link>

<!--    <a-menu-->
<!--      class="transparent-menu"-->
<!--      v-model:selectedKeys="current"-->
<!--      mode="horizontal"-->
<!--      :items="items"-->
<!--      @click="doMenuClick"-->
<!--    />-->

   <GooeyNav
    :items="items"
    :animation-time="600"
    :particle-count="5"
    :particle-distances="[90, 10]"
    :particle-r="60"
    :time-variance="300"
    :colors="[1, 2, 3, 1, 2, 3, 1, 4]"
    :initial-active-index="currentIndex"
    @item-click="handleItemClick"
  />

    <div class="ml-4 flex items-center gap-2">
      <button
        @click="showLogoutModal = true"
        class="ml-4 flex cursor-target items-center gap-2 px-3 h-10 rounded-full transition bg-white/50 border border-gray-200 text-gray-700 font-medium text-sm whitespace-nowrap"
        title="退出"
      >
        <svg
          t="1753333840646"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
        >
          <path
            d="M675.84 768c-22.528 0-40.96 18.944-40.96 42.496v106.496c0 11.776-8.704 24.576-19.968 24.576h-512c-11.264 0-20.992-13.312-20.992-24.576V106.496c0-11.776 9.728-24.576 20.992-24.576h512c11.264 0 19.968 13.312 19.968 24.576v106.496c0 23.552 18.432 42.496 40.96 42.496s40.96-18.944 40.96-42.496V106.496C716.8 47.616 670.72 0 614.4 0H102.4C46.08 0 0 47.616 0 106.496v810.496C0 976.384 46.08 1024 102.4 1024h512c56.32 0 102.4-47.616 102.4-106.496v-106.496c0-24.064-18.432-43.008-40.96-43.008z"
            fill="#d81e06"
          ></path>
          <path
            d="M1011.2 481.792l-184.32-181.248c-16.896-16.384-44.544-16.384-61.44 0-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024L875.52 469.504H448.512c-24.064 0-43.52 18.944-43.52 42.496 0 23.552 19.456 42.496 43.52 42.496H875.52l-110.08 108.032c-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024c8.704 8.192 19.456 12.8 30.72 12.8s22.528-4.096 30.72-12.8l184.32-181.248c16.896-16.384 16.896-43.52 0-59.904z"
            fill="#d81e06"
          ></path>
        </svg>
        <span>退出登录</span>
      </button>
      <!-- 退出确认弹窗 -->
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
          <div class="font-bold text-lg mb-2">确认退出登录</div>
          <div class="mb-4">确定要退出登录吗？</div>
          <div class="flex gap-4 justify-end">
            <button
              class="px-4 py-2 bg-gray-200 rounded cursor-target hover:bg-gray-300"
              @click="showLogoutModal = false"
            >
              取消
            </button>
            <button
              class="px-4 py-2 bg-red-500 cursor-target text-white rounded hover:bg-red-600"
              @click="confirmLogout"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { h, onMounted, ref, watch, computed } from 'vue'
import http from '../api/http'
import { useUserStore } from '@/stores/user'
import { MenuProps } from 'ant-design-vue'
import GooeyNav from "@/color/GooeyNav.vue";

const theme = ref(localStorage.getItem('theme') || 'default')

function applyTheme(val) {
  if (
    [
      'default',
      'pink',
      'brown',
      'gradient-blue-pink',
      'gradient-orange-purple',
      'new-theme',
      'cyber-dark',
    ].includes(val)
  ) {
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
    // 跟随系统
    document.body.removeAttribute('data-theme')
    localStorage.setItem('theme', 'system')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

if (typeof document !== 'undefined') {
  applyTheme(theme.value)
}

const router = useRouter()
const showLogoutModal = ref(false)

const route = useRoute()

async function confirmLogout() {
  await http.logout()
  router.push('/home')
  showLogoutModal.value = false
  useUserStore().logout()
}

const current = ref<string[]>([])

// 计算当前激活的索引
const currentIndex = computed(() => {
  const path = route.path
  if (path.startsWith('/AI/chat')) return 0
  if (path.startsWith('/AI/test')) return 1
  if (path.startsWith('/AI/knowledge')) return 2
  if (path.startsWith('/AI/account') || path.startsWith('/AI/setting')) return 3
  return 0
})

// 处理导航项点击
const handleItemClick = (index: number) => {
  const item = items.value[index]
  router.push(item.href)
}

// 监听路由变化，确保同步
watch(() => route.path, (newPath) => {
  const index = items.value.findIndex(item => item.href === newPath)
  if (index !== -1 && index !== currentIndex.value) {
    // 如果需要可以在这里触发GooeyNav的更新
  }
})

watch(
  () => route.path,
  (newPath) => {
    // 根据当前路由路径设置选中的菜单项
    current.value = [newPath]
  },
  { immediate: true }, // 立即执行一次
)

const items = ref<MenuProps['items']>([
  {
    href: '/AI/chat',
    label: '智能体对话',
  },
  {
    href: '/AI/test',
    label: '智能体人设',
  },
  {
    href: '/AI/knowledge',
    label: '知识库管理',
  },
  {
    href: '/AI/account',
    label: '用户管理',
  },
])
</script>

<style scoped>
.transparent-menu {
  background-color: transparent !important;
  margin-left: 10px;
}

.transparent-menu .ant-menu-item,
.transparent-menu .ant-menu-submenu-title {
  font-size: medium; /* 设置字体大小 */
  padding-right: 20px;
  margin-right: 20px;
}
</style>
