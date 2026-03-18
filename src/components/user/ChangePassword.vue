<template>
  <div class="relative min-h-0 flex flex-1 justify-center bg-[var(--theme-body)] pt-20">
    <div class="absolute inset-0 pointer-events-none z-0"></div>
    <!-- 主卡片 -->
    <div class="relative z-10 w-full max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-2">
        <div class="w-12 h-12 rounded-full bg-white/80 shadow flex items-center justify-center">
          <img src="@/assets/images/users.svg" class="w-8 h-8" />
        </div>
        <div>
          <h2
            class="text-2xl font-bold bg-gradient-to-r from-[var(--theme-main)] to-emerald-400 bg-clip-text text-transparent"
          >
            修改密码
          </h2>
          <p class="text-sm text-gray-500">请设置新的密码以保障账户安全</p>
        </div>
      </div>

      <div
        class="rounded-2xl shadow-xl border border-gray-200 bg-white/60 dark:bg-white/20 backdrop-blur-lg p-8"
      >
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- 旧密码输入 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="oldPassword">旧密码</label>
            <div class="relative">
              <input
                v-model="oldPassword"
                type="password"
                id="oldPassword"
                class="w-full cursor-target px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                :class="{
                  'border-red-400 focus:ring-red-200 focus:border-red-400':
                    errorMsg && !oldPassword.value,
                }"
                required
                autocomplete="current-password"
                placeholder="请输入旧密码"
              />
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

          <!-- 新密码输入 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="newPassword">新密码</label>
            <div class="relative">
              <input
                v-model="newPassword"
                type="password"
                id="newPassword"
                class="w-full px-4 cursor-target py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                :class="{
                  'border-red-400 focus:ring-red-200 focus:border-red-400':
                    errorMsg &&
                    (newPassword.value.length < 6 || newPassword.value === oldPassword.value),
                }"
                required
                autocomplete="new-password"
                placeholder="请输入新密码"
              />
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <p class="mt-1 text-xs text-gray-500">密码长度至少6位，建议包含字母和数字</p>
          </div>

          <!-- 确认密码输入 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="confirmPassword"
              >确认新密码</label
            >
            <div class="relative">
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                class="w-full px-4 py-3 cursor-target pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                :class="{
                  'border-red-400 focus:ring-red-200 focus:border-red-400':
                    errorMsg && confirmPassword.value !== newPassword.value,
                }"
                required
                autocomplete="new-password"
                placeholder="请再次输入新密码"
              />
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

          <!-- 错误提示 -->
          <div
            v-if="errorMsg"
            class="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            <svg
              class="flex-shrink-0"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {{ errorMsg }}
          </div>

          <!-- 提交按钮 -->
          <button
            type="submit"
            class="cursor-target w-full py-3 bg-[var(--theme-main)] hover:bg-[var(--theme-button-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">确认修改</span>
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <svg
                class="animate-spin"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="50"
                  stroke-dashoffset="25"
                  stroke-linecap="round"
                />
              </svg>
              处理中...
            </span>
          </button>
        </form>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div v-if="showConfirm" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h3 class="text-lg font-bold mb-2">确认修改</h3>
        <p class="text-gray-600 mb-6">确定要修改密码吗？修改后需要重新登录</p>
        <div class="flex justify-end gap-3">
          <button
            @click="showConfirm = false"
            class="cursor-target px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmChange"
            class="cursor-target px-4 py-2 bg-[var(--theme-main)] hover:bg-[var(--theme-button-hover)] text-white rounded-lg transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FetchUtil from '../../api/http.js'
import router from '../../router/index.js'

// 表单数据
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const showConfirm = ref(false)
const isSubmitting = ref(false) // 提交状态

// 添加 ESC 键监听
// 表单提交验证
function onSubmit() {
  errorMsg.value = ''

  // 验证逻辑保持不变
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMsg.value = '请填写所有字段'
    return
  }
  if (oldPassword.value === newPassword.value) {
    errorMsg.value = '新密码不能与旧密码相同'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = '两次输入的新密码不一致'
    return
  }
  if (newPassword.value.length < 6) {
    errorMsg.value = '新密码长度不能少于6位'
    return
  }

  showConfirm.value = true
}

// 确认修改密码
function confirmChange() {
  showConfirm.value = false
  isSubmitting.value = true // 显示加载状态

  FetchUtil.updateUserInfo({
    old_password: oldPassword.value,
    new_password: newPassword.value,
  })
    .then(() => {
      // 成功提示（可以替换为更美观的UI组件）
      alert('密码修改成功！即将重新登录')
      if (FetchUtil.logout) {
        FetchUtil.logout()
      }
      router.go(0)

      // 重置表单
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      router.go(0) // 刷新页面
    })
    .catch((err) => {
      errorMsg.value = err.message || '修改失败，请重试'
    })
    .finally(() => {
      isSubmitting.value = false // 关闭加载状态
    })
}
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
