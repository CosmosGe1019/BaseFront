<!--欢迎页面中间三个框的渐变效果组件-->

<script setup lang="ts">
import { computed } from 'vue';

interface GradientTextProps {
  text: string;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  // 移除showBorder属性（因为不再需要边框）
}

const props = withDefaults(defineProps<GradientTextProps>(), {
  text: '',
  className: '',
  colors: () => ['#ffaa40', '#9c40ff', '#ffaa40'],
  animationSpeed: 8,
});

// 仅保留文字渐变样式计算
const textStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, ${props.colors.join(', ')})`,
  animationDuration: `${props.animationSpeed}s`,
  backgroundSize: '300% 100%',
  '--animation-duration': `${props.animationSpeed}s`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
}));
</script>

<template>
  <!-- 移除边框相关元素，简化容器结构 -->
  <div
    :class="`inline-block ${className}`" 
  >
    <!-- 仅保留文字渐变元素 -->
    <div class="text-transparent bg-cover animate-gradient" :style="textStyle">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  animation: gradient var(--animation-duration, 8s) linear infinite;
}
</style>
