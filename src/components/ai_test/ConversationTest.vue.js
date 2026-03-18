/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import '@/assets/theme.css';
import { ref, watch } from 'vue';
import WebsocketClient from '@/api/websocket';
import { LlmSetting, WsMessage } from '@/types/request';
import { LlmMsg } from '@/types/response';
import { marked } from 'marked';
import { useTempAiSetting } from '../../stores/globalStore';
import { useConversationStore } from '../../stores/conversation';
import { useKonwledgeTestStore } from '@/stores/konwledgeTest';
// 存储对话消息
const messages = ref([]);
// 存储用户输入内容
const inputMessage = ref('');
// 消息容器
const messageContainer = ref(null);
// 用于控制是否终端流式响应
const isStreamInterrupted = ref(false);
// 当前正在接受ai消息的对象
let currentAIMessage = null;
// ai临时设定
const tempAiSetting = useTempAiSetting();
let isInit = false;
//
function onDocClick() {
    WebsocketClient.getInstance().close();
    isInit = false;
    messages.value = [];
    inputMessage.value = '';
    currentAIMessage = null;
}
const initWebSocketListener = () => {
    return new Promise((resolve) => {
        const wsClient = WebsocketClient.getInstance();
        const ws = wsClient.getWsConnection();
        const ts = [];
        useKonwledgeTestStore().getTestData.forEach((item) => {
            ts.push(...item);
        });
        ws.onopen = () => {
            console.log('连接成功');
            // 连接成功后，发送 ping 消息
            wsClient.interval = setInterval(() => {
                wsClient.ping();
            }, 20000);
            let settingData = {
                prompt_text: tempAiSetting.getValue(),
                prompt_uuid: '',
                namespace_uuid: ts,
            };
            console.log('发送设定hhhhhh', settingData.namespace_uuid);
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
                    ws.close();
                    break;
                }
                case 'llmConv': {
                    if (currentAIMessage && !isStreamInterrupted.value) {
                        const llmMsg = msg.data;
                        if (llmMsg.type === 'end') {
                            // 收到结束消息，重置当前 AI 消消息对象
                            currentAIMessage = null;
                        }
                        else {
                            // 追加消息
                            currentAIMessage.content += llmMsg.content;
                            // 关键：强制触发响应式更新
                            messages.value = [...messages.value];
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
//修改这个部分的代码xianget instance,ranhou diaoyong close
const sendMessage = async () => {
    console.log(useKonwledgeTestStore().getTestData);
    if (!isInit) {
        try {
            // 等待 WebSocket 连接成功
            await initWebSocketListener();
            isInit = true;
        }
        catch (error) {
            console.error('WebSocket 初始化失败:', error);
            return;
        }
    }
    // 打断之前的流式响应
    isStreamInterrupted.value = true;
    isStreamInterrupted.value = false;
    currentAIMessage = null;
    const userMessage = inputMessage.value.trim();
    if (userMessage) {
        // 添加用户消息到消息列表
        messages.value.push({ role: 'user', content: userMessage });
        inputMessage.value = '';
        try {
            const msg = {
                type: 'text',
                data: userMessage,
            };
            WebsocketClient.getInstance().send(msg);
            // 先添加一个空的 AI 消息
            currentAIMessage = { role: 'ai', content: '' };
            messages.value.push(currentAIMessage);
        }
        catch (error) {
            console.error('AI 响应出错:', error);
            messages.value.push({ role: 'ai', content: '抱歉，暂时无法响应，请稍后再试。' });
        }
    }
};
// 处理回车键发送消息
const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
        useConversationStore().setConfirmCreateConversation(true);
    }
};
watch(messages, () => {
    // 延迟执行，确保 DOM 已经更新
    setTimeout(() => {
        if (messageContainer.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
    }, 0);
}, { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border-gray-400 bg-white/50 h-full max-h-screen flex flex-col overflow-hidden justify-start" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "flex justify-between items-center px-6 py-3 border-b-[1.5px] border-[#e0e7ef]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-xl font-bold text-black tracking-wide border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.onDocClick) },
    ...{ class: "flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow-lg hover:bg-red-300 transition border border-gray-200 backdrop-blur-sm" },
    title: "清空对话",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "icon" },
    viewBox: "0 0 1024 1024",
    width: "22",
    height: "22",
    fill: "#60a5fa",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M861.184 192.512q30.72 0 50.688 10.24t31.744 25.6 16.384 33.28 4.608 33.28q0 7.168-0.512 11.264t-0.512 7.168l0 6.144-67.584 0 0 537.6q0 20.48-8.192 39.424t-23.552 33.28-37.376 23.04-50.688 8.704l-456.704 0q-26.624 0-50.176-8.192t-40.448-23.04-26.624-35.84-9.728-47.616l0-527.36-63.488 0q-1.024-1.024-1.024-5.12-1.024-5.12-1.024-31.744 0-13.312 6.144-29.696t18.432-30.208 31.744-23.04 46.08-9.216l91.136 0 0-62.464q0-26.624 18.432-45.568t45.056-18.944l320.512 0q35.84 0 49.664 18.944t13.824 45.568l0 63.488q21.504 1.024 46.08 1.024l47.104 0zM384 192.512l320.512 0 0-64.512-320.512 0 0 64.512zM352.256 840.704q32.768 0 32.768-41.984l0-475.136-63.488 0 0 475.136q0 21.504 6.656 31.744t24.064 10.24zM545.792 839.68q17.408 0 23.552-9.728t6.144-31.232l0-475.136-63.488 0 0 475.136q0 40.96 33.792 40.96zM738.304 837.632q18.432 0 24.576-9.728t6.144-31.232l0-473.088-64.512 0 0 473.088q0 40.96 33.792 40.96z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ref: "messageContainer",
    ...{ class: "flex-1 overflow-y-auto px-6 py-4" },
});
/** @type {typeof __VLS_ctx.messageContainer} */ ;
for (const [msg, index] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "flex my-3" },
    });
    if (msg.role === 'ai') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-gradient-to-r from-[#e0e7ef] to-[#f0f9ff] text-[#2563eb] rounded-[1.25rem_1.25rem_1.25rem_0.25rem] px-5 py-4 max-w-[70%] shadow-[0_2px_8px_0_rgba(96,165,250,0.08)] text-base border-[1.5px] border-[#bfcdec] break-words overflow-wrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.marked(msg.content)) }, null, null);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-gradient-to-r from-[#bae6fd] to-[#dbeafe] text-[#2563eb] rounded-[1.25rem_1.25rem_0.25rem_1.25rem] px-5 py-4 max-w-[70%] shadow-[0_2px_8px_0_rgba(96,165,250,0.08)] text-base border-[1.5px] border-[#60a5fa] break-words overflow-wrap ml-auto" },
        });
        (msg.content);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-6 py-4 bg-gradient-to-t bg-white/70 relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative flex items-end" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    ...{ onKeypress: (__VLS_ctx.handleKeyPress) },
    value: (__VLS_ctx.inputMessage),
    ...{ class: "w-full min-h-[48px] max-h-[120px] px-4 py-3 rounded-lg border-[1.5px] border-[#bfcdec] text-base text-[#2563eb] shadow-[0_1px_4px_0_rgba(96,165,250,0.06)] transition-all resize-vertical focus:outline-none focus:border-[#60a5fa] focus:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]" },
    rows: "2",
    placeholder: "输入你的消息...",
    maxlength: (120),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.sendMessage) },
    ...{ class: "absolute bottom-3 right-2 bg-gradient-to-r from-[#bfcdec] to-[#b6cfed] text-white rounded-lg px-3 py-2 shadow-[0_2px_8px_0_rgba(96,165,250,0.08)] border-none transition-all flex items-center justify-center hover:from-[#a7c9f2] hover:to-[#adc2f1] hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/images/send.png",
    alt: "发送",
    ...{ class: "w-6 h-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute bottom-2 right-20 text-xs text-gray-500 select-none" },
});
(__VLS_ctx.inputMessage.length);
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#e0e7ef]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['my-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-[#e0e7ef]']} */ ;
/** @type {__VLS_StyleScopedClasses['to-[#f0f9ff]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#2563eb]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-[1.25rem_1.25rem_1.25rem_0.25rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[70%]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_2px_8px_0_rgba(96,165,250,0.08)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#bfcdec]']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-[#bae6fd]']} */ ;
/** @type {__VLS_StyleScopedClasses['to-[#dbeafe]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#2563eb]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-[1.25rem_1.25rem_0.25rem_1.25rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[70%]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_2px_8px_0_rgba(96,165,250,0.08)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#60a5fa]']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-t']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/70']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[48px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#bfcdec]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#2563eb]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_1px_4px_0_rgba(96,165,250,0.06)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-[#60a5fa]']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-3']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-[#bfcdec]']} */ ;
/** @type {__VLS_StyleScopedClasses['to-[#b6cfed]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_2px_8px_0_rgba(96,165,250,0.08)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-[#a7c9f2]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-[#adc2f1]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            marked: marked,
            messages: messages,
            inputMessage: inputMessage,
            messageContainer: messageContainer,
            onDocClick: onDocClick,
            sendMessage: sendMessage,
            handleKeyPress: handleKeyPress,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
