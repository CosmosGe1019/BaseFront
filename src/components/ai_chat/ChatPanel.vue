<template>
  <div class="w-full h-full flex flex-col shadow-xl rounded-xl bg-white/50">
    <!-- 查询等待提示 -->
    <a-spin
      v-if="showWaiting"
      tip="正在思考，请稍候..."
      class="fixed left-1/2 top-1/3 -translate-x-1/2 z-[2000]"
      size="large"
    />
    <div
      v-if="!conversationStore.getConfirmConversation"
      class="flex flex-col w-full h-full max-w-full mx-auto theme-bg rounded-xl p-4 md:p-8"
    >
      <div ref="msgListRef" class="flex-1 mb-2 overflow-y-auto w-full min-h-0">
        <div v-if="FirstMessages.length === 0" class="text-center text-gray-400 mt-10">
          暂无对话记录
        </div>

        <div
          v-for="(msg, index) in FirstMessages.filter((m) => m)"
          :key="index"
          :class="msg.role === 1 ? 'justify-start' : 'justify-end'"
          class="flex mb-3 mt-2 items-center flex-wrap"
        >
          <svg v-if="msg.role === 1"
            t="1752914624151"
            class="icon mr-2 theme-main"
            viewBox="0 0 1051 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
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
          <template v-if="!msg.img">
            <span
              v-if="msg.role === 0"
              :class="msg.role === 1 ? 'theme-msg-ai' : 'theme-msg-me'"
              class="inline-block px-3 py-2 rounded-lg break-words max-w-full md:max-w-[700px]"
            >
              {{ msg.content }}
            </span>
            <div
              v-else
              :class="msg.role === 1 ? 'theme-msg-ai markdown-body' : 'theme-msg-me'"
              class="inline-block px-3 py-2 rounded-lg break-words max-w-full md:max-w-[700px]"
              v-html="renderMarkdown(msg.content)"
            ></div>
          </template>
          <template v-else>
            <img
              :src="msg.img"
              class="max-w-[300px] max-h-[300px] rounded-lg border border-purple-400 shadow-lg"
              alt="用户上传图片"
            />
          </template>
          <svg v-if="msg.role === 0"
            t="1754403847727"
            class="icon ml-2 theme-main"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
          >
            <path d="M511.931733 1023.351467a512.887467 512.887467 0 0 1-377.514666-166.126934l-20.241067-21.742933 20.241067-21.742933a513.7408 513.7408 0 0 1 377.514666-166.126934c143.121067 0 281.088 60.552533 377.514667 166.126934l20.241067 21.742933-20.206934 21.742933a512.887467 512.887467 0 0 1-377.514666 166.126934z m-308.565333-187.869867a448.853333 448.853333 0 0 0 308.565333 123.1872 448.853333 448.853333 0 0 0 308.565334-123.1872 448.853333 448.853333 0 0 0-308.565334-123.1872 448.853333 448.853333 0 0 0-308.565333 123.221333z m309.077333-234.461867c-90.2144 0-163.84-73.489067-163.84-163.5328 0-90.043733 73.6256-163.566933 163.84-163.566933 90.248533 0 163.874133 73.5232 163.874134 163.566933a163.7376 163.7376 0 0 1-163.84 163.5328z m0-262.382933a99.259733 99.259733 0 0 0-99.0208 98.850133 99.259733 99.259733 0 0 0 99.0208 98.850134 99.259733 99.259733 0 0 0 99.054934-98.850134 98.952533 98.952533 0 0 0-99.054934-98.850133z" fill="var(--theme-main)"></path>
            <path d="M116.770133 721.1008A442.88 442.88 0 0 1 64.9216 512c0-246.340267 200.704-446.122667 447.010133-446.122667 246.340267 0 447.010133 200.2944 447.010134 446.122667 0 72.977067-18.1248 144.930133-51.848534 208.5888 16.5888 15.530667 32.1536 32.085333 46.6944 49.698133A506.914133 506.914133 0 0 0 1023.761067 512c0-282.043733-229.717333-511.317333-512.341334-511.317333C229.307733 1.160533 0.1024 230.434133 0.1024 512c0 91.101867 24.3712 180.6336 70.519467 258.286933 13.994667-17.066667 29.559467-33.655467 46.148266-49.152z" fill="var(--theme-main)"></path>
          </svg>
          <div v-if="msg.wave" class="flex items-end h-8 ml-2">
            <div
              v-for="i in 20"
              :key="i"
              :style="{ height: Math.random() * 20 + 10 + 'px' }"
              class="w-[3px] bg-purple-400 mr-[2px] rounded"
            ></div>
          </div>
        </div>
        <!-- 正在思考中提示 -->
        <div v-if="isThinking" class="flex mb-3 mt-2 items-center justify-start">
          <svg
            t="1752914624151"
            class="icon mr-2 theme-main"
            viewBox="0 0 1051 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
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
          <span class="text-gray-400 text-sm italic animate-pulse">正在思考中，请耐心等待......</span>
        </div>
      </div>
    </div>

    <div
      v-if="conversationStore.getConfirmConversation"
      class="flex flex-col w-full h-full max-w-full mx-auto theme-bg rounded-xl p-4 md:p-8"
    >
      <div class="pb-2 flex items-center justify-between mb-2">
        <div class="flex items-center gap-4 flex-wrap w-full">
          <span class="font-bold text-lg">{{
            assistantStore.currentAssistant &&
            assistantStore.currentAssistant.name &&
            assistantStore.currentAssistant.name.trim()
              ? assistantStore.currentAssistant.name
              : '未命名机器人'
          }}</span>
          <span class="ml-2 text-xs text-gray-500">{{
            assistantStore.currentAssistant &&
            assistantStore.currentAssistant.desc &&
            assistantStore.currentAssistant.desc.trim()
              ? assistantStore.currentAssistant.desc
              : ''
          }}</span>
        </div>
        <a-select
            v-model:value="selectedKnowledgeUuids"
            mode="multiple"
            style="min-width: 340px; max-width: 340px; background: #f8f8fc; border-radius: 8px; border: 1px solid #a259ff; box-shadow: 0 2px 8px rgba(162,89,255,0.08);"
            placeholder="选择知识库（可多选）"
            :options="knowledgeOptions"
            class="mr-4 cursor-target"
            @change="onKnowledgeChange"
          ></a-select>
      </div>
      <div ref="msgListRef" class="flex-1 mb-2 border-y border-gray-300 overflow-y-auto w-full min-h-0">
        <div v-if="FirstMessages.length === 0" class="text-center text-gray-400 mt-10">
          暂无对话记录
        </div>
        <div
          v-for="(msg, index) in FirstMessages.filter((m) => m)"
          :key="index"
          :class="msg.role === 1 ? 'justify-start' : 'justify-end'"
          class="flex mb-3 mt-6 items-center flex-wrap"
        >
          <svg v-if="msg.role === 1"
            t="1752914624151"
            class="icon mr-2 theme-main"
            viewBox="0 0 1051 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
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
          <template v-if="!msg.img">
            <span
              v-if="msg.role === 0"
              :class="msg.role === 1 ? 'theme-msg-ai' : 'theme-msg-me'"
              class="inline-block px-3 py-2 rounded-lg break-words max-w-full md:max-w-[700px]"
            >
              {{ msg.content }}
            </span>
            <div
              v-else
              :class="msg.role === 1 ? 'theme-msg-ai markdown-body' : 'theme-msg-me'"
              class="inline-block px-3 py-2 rounded-lg break-words max-w-full md:max-w-[700px]"
              v-html="renderMarkdown(msg.content)"
            ></div>
          </template>
          <template v-else>
            <img
              :src="msg.img"
              class="max-w-[300px] max-h-[300px] rounded-lg border border-purple-400 shadow-lg"
              alt="用户上传图片"
            />
          </template>
          <svg v-if="msg.role === 0"
            t="1754403847727"
            class="icon ml-2 theme-main"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
          >
            <path d="M511.931733 1023.351467a512.887467 512.887467 0 0 1-377.514666-166.126934l-20.241067-21.742933 20.241067-21.742933a513.7408 513.7408 0 0 1 377.514666-166.126934c143.121067 0 281.088 60.552533 377.514667 166.126934l20.241067 21.742933-20.206934 21.742933a512.887467 512.887467 0 0 1-377.514666 166.126934z m-308.565333-187.869867a448.853333 448.853333 0 0 0 308.565333 123.1872 448.853333 448.853333 0 0 0 308.565334-123.1872 448.853333 448.853333 0 0 0-308.565334-123.1872 448.853333 448.853333 0 0 0-308.565333 123.221333z m309.077333-234.461867c-90.2144 0-163.84-73.489067-163.84-163.5328 0-90.043733 73.6256-163.566933 163.84-163.566933 90.248533 0 163.874133 73.5232 163.874134 163.566933a163.7376 163.7376 0 0 1-163.84 163.5328z m0-262.382933a99.259733 99.259733 0 0 0-99.0208 98.850133 99.259733 99.259733 0 0 0 99.0208 98.850134 99.259733 99.259733 0 0 0 99.054934-98.850134 98.952533 98.952533 0 0 0-99.054934-98.850133z" fill="var(--theme-main)"></path>
            <path d="M116.770133 721.1008A442.88 442.88 0 0 1 64.9216 512c0-246.340267 200.704-446.122667 447.010133-446.122667 246.340267 0 447.010133 200.2944 447.010134 446.122667 0 72.977067-18.1248 144.930133-51.848534 208.5888 16.5888 15.530667 32.1536 32.085333 46.6944 49.698133A506.914133 506.914133 0 0 0 1023.761067 512c0-282.043733-229.717333-511.317333-512.341334-511.317333C229.307733 1.160533 0.1024 230.434133 0.1024 512c0 91.101867 24.3712 180.6336 70.519467 258.286933 13.994667-17.066667 29.559467-33.655467 46.148266-49.152z" fill="var(--theme-main)"></path>
          </svg>
          <div v-if="msg.wave" class="flex items-end h-8 ml-2">
            <div
              v-for="i in 20"
              :key="i"
              :style="{ height: Math.random() * 20 + 10 + 'px' }"
              class="w-[3px] bg-[var(--theme-main)] mr-[2px] rounded"
            ></div>
          </div>
        </div>
        <!-- 正在思考中提示 -->
        <div v-if="isThinking" class="flex mb-3 mt-6 items-center justify-start">
          <svg
            t="1752914624151"
            class="icon mr-2 theme-main"
            viewBox="0 0 1051 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
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
          <span class="text-gray-400 text-sm italic animate-pulse">正在思考中，请耐心等待......</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 w-full mt-4">
        <div class="flex items-center mb-0 px-1">
          <div class="flex items-center gap-2">
             <button
              class="flex-shrink-0 h-[36px] cursor-target w-auto px-4 flex items-center justify-center border border-blue-300 shadow-sm rounded-full hover:bg-[var(--theme-body)] transition text-sm font-medium"
              :class="isWebSearch ? 'bg-[var(--theme-aside)] text-blue-700 ring-2 ring-blue-100' : 'bg-white text-blue-600'"
              @click="toggleWebSearch"
              :title="isWebSearch ? '已开启联网搜索，禁用知识库和图片上传' : '点击开启联网搜索（禁用知识库和图片上传）'"
            >
              <svg v-if="!isWebSearch" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {{ isWebSearch ? '已开启联网搜索' : '联网搜索' }}
            </button>
             <span class="text-xs text-gray-400 ml-2 hidden md:inline-block">
              {{ isWebSearch ? '将会优先使用网络结果回答' : '仅使用模型内部知识' }}
            </span>
          </div>

          <div class="ml-auto mr-2 flex items-center gap-2">
            <button
              class="px-3 py-1 text-xs rounded cursor-target text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
              @click="showDeleteMsgModal = true"
            >
              清空当前对话
            </button>
            <button
              class="h-[28px] w-[28px] md:h-[32px] md:w-[32px] flex items-center justify-center rounded-full cursor-target bg-red-500 hover:bg-red-600 text-white shadow-sm transition"
              title="结束对话"
              @click="endConversation"
            >
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5.5A2.5 2.5 0 015.5 3h1.1c.9 0 1.7.6 2 1.5l.7 2.3c.2.7 0 1.5-.6 2l-1.2.9a14.6 14.6 0 006.6 6.6l.9-1.2c.5-.6 1.3-.9 2-.6l2.3.7c.9.3 1.5 1.1 1.5 2v1.1A2.5 2.5 0 0118.5 21h-.6C9.7 21 3 14.3 3 6.1v-.6z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-end gap-3">
          <textarea
            v-model="inputMessage"
            @keypress="handleKeyPress"
            class="flex-1 min-h-[64px] max-h-[200px] px-5 py-4 rounded-2xl border border-gray-200 text-base text-gray-800 shadow-sm resize-vertical focus:outline-none focus:border-[var(--theme-main)] focus:ring-2 focus:ring-[var(--theme-main)]/20 transition-all placeholder-gray-400"
            rows="2"
            placeholder="输入你的问题，按 Enter 发送，Shift+Enter 换行..."
          />
          <!-- 发送按钮 -->
          <button
            class="flex-shrink-0 h-[56px] w-[56px] flex items-center justify-center rounded-2xl cursor-target border border-[var(--theme-main)] bg-[var(--theme-main)] text-white hover:bg-[var(--theme-button-hover)] shadow-md hover:shadow-lg transition-all active:scale-95"
            @click="sendMessage"
            title="发送消息"
          >
            <svg t="1754385205649" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M511.3 63.2C264.4 63.2 63.6 264 63.6 510.9s200.8 447.7 447.7 447.7S959 757.7 959 510.9 758.2 63.2 511.3 63.2z m0 858.1C285.1 921.3 101 737.2 101 510.9s184.1-410.4 410.4-410.4 410.4 184.1 410.4 410.4-184.2 410.4-410.5 410.4z" fill="#fff"></path><path d="M718.8 255.8c-11.5-7.8-26-8.1-37.9-0.9L230.7 528.1c-12.9 7.8-19.7 22.7-17.3 37.9 2.3 15 12.9 26.9 27.2 30.5L351.8 624c10.2 2.5 20.1-3.7 22.6-13.6 2.5-10-3.6-20.1-13.6-22.6L250 560l447.8-272.8-58.2 369.4-195.9-48.4 113.7-135.9c6.6-7.9 5.5-19.6-2.4-26.3-7.8-6.6-19.6-5.6-26.3 2.4l-130 155.5c-5.4 6.4-8.3 14.6-8.3 23.1v109.5c0 14.1 8.1 27 20.7 32.6 4.5 2 9.1 3 13.8 3 8.1 0 16-3 22.4-8.7l68.7-61.3c7.7-6.8 8.3-18.7 1.5-26.3-6.8-7.7-18.6-8.4-26.3-1.5L427.7 731l-0.3-88.2L630.6 693c2.8 0.7 5.7 1.1 8.5 1.1 6.8 0 13.4-2 19.3-5.9 8.6-5.7 14.4-14.9 16.1-25.2l60-369.6c2.5-14.8-3.7-29.5-15.7-37.6z" fill="#fff"></path></svg>
          </button>
          <!-- 上传图片按钮 -->
          <label
            :class="[
              'flex-shrink-0 cursor-target h-[56px] w-[56px] flex items-center justify-center border border-gray-200 shadow-sm rounded-2xl hover:bg-gray-50 transition active:scale-95',
              isWebSearch ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white'
            ]"
            :title="isWebSearch ? '联网搜索模式下禁用上传图片' : '上传图片，作为问题的一部分'"
          >
            <input
              accept="image/*"
              class="hidden"
              type="file"
              @change="onImageSelect"
              :disabled="isWebSearch"
            />
            <svg t="1754385411688" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M901.870933 31.744c68.266667 0 116.053333 54.613333 116.053334 122.88v723.626667c0 68.266667-54.613333 122.88-116.053334 122.88h-785.066666c-68.266667 0-116.053333-54.613333-116.053334-122.88v-730.453334c0-68.266667 54.613333-122.88 116.053334-122.88h785.066666z m-218.453333 471.04c-6.826667 0-20.48 6.826667-34.133333 13.653333-27.306667 20.48-54.613333 47.786667-88.746667 95.573334 0 6.826667-54.613333 68.266667-68.266667 88.746666l-6.826666 6.826667c-27.306667 34.133333-47.786667 47.786667-68.266667 47.786667-27.306667 0-47.786667-6.826667-75.093333-40.96l-20.48-13.653334-34.133334-40.96-34.133333-34.133333c-13.653333 0-61.44 34.133333-129.706667 102.4l-34.133333 34.133333v109.226667c0 20.48 13.653333 34.133333 34.133333 34.133333h785.066667c20.48 0 34.133333-13.653333 34.133333-34.133333v-81.92c-122.88-191.146667-218.453333-286.72-259.413333-286.72z m218.453333-389.12h-785.066666c-20.48 0-34.133333 13.653333-34.133334 34.133333v498.346667c81.92-68.266667 129.706667-102.4 170.666667-102.4 27.306667 0 47.786667 6.826667 75.093333 40.96l20.48 20.48 40.96 47.786667 13.653334 13.653333 6.826666 6.826667 6.826667-13.653334 6.826667-13.653333 6.826666-6.826667 54.613334-68.266666 13.653333-20.48c34.133333-40.96 61.44-75.093333 95.573333-95.573334 27.306667-20.48 54.613333-34.133333 81.92-34.133333 68.266667 0 150.186667 75.093333 259.413334 225.28v-491.52c0-27.306667-13.653333-40.96-34.133334-40.96z m-648.533333 116.053333c54.613333 0 95.573333 47.786667 95.573333 102.4s-40.96 95.573333-95.573333 95.573334-102.4-40.96-102.4-95.573334 40.96-102.4 102.4-102.4z m0 61.44c-27.306667 0-40.96 13.653333-40.96 40.96 0 20.48 20.48 40.96 40.96 40.96s34.133333-20.48 34.133333-40.96c0-27.306667-13.653333-40.96-34.133333-40.96z" fill="#2c2c2c"></path></svg>
          </label>
        </div>
      </div>
    </div>
    <!-- 聊天记录删除弹窗，放到根级，避免嵌套导致关闭无效 -->
    <div
      v-if="showDeleteMsgModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white/50 rounded-lg shadow-lg p-6 min-w-[320px]">
        <div class="font-bold text-lg mb-2">确认清空聊天记录</div>
        <div class="mb-4">确定要清空当前聊天记录吗？此操作不可恢复。</div>
        <div class="flex gap-4 justify-end">
          <button
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="closeDeleteMsgModal"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            @click="confirmDeleteMessages"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useAssistantStore } from '@/stores/assistant'
import { useConversationStore } from '@/stores/conversation.js'
import { Conversation, LlmSetting, Message, WsMessage } from '@/types/request'
import WebsocketClient from '@/api/websocket'
import { useUserStore } from '@/stores/user'
import http from '@/api/http'
import { useTempAiSetting } from '../../stores/globalStore'
import { useKnowledgeStore } from '@/stores/konwledge'
import { message } from 'ant-design-vue';
import { marked } from 'marked';

// 配置 marked
marked.setOptions({
  breaks: true, // 允许换行符转换为 <br>
  gfm: true,    // 启用 GitHub 风格的 Markdown
});

function renderMarkdown(content: string) {
  if (!content) return '';
  try {
    return marked.parse(content);
  } catch (e) {
    console.error('Markdown parse error:', e);
    return content;
  }
}

const knowledgeStore = useKnowledgeStore()
const selectedKnowledgeUuids = ref<string[]>([])
const knowledgeOptions = computed(() =>
  knowledgeStore.knowledges.map((k) => ({ label: k.name, value: k.uuid })),
)

function onKnowledgeChange(val: string[]) {
  selectedKnowledgeUuids.value = val
  // 这里selectedKnowledgeUuids就是所选KnowledgeItem的uuid数组
  // 可在此处做后续处理
}

const assistantStore = useAssistantStore()
const conversationStore = useConversationStore()
const conversationStorageKey = 'chat_current_conversation_uuid'

const recording = ref(false)
const showDeleteMsgModal = ref(false)
const msgListRef = ref<HTMLElement | null>(null)
const isMuted = ref(false)
const tempAiSetting = useTempAiSetting()
const isThinking = ref(false)

let currentAIMessage: { play_id: string; role: 1; content: string } | null = null
let currentMyMessage: { play_id: string; role: 0; content: string } | null = null
// 支持图片消息，img 可选
type ChatMsg = { play_id: string; role: 0 | 1; content: string; img?: string }
const FirstMessages = ref<ChatMsg[]>([])

// 查询等待提示相关
const showWaiting = ref(false)
let waitingTimer: ReturnType<typeof setTimeout> | null = null
let waitingActive = ref(false) // 仅通话中激活

// 沉默追问相关
let silenceTimer: ReturnType<typeof setTimeout> | null = null
let silenceActive = ref(false) // 仅通话中激活
const SILENCE_TIMEOUT = 30000
const SILENCE_MAX_COUNT = 3
const AI_FOLLOWUP_MSG = '还有什么我可以帮您的吗？'
const AI_FINAL_MSG = '感谢使用，期待下次为你服务~'
const silenceCount = ref(0)

async function loadConversationMessages(uuid: string) {
  if (!uuid) return
  const conv = conversationStore.conversations.find((c) => c.uuid === uuid)
  if (conv && conv.messages && conv.messages.length > 0) {
    FirstMessages.value = processMessages(conv.messages)
    scrollToBottom()
    stopSilenceTimer()
    return
  }
  try {
    const allMessages = await getAllMessages(uuid)
    FirstMessages.value = processMessages(allMessages)
  } catch (e) {
    console.error('获取消息失败:', e)
    FirstMessages.value = []
  }
  scrollToBottom()
  stopSilenceTimer()
}

// 获取所有消息的函数
async function getAllMessages(uuid, batchSize = 20) {
  let allMessages = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const messages = await http.getConversationMessages(page, batchSize, uuid);
    if (messages.length === 0) {
      hasMore = false;
    } else {
      allMessages = allMessages.concat(messages);
      // 如果返回的消息少于请求的数量，说明没有更多了
      if (messages.length < batchSize) {
        hasMore = false;
      }
      page++;
    }
  }
  
  return allMessages;
}

// 统一处理消息格式的函数
function processMessages(messages) {
  return messages.map((msg) => {
    if (msg.role === 0 && typeof msg.content === 'string' && msg.content.startsWith('data:image/')) {
      return {
        play_id: msg.uuid,
        role: msg.role,
        content: '',
        img: msg.content
      };
    } else {
      return {
        play_id: msg.uuid,
        role: msg.role,
        content: msg.content
      };
    }
  });
}

onMounted(async () => {
  await http
      .listNamespace(1, 20)
      .then(async (res) => {
        const filteredData = res
            .filter((a) => a.uuid !== '')
            .map((item) => ({
              uuid: item.uuid,
              name: item.name,
              description: item.description || '',
            }))
        await knowledgeStore.setKnowledgeList(filteredData)
      })
      .catch((err) => {
        console.error('加载知识库列表失败:', err)
        message.error('加载知识库列表失败，请稍后重试')
      })

  window.addEventListener('chat-new-conversation', handleNewConversationEvent)
  window.addEventListener('chat-select-conversation', handleSelectConversationEvent)
})

// 欢迎语只在消息为空时显示，不存入 Pinia
const inputMessage = ref('')
const isWebSearch = ref(false)

function confirmDeleteMessages() {
  // 清空当前会话消息
  http.deleteConversation(conversationStore.currentConversationuuId).catch((error) => {
    console.log(error)
    return
  })
  console.log(conversationStore.currentConversationuuId)
  const conv = conversationStore.conversations.find(
    (c) => c.uuid === conversationStore.currentConversationuuId,
  )
  console.log('conv', conversationStore.currentConversationuuId)
  if (conv) {
    conv.messages = []
    conv.title = '已经被清空'
  }
  FirstMessages.value = []
  showDeleteMsgModal.value = false
  stopSilenceTimer()
}

let wsClient: WebsocketClient | null = null

function closeDeleteMsgModal() {
  showDeleteMsgModal.value = false
}

const initWebSocketListener = () => {
  return new Promise((resolve) => {
    wsClient = WebsocketClient.getInstance()
    const ws = wsClient.getWsConnection()

    ws.onopen = () => {
      console.log('连接成功')

      // 连接成功后，发送 ping 消 messages
      wsClient.interval = setInterval(() => {
        wsClient.ping()
      }, 20000)

      let settingData: LlmSetting = {
        prompt_text: '',
        prompt_uuid: assistantStore.currentAssistant.uuid,
        namespace_uuid: selectedKnowledgeUuids.value,
        conversation_uuid:
          (conversationStore && conversationStore.currentConversationuuId) ||
          localStorage.getItem(conversationStorageKey) ||
          '',
      }

      let settingMsg: WsMessage = {
        type: 'setting',
        data: JSON.stringify(settingData),
      }

      console.log('发送设定', settingMsg)
      wsClient.send(settingMsg)
      // 连接成功后 resolve
      resolve(true)
    }

    ws.onmessage = (event) => {
      const msg: WsMessage = JSON.parse(event.data)
      console.log('收到消息', msg)

      switch (msg.type) {
        case 'conversation': {
          const uuid = msg?.data?.uuid
          if (uuid) {
            localStorage.setItem(conversationStorageKey, uuid)
            if (typeof conversationStore.setCurrentConversationuuId === 'function') {
              conversationStore.setCurrentConversationuuId(uuid)
            } else {
              conversationStore.currentConversationuuId = uuid
            }
            window.dispatchEvent(new Event('chat-refresh-conversation-list'))
          }
          break
        }
        case 'pong': {
          console.log('websocket 连接正常------------')
          break
        }
         case 'stop': {
           if (wsClient && wsClient.interval) {
             clearInterval(wsClient.interval)
             wsClient.interval = null
           }
           ws.close()
           break
        }
        case 'webrtc-answer': {
          break
        }
        case 'llmConv': {
          // 用户消息在本地已展示，这里忽略 role === 0
          if (msg.data.role == 0) {
            break
          }
          // 判断是否为图片 base64 字符串
          const isImg = typeof msg.data.content === 'string' && msg.data.content.startsWith('data:image/');
          if (isImg) {
            isThinking.value = false
            // 图片消息
            const imgMsg: ChatMsg = {
              play_id: msg.data.play_id || '',
              role: msg.data.role || 1, // 既然 role == 0 已经排除了，这里理论上应该是 1 或者 fallback 到 1
              content: '',
              img: msg.data.content,
            }
            FirstMessages.value.push(imgMsg)
            break;
          }
          if (msg.data.role == 1) {
            isThinking.value = false
            // AI文本消息
            if (!currentAIMessage || currentAIMessage.play_id !== msg.data.play_id) {
              currentAIMessage = {
                play_id: msg.data.play_id,
                role: 1,
                content: msg.data.content,
              }
              FirstMessages.value.push(currentAIMessage)
            } else if (currentAIMessage) {
              currentAIMessage.content += msg.data.content
              FirstMessages.value = [...FirstMessages.value]
            }
            // AI有输出，隐藏等待提示
            hideWaiting()
          }
          break
        }
        case 'llmRes': {
          break
        }
        default: {
          break
        }
      }
    }
  })
}

onUnmounted(() => {
  window.removeEventListener('chat-new-conversation', handleNewConversationEvent)
  window.removeEventListener('chat-select-conversation', handleSelectConversationEvent)
  if (wsClient) {
    wsClient.close()
    wsClient = null
  }
  stopSilenceTimer()
})

function scrollToBottom() {
  nextTick(() => {
    if (msgListRef.value) {
      msgListRef.value.scrollTop = msgListRef.value.scrollHeight
    }
  })
}

// 查询等待提示逻辑
function showWaitingTip() {
  showWaiting.value = true
}
function hideWaiting() {
  showWaiting.value = false
  if (waitingTimer) {
    clearTimeout(waitingTimer)
    waitingTimer = null
  }
}

// 监听AI消息输出，0.5秒无输出则显示等待提示
watch(
  FirstMessages,
  debounce(() => {
    if (!waitingActive.value) return
    // 只在有用户说话后且AI正在回答时才显示等待提示
    const msgs = FirstMessages.value
    if (msgs.length === 0) {
      hideWaiting()
      return
    }
    // 找到最后一条用户消息的位置，过滤掉 null/undefined
    const lastUserIdx = msgs.filter(m => m && typeof m.role === 'number').map(m => m.role).lastIndexOf(0)
    // 没有用户消息，直接不显示等待
    if (lastUserIdx === -1) {
      hideWaiting()
      return
    }
    // 用户说话后，AI还没回复，且最后一条消息是用户
    if (msgs.length - 1 === lastUserIdx) {
      hideWaiting()
      return
    }
    // 用户说话后，AI正在回复（即最后一条为AI，且在用户消息之后）
    const last = msgs[msgs.length - 1]
    if (last && last.role === 1) {
      // AI消息刚输出，隐藏等待
      hideWaiting()
    } else {
      // 0.5秒无AI输出，显示等待
      if (waitingTimer) clearTimeout(waitingTimer)
      waitingTimer = setTimeout(() => {
        showWaitingTip()
      }, 500)
    }
  }, 100),
  { deep: true },
)

// 沉默追问逻辑
function resetSilenceTimer() {
  if (!silenceActive.value) return
  if (silenceTimer) clearTimeout(silenceTimer)
  silenceTimer = setTimeout(() => {
    silenceCount.value += 1
    if (silenceCount.value < SILENCE_MAX_COUNT) {
      FirstMessages.value.push({
        play_id: 'ai-followup-' + Date.now(),
        role: 1,
        content: AI_FOLLOWUP_MSG,
      })
      hideWaiting()
      resetSilenceTimer()
      return
    }
    endConversation()
  }, SILENCE_TIMEOUT)
}

function stopSilenceTimer() {
  silenceActive.value = false
  silenceCount.value = 0
  if (silenceTimer) {
    clearTimeout(silenceTimer)
    silenceTimer = null
  }
}

function endConversation() {
  stopSilenceTimer()
  waitingActive.value = false
  hideWaiting()
  isThinking.value = false
  const last = FirstMessages.value[FirstMessages.value.length - 1]
  if (!last || last.content !== AI_FINAL_MSG) {
    FirstMessages.value.push({
      play_id: 'ai-final-' + Date.now(),
      role: 1,
      content: AI_FINAL_MSG,
    })
  }
  if (wsClient) {
    wsClient.close()
    wsClient = null
  }
  window.dispatchEvent(new Event('chat-refresh-conversation-list'))
}

function resetChatSession() {
  stopSilenceTimer()
  waitingActive.value = false
  hideWaiting()
  isThinking.value = false
  currentAIMessage = null
  inputMessage.value = ''
  FirstMessages.value = []
  if (wsClient) {
    wsClient.close()
    wsClient = null
  }
}

function handleNewConversationEvent() {
  resetChatSession()
  localStorage.removeItem(conversationStorageKey)
  if (typeof conversationStore.setCurrentConversationuuId === 'function') {
    conversationStore.setCurrentConversationuuId(null)
  } else {
    conversationStore.currentConversationuuId = null
  }
  window.dispatchEvent(new Event('chat-refresh-conversation-list'))
}

function handleSelectConversationEvent(e: Event) {
  const detail = (e as CustomEvent).detail as { uuid?: string } | undefined
  const uuid = detail?.uuid
  if (!uuid) return
  resetChatSession()
  loadConversationMessages(uuid)
}

/*

function quickInput(key: string) {
  Message.value.push({ id: Date.now(), role: 'me', content: key, wave: false })
  showKeyboard.value = false
}
  */

function newConversation() {
  // 新建会话对象
  if (typeof conversationStore.setCurrentConversationuuId === 'function') {
    conversationStore.setCurrentConversationuuId(null)
  } else {
    conversationStore.currentConversationuuId = null
  }
}

watch(
  () => assistantStore.currentAssistant,
  (val) => {
    if (val) {
      newConversation()
      conversationStore.setConfirmCreateConversation(true)
    }
  },
)

function toggleMute() {
  isMuted.value = !isMuted.value
}

// 消息列表变化时自动滚动到底部
watch(FirstMessages, () => {
  scrollToBottom()
})

watch(isThinking, (val) => {
  if (val) scrollToBottom()
})

async function sendMessage() {
  const content = inputMessage.value.trim()
  if (!content) return

  if (!assistantStore.currentAssistant || !assistantStore.currentAssistant.uuid) {
    message.warning('请先在右侧选择或创建一个智能体')
    return
  }

  try {
    if (!wsClient) {
      await initWebSocketListener()
    }
    // 本地先追加一条用户消息
    FirstMessages.value.push({
      play_id: 'local-' + Date.now(),
      role: 0,
      content,
    })
    inputMessage.value = ''

    const msgType = isWebSearch.value ? 'web-search' : 'text'
    const msg: WsMessage = {
      type: msgType,
      data: content,
    }
    wsClient?.send(msg)

    isThinking.value = true
    scrollToBottom()
    // 激活等待提示与沉默追问
    waitingActive.value = true
    silenceActive.value = true
    silenceCount.value = 0
    resetSilenceTimer()
  } catch (e) {
    console.error('发送消息失败:', e)
    message.error('发送失败，请稍后重试')
    isThinking.value = false
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function toggleWebSearch() {
  isWebSearch.value = !isWebSearch.value
  if (isWebSearch.value) {
    // 联网搜索模式下，当前对话不再使用知识库
    selectedKnowledgeUuids.value = []
  }
}

const onImageSelect = async (e: Event) => {
  if (isWebSearch.value) {
    message.warning('联网搜索模式下暂不支持上传图片')
    return
  }
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return

  const file = files[0]
  try {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // 本地先展示一条图片消息（用户侧）
    FirstMessages.value.push({
      play_id: 'local-img-' + Date.now(),
      role: 0,
      content: '',
      img: base64Data,
    })

    if (!wsClient) {
      await initWebSocketListener()
    }

    const msg: WsMessage = {
      type: 'img',
      data: base64Data,
    }
    wsClient?.send(msg)
    isThinking.value = true
    scrollToBottom()
    waitingActive.value = true
    silenceActive.value = true
    silenceCount.value = 0
    resetSilenceTimer()
  } catch (error) {
    console.error('图片发送出错:', error)
    message.error('图片发送失败，请稍后重试')
    isThinking.value = false
  }
}

</script>

<style scoped>
.markdown-body {
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

:deep(.markdown-body p) {
  margin-bottom: 8px;
}

:deep(.markdown-body p:last-child) {
  margin-bottom: 0;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: bold;
  line-height: 1.25;
}

:deep(.markdown-body h1) { font-size: 1.5em; }
:deep(.markdown-body h2) { font-size: 1.3em; }
:deep(.markdown-body h3) { font-size: 1.1em; }

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 20px;
  margin-bottom: 8px;
}

:deep(.markdown-body ul) {
  list-style-type: disc;
}

:deep(.markdown-body ol) {
  list-style-type: decimal;
}

:deep(.markdown-body li) {
  margin-bottom: 4px;
}

:deep(.markdown-body code) {
  padding: 2px 4px;
  margin: 0;
  font-size: 85%;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
}

:deep(.markdown-body pre) {
  padding: 12px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin-bottom: 12px;
}

:deep(.markdown-body pre code) {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

:deep(.markdown-body blockquote) {
  padding: 0 1em;
  color: #656d76;
  border-left: 0.25em solid #d0d7de;
  margin-bottom: 12px;
}

:deep(.markdown-body table) {
  border-spacing: 0;
  border-collapse: collapse;
  margin-bottom: 12px;
  width: 100%;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  padding: 6px 13px;
  border: 1px solid #d0d7de;
}

:deep(.markdown-body table tr) {
  background-color: #ffffff;
  border-top: 1px solid #d0d7de;
}

:deep(.markdown-body table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}
</style>
