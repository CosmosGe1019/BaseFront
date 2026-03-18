<template>
  <div class="h-screen bg-white flex items-center justify-center">
    <FuzzyText
        text="404 Not Found"
        :font-size="140"
        font-weight="900"
        color="#000000"
        :enable-hover="true"
        :base-intensity="0.18"
        :hover-intensity="0.5"
    />
  </div>
</template>

<!-- 已用Tailwind类名，无需额外样式 -->
<script setup lang="ts">
import FuzzyText from "@/color/FuzzyText.vue";
</script>