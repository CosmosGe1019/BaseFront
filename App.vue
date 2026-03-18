<template>
  <TargetCursor
      :spin-duration="2"
      :hide-default-cursor="true"
  />
  <router-view />
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import http from '@/api/http'
import { onMounted } from 'vue'
import TargetCursor from "@/color/TargetCursor.vue";
const userStore = useUserStore()
const user = userStore.user
// 由AppHeader统一拉取用户信息，无需重复拉取

</script>

