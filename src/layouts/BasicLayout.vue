<template>
  <div class="flex flex-col max-h-screen">
    <div class="min-h-screen flex flex-col theme-bg">
      <!--头部区域-->
      <AppHeader />
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>
