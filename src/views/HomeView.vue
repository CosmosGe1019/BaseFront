<template>

   
<!--淡入淡出-->
    <FadeContent
    :blur="true"
    :duration="1000"
    :delay="70"
    :threshold="0.1"
    :initial-opacity="0"
    easing="ease-out"
    class-name="my-fade-content"
  >
  <div class="h-screen">
    
   <div class="hyperspeed-container">
     <Hyperspeed :effect-options="effectOptions" />
    </div>
   
  
  
  
  <main class="relative flex flex-col items-center justify-center h-full theme-bg w-full px-4 overflow-x-hidden">
    <!-- 顶部品牌区 -->
    <section class="w-full max-w-4xl flex flex-col items-center text-center mb-10">
      <GlitchText
    children="智能知识库平台"
    :speed="1.5"
    :enable-shadows="true"
    :enable-on-hover="false"
     style="font-size: 86px;" 
  />
      <p class="text-lg md:text-2xl text-gray-700 dark:text-gray-200 font-medium mb-2">AI驱动 · 知识库 · 智能体</p>
      <p class="text-base md:text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto mb-4">我们致力于为企业和开发者提供一体化智能知识库解决方案，结合大语言模型与企业知识资产，让每个智能体都能基于专属知识高效回答与协作。</p>
      <div class="flex flex-wrap justify-center gap-3 mt-2">
        <span class="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">多知识库管理</span>
        <span class="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">智能体人设配置</span>
        <span class="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">对话记录沉淀</span>
        <span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-semibold">安全访问控制</span>
        <span class="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold">API开放</span>
      </div>
    </section>
    <!-- 核心优势区 -->
    <section class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-blue-200 dark:border-gray-800 hover:scale-105 transition-transform">
        <svg width="40" height="40" fill="none" viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.2 0-372-166.8-372-372S306.8 140 512 140s372 166.8 372 372-166.8 372-372 372z" fill="#3b82f6"/><path d="M512 256a64 64 0 1 0 0 128 64 64 0 0 0 0-128zm0 384c-70.7 0-128 57.3-128 128h64a64 64 0 0 1 128 0h64c0-70.7-57.3-128-128-128z" fill="#3b82f6"/></svg>
        <h3 class="font-bold text-lg mt-3 mb-1 bg-gradient-to-r from-blue-300 to-blue-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-[text-gradient_3s_linear_infinite]">知识统一管理</h3>
           <GradientText
    text="支持多源、多格式文档统一入库与切片管理，让知识结构清晰可控。"
    :colors="['#ffaa40', '#9c40ff', '#ffaa40']"
    :animation-speed="8"
    class-name="your-custom-class"
      />
       
      </div>
      <div class="rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-green-200 dark:border-gray-800 hover:scale-105 transition-transform">
        <svg width="40" height="40" fill="none" viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.2 0-372-166.8-372-372S306.8 140 512 140s372 166.8 372 372-166.8 372-372 372z" fill="#10b981"/><path d="M512 320a192 192 0 1 0 0 384 192 192 0 0 0 0-384zm0 320a128 128 0 1 1 0-256 128 128 0 0 1 0 256z" fill="#10b981"/></svg>
        <h3 class="font-bold text-lg mt-3 mb-1 bg-gradient-to-r from-green-300 to-green-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-[text-gradient_3s_linear_infinite]">多智能体协作</h3>
         <GradientText
    text="为不同业务场景配置独立智能体人设，支持多轮对话、上下文记忆和专属知识库。"
    :colors="['#ffaa40', '#9c40ff', '#ffaa40']"
    :animation-speed="8"
    class-name="your-custom-class"
      />
      </div>
      <div class="rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-yellow-200 dark:border-gray-800 hover:scale-105 transition-transform">
        <svg width="40" height="40" fill="none" viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.2 0-372-166.8-372-372S306.8 140 512 140s372 166.8 372 372-166.8 372-372 372z" fill="#f59e42"/><path d="M512 320a64 64 0 1 0 0 128 64 64 0 0 0 0-128zm0 384c-70.7 0-128 57.3-128 128h64a64 64 0 0 1 128 0h64c0-70.7-57.3-128-128-128z" fill="#f59e42"/></svg>
        <h3 class="font-bold text-lg mt-3 mb-1 bg-gradient-to-r from-yellow-300 to-yellow-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-[text-gradient_3s_linear_infinite]">安全可控与开放</h3>
          <GradientText
    text="提供丰富 API 支持与访问控制策略，方便与现有系统集成，同时保障数据安全与合规。"
    :colors="['#ffaa40', '#9c40ff', '#ffaa40']"
    :animation-speed="8"
    class-name="your-custom-class"
      />
      </div>
    </section>
    <!-- 行动引导区 -->
    <section class="w-full flex flex-col items-center mt-2">
    
      <router-link to="/AI">
        <button class="cursor-target gradient-border-button  bg-transparent !bg-transparent hover:border-purple-600 text-white text-lg font-semibold rounded-full shadow-lg ">立即体验智能知识库对话</button>
      </router-link>
   

    </section>
    <!-- 底部装饰 -->
    <div class="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-blue-100/60 to-transparent pointer-events-none" />
  </main>
 
  </div>
  </FadeContent>
</template>


<script setup lang="ts">
import { onMounted,ref } from 'vue';
import FadeContent from "@/color/FadeContent.vue";
import GlitchText from '@/color/GlitchText.vue';
import GradientText from '@/color/GradientText.vue';
import Hyperspeed from "@/color/Hyperspeed.vue";



function onThemeChange(theme: string) {
  if (typeof window !== 'undefined') {
    document.body.setAttribute('data-theme', theme);
  }
}

 // Use a preset or create custom options
  const effectOptions = ref(Hyperspeed.one)


onMounted(() => {
  // 保证刷新后主题不丢失，可选：可从 localStorage 读取
  const theme = document.body.getAttribute('data-theme') || 'default';
  document.body.setAttribute('data-theme', theme);
});
</script>

<style scoped>
.gradient-border-button {
  position: relative;
  background-color: transparent;
  border: 3px solid transparent; /* 调整边框宽度 */
  border-radius: 9999px;
  background-clip: padding-box; /* 确保背景不延伸到边框 */
  padding: 10px 20px;
  z-index: 1;
}

.gradient-border-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  margin: -3px; /* 必须与border-width相同 */
  border-radius: 9999px;
  background: linear-gradient(90deg, #9c40ff, #ffaa40);
  transition: opacity 0.3s ease;
}

.gradient-border-button:hover::before {
  background: linear-gradient(90deg, #7e22ce, #f59e0b); /* 悬停时的渐变颜色 */
}

.hyperspeed-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color:black
}

/* 在样式区域添加自定义类 */
.your-custom-class {
  background: transparent ; /* 强制背景透明 */
  /* 若存在默认背景色或阴影，可一并清除 */
  background-color: transparent !important;
  box-shadow: none !important; /* 移除可能的背景阴影 */
}
</style>



