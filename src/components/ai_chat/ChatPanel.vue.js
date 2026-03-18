/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useAssistantStore } from '@/stores/assistant';
import { useConversationStore } from '@/stores/conversation';
import { Conversation, LlmSetting, Message, WsMessage } from '@/types/request';
import WebsocketClient from '@/api/websocket';
import { useUserStore } from '@/stores/user';
import http from '@/api/http';
import FetchUtil from '@/api/http';
import { useTempAiSetting } from '../../stores/globalStore';
import { useKnowledgeStore } from '@/stores/konwledge';
import {message} from "ant-design-vue";
const knowledgeStore = useKnowledgeStore();
const selectedKnowledgeUuids = ref([]);
const knowledgeOptions = computed(() => knowledgeStore.knowledges.map((k) => ({ label: k.name, value: k.uuid })));
function onKnowledgeChange(val) {
    selectedKnowledgeUuids.value = val;
    // 这里selectedKnowledgeUuids就是所选KnowledgeItem的uuid数组
    // 可在此处做后续处理
}
const assistantStore = useAssistantStore();
const conversationStore = useConversationStore();
const recording = ref(false);
const showKeyboard = ref(false);
const showDeleteMsgModal = ref(false);
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const msgListRef = ref(null);
const isMuted = ref(false);
const isWebRTCConnected = ref(false);
let peerConnection = null;
let localStream = null;
const tempAiSetting = useTempAiSetting();
let currentAIMessage = null;
let currentMyMessage = null;
const FirstMessages = ref([]);
const SecondMessages = ref([]);
// 监听当前会话ID变化，自动加载对应消息
watch(() => conversationStore.currentConversationId, async (uuid) => {
    FirstMessages.value = [];
    if (!uuid)
        return;
    // 查找会话对象
    const conv = conversationStore.conversations.find((c) => c.uuid === uuid);
    if (conv && conv.messages && conv.messages.length > 0) {
        // 直接显示本地缓存的消息
        FirstMessages.value = conv.messages.map((msg) => ({
            play_id: msg.uuid,
            role: msg.role,
            content: msg.content,
        }));
    }
    else {
        // 若本地无消息，尝试从后端获取
        try {
            const messages = await http.getConversationMessages(uuid);
            FirstMessages.value = messages.map((msg) => ({
                play_id: msg.uuid,
                role: msg.role,
                content: msg.content,
            }));
        }
        catch (e) {
            // 获取失败则显示空
            FirstMessages.value = [];
        }
    }
    scrollToBottom();
}, { immediate: true });
// 定义音频播放器
const audioElement = ref(null);
onMounted(async () => {
    audioElement.value = document.createElement('audio');
    document.body.appendChild(audioElement.value);
    console.log('音频播放器初始化');
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
});
// 欢迎语只在消息为空时显示，不存入 Pinia
let mediaRecorder = null;
let audioChunks = [];
let currentStream = null;
const isStreamInterrupted = ref(false);
function confirmDeleteMessages() {
    // 清空当前会话消息
    http.deleteConversation(conversationStore.currentConversationId).catch((error) => {
        console.log(error);
        return;
    });
    console.log(conversationStore.currentConversationId);
    const conv = conversationStore.conversations.find((c) => c.uuid === conversationStore.currentConversationId);
    console.log('conv', conversationStore.currentConversationId);
    if (conv) {
        conv.messages = [];
        conv.title = '已经被清空';
    }
    FirstMessages.value = [];
    showDeleteMsgModal.value = false;
}
async function startVoice() {
    console.log(selectedKnowledgeUuids.value);
    recording.value = true;
    try {
        await initWebSocketListener();
        await startWebRTC();
    }
    catch (error) {
        console.error('启动语音通话出错:', error);
        stopWebRTC();
        return;
    }
    isStreamInterrupted.value = true;
    isStreamInterrupted.value = false;
    FirstMessages.value.push(currentMyMessage);
    FirstMessages.value.push(currentAIMessage);
}
let wsClient = null;
function closeDeleteMsgModal() {
    showDeleteMsgModal.value = false;
}
async function stopVoice() {
    recording.value = false;
    WebsocketClient.getInstance().close();
    stopWebRTC();
    toggleMute();
    await http.listConversations(1, 20).then(async (res) => {
        console.log(res);
        const conversation = {
            uuid: res[0].uuid,
            title: '',
            user_id: useUserStore().user.id,
            setting_id: 0,
            messages: [],
        };
        await http
            .getConversationMessages(conversation.uuid)
            .then((res) => {
            console.log(res);
            if (res && res.length > 0 && res[0].content) {
                conversation.title = res[0].content;
            }
            else {
                conversation.title = '未命名标题';
            }
            if (res && Array.isArray(res)) {
                res.forEach((message) => {
                    conversation.messages.push(message);
                });
            }
            else {
                console.warn('No messages received or invalid response format');
            }
        })
            .catch((err) => {
            console.error('获取消息失败:', err);
        });
        useConversationStore().addConversation(conversation);
    });
    conversationStore.setConfirmCreateConversation(false);
    console.log(conversationStore.getConfirmConversation);
}
// 当前正在接受ai消息的对象
const initWebSocketListener = () => {
    return new Promise((resolve) => {
        wsClient = WebsocketClient.getInstance();
        const ws = wsClient.getWsConnection();
        ws.onopen = () => {
            console.log('连接成功');
            // 连接成功后，发送 ping 消息
            wsClient.interval = setInterval(() => {
                wsClient.ping();
            }, 20000);
            let settingData = {
                prompt_text: '',
                prompt_uuid: assistantStore.currentAssistant.uuid,
                namespace_uuid: selectedKnowledgeUuids.value,
            };
            let settingMsg = {
                type: 'setting',
                data: JSON.stringify(settingData),
            };
            console.log('发送设定', settingMsg);
            wsClient.send(settingMsg);
            // 连接成功后 resolve
            resolve(true);
        };
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log('收到消息', msg);
            switch (msg.type) {
                case 'pong': {
                    console.log('websocket 连接正常------------');
                    break;
                }
                case 'stop': {
                    clearInterval(interval);
                    ws.close();
                    break;
                }
                case 'webrtc-answer': {
                    handleAnswer(msg.data.sdp);
                    break;
                }
                case 'llmConv': {
                    // 处理 llmConv 消息
                    if (msg.data.role == 1) {
                        // AI消息
                        if (!currentAIMessage || currentAIMessage.play_id !== msg.data.play_id) {
                            currentAIMessage = {
                                play_id: msg.data.play_id,
                                role: 1,
                                content: msg.data.content,
                            };
                            FirstMessages.value.push(currentAIMessage);
                        }
                        else if (!isStreamInterrupted.value && currentAIMessage) {
                            currentAIMessage.content += msg.data.content;
                            FirstMessages.value = [...FirstMessages.value];
                        }
                    }
                    if (msg.data.role == 0) {
                        // 用户消息
                        if (!currentMyMessage || currentMyMessage.play_id !== msg.data.play_id) {
                            currentMyMessage = {
                                play_id: msg.data.play_id,
                                role: 0,
                                content: msg.data.content,
                            };
                            FirstMessages.value.push(currentMyMessage);
                        }
                        else if (!isStreamInterrupted.value && currentMyMessage) {
                            currentMyMessage.content += msg.data.content;
                            FirstMessages.value = [...FirstMessages.value];
                        }
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        };
    });
};
const startWebRTC = async () => {
    try {
        // 本地媒体流
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        let iceServers = [];
        // 获取iceservers
        try {
            const res = await FetchUtil.getIceUrl();
            const res2 = await fetch(res.iceUrl);
            iceServers = await res2.json();
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Failed to get ICE servers:', error.message);
            }
        }
        peerConnection = new RTCPeerConnection({
            iceServers: iceServers,
        });
        // 将本地媒体流添加到对等连接
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                peerConnection?.addTrack(track, localStream);
            });
        }
        else {
            console.error('未获取到本地音频流，请检查麦克风权限或设备状态');
            return;
        }
        // ICE候选
        // peerConnection.onicecandidate = (event) => {
        //   console.log('icecandidate', event)
        // }
        // 收到音频的回调函数
        peerConnection.ontrack = (event) => {
            console.log('Received remote stream', event.streams[0]);
            if (event.streams[0] && audioElement.value) {
                audioElement.value.srcObject = event.streams[0];
                // 尝试播放音频，处理可能的错误
                audioElement.value.play().catch((error) => {
                    console.error('音频自动播放失败:', error);
                    // 可以提示用户手动播放音频
                    console.log('请手动触发播放音频');
                });
            }
        };
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        // 发送offer消息到后端
        let offerMsg = {
            type: 'webrtc-offer',
            data: peerConnection.localDescription?.sdp,
        };
        wsClient?.send(offerMsg);
        isWebRTCConnected.value = true;
    }
    catch (error) {
        console.error('WebRTC error:', error);
    }
};
// 处理 answer
async function handleAnswer(sdp) {
    if (!peerConnection)
        return;
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
    }
    catch (error) {
        console.error('Error handling answer:', error);
    }
}
const stopWebRTC = () => {
    if (peerConnection) {
        // 关闭 RTCPeerConnection 实例
        peerConnection.close();
        peerConnection = null;
        isWebRTCConnected.value = false;
    }
    if (localStream) {
        // 停止本地媒体流的所有轨道
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
        localStream = null;
    }
    if (audioElement.value) {
        // 停止播放音频并释放资源
        audioElement.value.pause();
        audioElement.value.srcObject = null;
        audioElement.value = null;
    }
    // 停止录音
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        audioChunks = [];
    }
};
onUnmounted(() => {
    stopWebRTC();
});
function scrollToBottom() {
    nextTick(() => {
        if (msgListRef.value) {
            msgListRef.value.scrollTop = msgListRef.value.scrollHeight;
        }
    });
}
/*

function quickInput(key: string) {
  Message.value.push({ id: Date.now(), role: 'me', content: key, wave: false })
  showKeyboard.value = false
}
  */
function newConversation() {
    // 新建会话对象
    const conversation = {
        uuid: '',
        title: '新会话',
        user_id: useUserStore().user.uuid,
        setting_id: 0,
        messages: [],
    };
    // 添加到会话列表
    if (typeof conversationStore.setCurrentConversation === 'function') {
        conversationStore.setCurrentConversation(conversation.uuid);
    }
    else {
        conversationStore.currentConversationId = conversation.uuid;
    }
}
watch(() => assistantStore.currentAssistant, (val, oldVal) => {
    if (val) {
        newConversation();
        conversationStore.setConfirmCreateConversation(true);
        console.log(conversationStore.getConfirmConversation);
    }
});
function toggleMute() {
    isMuted.value = !isMuted.value;
    if (localStream) {
        localStream.getAudioTracks().forEach((track) => {
            track.enabled = !isMuted.value;
        });
    }
}
// 消息列表变化时自动滚动到底部
watch(FirstMessages, () => {
    scrollToBottom();
});
async function onImageSelect(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        const file = files[0];
        // 这里可以后续处理图片文件
        console.log('选择的图片文件:', file.name);
        try {
            await initWebSocketListener();
        }
        catch (error) {
            console.error('WebSocket 初始化失败:', error);
            return;
        }
        isStreamInterrupted.value = true;
        isStreamInterrupted.value = false;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const binaryData = new Uint8Array(arrayBuffer);
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            console.log('发送图片文件:', base64Data);
            const msg = {
                type: 'text',
                data: '你好',
            };
            WebsocketClient.getInstance().send(msg);
        }
        catch (error) {
            console.error('AI 响应出错:', error);
        }
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-full h-full flex flex-col rounded-xl shadow" },
});
if (!__VLS_ctx.conversationStore.getConfirmConversation) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col w-full h-full max-w-full mx-auto theme-bg rounded-xl p-4 md:p-8" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "msgListRef",
        ...{ class: "flex-1 mb-2 overflow-y-auto w-full min-h-[200px] max-h-[60vh]" },
    });
    /** @type {typeof __VLS_ctx.msgListRef} */ ;
    if (__VLS_ctx.FirstMessages.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center text-gray-400 mt-10" },
        });
    }
    for (const [msg, index] of __VLS_getVForSourceType((__VLS_ctx.FirstMessages.filter((m) => m)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: (msg.role === 1 ? 'justify-start' : 'justify-end') },
            ...{ class: "flex mb-3 mt-2 items-center flex-wrap" },
        });
        if (msg.role === 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-bold mr-2 theme-main" },
            });
            (__VLS_ctx.assistantStore.currentAssistant &&
                __VLS_ctx.assistantStore.currentAssistant.name &&
                __VLS_ctx.assistantStore.currentAssistant.name.trim()
                ? __VLS_ctx.assistantStore.currentAssistant.name
                : '机器人助手');
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (msg.role === 1 ? 'theme-msg-ai' : 'theme-msg-me') },
            ...{ class: "inline-block px-3 py-2 rounded-lg break-words max-w-full md:max-w-[700px]" },
        });
        (msg.content);
        if (msg.role === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-bold ml-2 theme-main" },
            });
        }
        if (msg.wave) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-end h-8 ml-2" },
            });
            for (const [i] of __VLS_getVForSourceType((20))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (i),
                    ...{ style: ({ height: Math.random() * 20 + 10 + 'px' }) },
                    ...{ class: "w-[3px] bg-purple-400 mr-[2px] rounded" },
                });
            }
        }
    }
}
if (__VLS_ctx.conversationStore.getConfirmConversation) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col w-full h-full max-w-full mx-auto theme-bg rounded-xl p-4 md:p-8" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "border-b border-gray-200 pb-2 flex items-center justify-between mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2 flex-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-bold text-lg" },
    });
    (__VLS_ctx.assistantStore.currentAssistant &&
        __VLS_ctx.assistantStore.currentAssistant.name &&
        __VLS_ctx.assistantStore.currentAssistant.name.trim()
        ? __VLS_ctx.assistantStore.currentAssistant.name
        : '未命名机器人');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-2 text-xs text-gray-500" },
    });
    (__VLS_ctx.assistantStore.currentAssistant &&
        __VLS_ctx.assistantStore.currentAssistant.desc &&
        __VLS_ctx.assistantStore.currentAssistant.desc.trim()
        ? __VLS_ctx.assistantStore.currentAssistant.desc
        : '');
    const __VLS_0 = {}.ASelect;
    /** @type {[typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.selectedKnowledgeUuids),
        mode: "multiple",
        ...{ style: {} },
        placeholder: "选择知识库",
        options: (__VLS_ctx.knowledgeOptions),
        ...{ class: "ml-2" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onChange': {} },
        value: (__VLS_ctx.selectedKnowledgeUuids),
        mode: "multiple",
        ...{ style: {} },
        placeholder: "选择知识库",
        options: (__VLS_ctx.knowledgeOptions),
        ...{ class: "ml-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onChange: (__VLS_ctx.onKnowledgeChange)
    };
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "msgListRef",
        ...{ class: "flex-1 mb-2 overflow-y-auto w-full min-h-[200px] max-h-[60vh]" },
    });
    /** @type {typeof __VLS_ctx.msgListRef} */ ;
    if (__VLS_ctx.FirstMessages.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center text-gray-400 mt-10" },
        });
    }
    for (const [msg, index] of __VLS_getVForSourceType((__VLS_ctx.FirstMessages.filter((m) => m)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: (msg.role === 1 ? 'justify-start' : 'justify-end') },
            ...{ class: "flex mb-3 mt-2 items-center flex-wrap" },
        });
        if (msg.role === 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-bold mr-2 theme-main" },
            });
            (__VLS_ctx.assistantStore.currentAssistant &&
                __VLS_ctx.assistantStore.currentAssistant.name &&
                __VLS_ctx.assistantStore.currentAssistant.name.trim()
                ? __VLS_ctx.assistantStore.currentAssistant.name
                : '机器人助手');
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (msg.role === 1 ? 'theme-msg-ai' : 'theme-msg-me') },
            ...{ class: "inline-block px-3 py-2 rounded-lg break-words max-w-full md:max-w-[700px]" },
        });
        (msg.content);
        if (msg.role === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-bold ml-2 theme-main" },
            });
        }
        if (msg.wave) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-end h-8 ml-2" },
            });
            for (const [i] of __VLS_getVForSourceType((20))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (i),
                    ...{ style: ({ height: Math.random() * 20 + 10 + 'px' }) },
                    ...{ class: "w-[3px] bg-purple-400 mr-[2px] rounded" },
                });
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap items-center gap-4 justify-center w-full mt-auto" },
    });
    if (!__VLS_ctx.recording) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.startVoice) },
            ...{ class: "bg-white/50 border border-purple-400 shadow px-2 py-2 rounded bottom-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: "lucide lucide-phone-icon lucide-phone" },
            fill: "none",
            height: "32",
            stroke: "#a259ff",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            viewBox: "0 0 24 24",
            width: "32",
            xmlns: "http://www.w3.org/2000/svg",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        });
    }
    if (__VLS_ctx.recording) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.toggleMute) },
            ...{ style: ({ background: __VLS_ctx.isMuted ? '#ff4d4f' : '#fff' }) },
            ...{ class: "bg-white/50 border border-purple-400 shadow px-2 py-2 rounded" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            stroke: (__VLS_ctx.isMuted ? '#fff' : '#a259ff'),
            ...{ class: "lucide lucide-mic-off-icon lucide-mic-off" },
            fill: "none",
            height: "32",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            viewBox: "0 0 24 24",
            width: "32",
            xmlns: "http://www.w3.org/2000/svg",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
            x1: "2",
            x2: "22",
            y1: "2",
            y2: "22",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M18.89 13.23A7.12 7.12 0 0 0 19 12v-2",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M5 10v2a7 7 0 0 0 12 5",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M15 9.34V5a3 3 0 0 0-5.68-1.33",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M9 9v3a3 3 0 0 0 5.12 2.12",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
            x1: "12",
            x2: "12",
            y1: "19",
            y2: "22",
        });
    }
    if (__VLS_ctx.recording) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.stopVoice) },
            ...{ class: "bg-white/50 border border-purple-400 shadow px-2 py-2 rounded" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: "lucide lucide-phone-off-icon lucide-phone-off" },
            fill: "none",
            height: "32",
            stroke: "#ff4d4f",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            viewBox: "0 0 24 24",
            width: "32",
            xmlns: "http://www.w3.org/2000/svg",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M22 2 2 22",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473",
        });
    }
    if (__VLS_ctx.recording) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.conversationStore.getConfirmConversation))
                        return;
                    if (!(__VLS_ctx.recording))
                        return;
                    __VLS_ctx.showKeyboard = true;
                } },
            ...{ class: "bg-white/50 border border-purple-400 shadow px-2 py-2 rounded" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            fill: "none",
            height: "32",
            stroke: "#a259ff",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            viewBox: "0 0 24 24",
            width: "32",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "6",
            cy: "6",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "12",
            cy: "6",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "18",
            cy: "6",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "6",
            cy: "12",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "12",
            cy: "12",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "18",
            cy: "12",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "6",
            cy: "18",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "12",
            cy: "18",
            r: "1.3",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "18",
            cy: "18",
            r: "1.3",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "bg-white/50 border border-purple-400 shadow px-2 py-2 rounded cursor-pointer flex items-center" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: (__VLS_ctx.onImageSelect) },
        accept: "image/*",
        ...{ class: "hidden" },
        type: "file",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "flex items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "icon" },
        height: "28",
        t: "1753505710750",
        version: "1.1",
        viewBox: "0 0 1024 1024",
        width: "28",
        xmlns: "http://www.w3.org/2000/svg",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M995.072 755.72736c-0.03072-3.85024-1.28-38.95808-32.256-81.11104l-25.44128-35.5328-123.52512-194.23232c-2.432-3.456-60.61056-84.83328-141.2864-75.40224-62.40256 7.30624-102.91712 66.26816-149.06368 175.27296-34.14528 80.72192-66.7904 125.61408-96.96768 133.51424-30.40256 7.93088-50.43712-20.98176-90.40384-54.48704l-6.016-5.02272c-42.40384-35.43552-78.8224-43.91424-118.1184-27.5712-34.816 14.48448-56.70912 48.28672-111.68768 105.64608a24.39168 24.39168 0 0 0-0.32256 32.95232 21.0944 21.0944 0 0 0 15.42144 6.99904 21.0432 21.0432 0 0 0 15.55968-6.67136c105.5744-110.08512 117.2224-120.56064 172.07296-74.71616l5.95456 4.992c46.94528 39.31648 76.7744 76.47744 127.94368 63.13472 23.07584-6.00576 44.35456-21.72928 65.1264-48.0256 20.54656-26.0352 40.61184-62.54592 61.37856-111.62112 38.69184-91.45344 68.51584-142.67904 113.70496-148.06528 55.71584-6.656 101.19168 56.38144 101.66784 57.06752l123.6224 194.42688 25.6 35.72736a0.9216 0.9216 0 0 1 0.15872 0.2304c21.18656 28.77952 22.912 51.06176 23.04 53.27872l0.45056 117.4272c0 44.24192-33.85856 80.26112-75.45856 80.26112H341.74976l-231.08608-0.52224c-38.17984-4.60288-66.85184-38.69696-66.85184-79.744V213.71904c0-44.24192 33.85856-80.26112 75.45856-80.26112h470.912v-46.56128H119.2704C53.50912 86.89664 0 143.80032 0 213.74976v660.1216c0 31.64672 11.03872 61.99296 31.04256 85.38624 19.40992 22.99392 46.67392 37.59616 76.2624 40.84736 0.71168 0.06656 1.42848 0.09728 2.14528 0.09728l232.2688 0.52224h534.56384c65.7664 0 119.2704-56.90368 119.2704-126.95552l-0.45056-117.88288-0.03072-0.15872zM188.26752 361.81504c0 53.05344 43.04384 96.22016 95.94368 96.22016s95.94368-43.16672 95.94368-96.22016-43.04384-96.22016-95.94368-96.22016-95.94368 43.16672-95.94368 96.22016z m145.38752 0c0 27.3408-22.21056 49.62816-49.47456 49.62816s-49.47456-22.25152-49.47456-49.62816c0-27.3408 22.17984-49.62816 49.47456-49.62816s49.47456 22.25664 49.47456 49.62816z m524.83072-168.87808V23.2704h-45.37856v169.66144h-165.51424v46.26432h165.51424v169.66144h45.37856V239.20128H1024v-46.26432h-165.51424z",
        fill: "#515151",
    });
}
if (__VLS_ctx.showKeyboard) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/50 rounded-xl shadow-lg p-8 z-[1000] min-w-[320px]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-lg font-bold mb-4 text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-3 gap-3 mt-3" },
    });
    for (const [key] of __VLS_getVForSourceType((__VLS_ctx.keys))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showKeyboard))
                        return;
                    __VLS_ctx.quickInput(key);
                } },
            key: (key),
            ...{ class: "w-[60px] h-[60px] text-2xl rounded-full border border-purple-400 bg-white text-purple-400 cursor-pointer" },
        });
        (key);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showKeyboard))
                    return;
                __VLS_ctx.showKeyboard = false;
            } },
        ...{ class: "mt-5 py-2 px-5 bg-gray-200 rounded w-full text-base hover:bg-blue-100 transition" },
    });
}
if (__VLS_ctx.showDeleteMsgModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white/50 rounded-lg shadow-lg p-6 min-w-[320px]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-lg mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex gap-4 justify-end" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeDeleteMsgModal) },
        ...{ class: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.confirmDeleteMessages) },
        ...{ class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" },
    });
}
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[200px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[60vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-main']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-w-[700px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-main']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-[2px]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[200px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[60vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-main']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-w-[700px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-main']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-[2px]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide-phone-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide-phone']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide-mic-off-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide-mic-off']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide-phone-off-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['lucide-phone-off']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[1000]']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[320px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[60px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[60px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[320px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            selectedKnowledgeUuids: selectedKnowledgeUuids,
            knowledgeOptions: knowledgeOptions,
            onKnowledgeChange: onKnowledgeChange,
            assistantStore: assistantStore,
            conversationStore: conversationStore,
            recording: recording,
            showKeyboard: showKeyboard,
            showDeleteMsgModal: showDeleteMsgModal,
            keys: keys,
            msgListRef: msgListRef,
            isMuted: isMuted,
            FirstMessages: FirstMessages,
            confirmDeleteMessages: confirmDeleteMessages,
            startVoice: startVoice,
            closeDeleteMsgModal: closeDeleteMsgModal,
            stopVoice: stopVoice,
            toggleMute: toggleMute,
            onImageSelect: onImageSelect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
