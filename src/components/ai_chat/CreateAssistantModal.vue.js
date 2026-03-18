/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from 'vue';
import { useAssistantStore } from '@/stores/assistant';
import { useKnowledgeStore } from '@/stores/konwledge';
import http from '@/api/http';
const assistantStore = useAssistantStore();
const knowledgeStore = useKnowledgeStore();
const localAssistant = ref({
    uuid: 'default-uuid',
    name: '',
    personality: '',
    desc: '',
    knowledge: [],
});
// 新建弹窗每次打开都重置表单
watch(() => assistantStore.showAddModal, (val) => {
    if (val) {
        Object.assign(localAssistant.value, {
            uuid: 'default-uuid',
            name: '',
            personality: '',
            desc: '',
            knowledge: [],
        });
    }
});
// 知识库多选弹窗
const showKnowledgeModal = ref(false);
const selectedKnowledgeUuids = ref([]);
function addKnowledge() {
    showKnowledgeModal.value = true;
    selectedKnowledgeUuids.value = localAssistant.value.knowledge.map((k) => k.uuid);
}
function handleKnowledgeOk() {
    localAssistant.value.knowledge = selectedKnowledgeUuids.value
        .map((uuid) => {
        const k = knowledgeStore.knowledges.find((item) => item.uuid === uuid);
        return k ? { uuid: k.uuid, name: k.name } : null;
    })
        .filter(Boolean);
    showKnowledgeModal.value = false;
}
function handleKnowledgeCancel() {
    showKnowledgeModal.value = false;
}
function onSave() {
    const newData = { ...localAssistant.value };
    if (!newData.name) {
        alert('请输入助手名称');
        return;
    }
    const newAssistant = {
        name: newData.name,
        personality: newData.personality || '',
        desc: newData.desc || '',
        knowledge: newData.knowledge,
    };
    http
        .createAISetting(newAssistant)
        .then((res) => {
        console.log('创建助手成功:', res);
        newData.uuid = res.uuid;
        assistantStore.assistants.push({ ...newData });
        Object.assign(assistantStore.newAssistant, {
            uuid: '',
            name: '',
            personality: '',
            desc: '',
            knowledge: [],
            history: [],
        });
        assistantStore.setShowAddModal(false);
    })
        .catch((err) => {
        console.error('创建助手失败:', err);
        alert('创建助手失败，请稍后重试');
    });
}
function onClose() {
    assistantStore.setShowAddModal(false);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fixed inset-0 z-[9999] bg-black bg-opacity-20 flex items-center justify-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white rounded-xl shadow-lg p-4 md:p-8 w-full max-w-md md:max-w-xl relative overflow-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.onClose) },
    ...{ class: "absolute top-4 right-4 text-gray-400 hover:text-gray-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "24",
    height: "24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18",
});
const __VLS_0 = {}.AModal;
/** @type {[typeof __VLS_components.AModal, typeof __VLS_components.aModal, typeof __VLS_components.AModal, typeof __VLS_components.aModal, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onOk': {} },
    ...{ 'onCancel': {} },
    open: (__VLS_ctx.showKnowledgeModal),
    title: "选择知识库",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onOk': {} },
    ...{ 'onCancel': {} },
    open: (__VLS_ctx.showKnowledgeModal),
    title: "选择知识库",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onOk: (__VLS_ctx.handleKnowledgeOk)
};
const __VLS_8 = {
    onCancel: (__VLS_ctx.handleKnowledgeCancel)
};
__VLS_3.slots.default;
const __VLS_9 = {}.ASelect;
/** @type {[typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    value: (__VLS_ctx.selectedKnowledgeUuids),
    mode: "multiple",
    ...{ style: {} },
    placeholder: "请选择知识库",
}));
const __VLS_11 = __VLS_10({
    value: (__VLS_ctx.selectedKnowledgeUuids),
    mode: "multiple",
    ...{ style: {} },
    placeholder: "请选择知识库",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.knowledgeStore.knowledges))) {
    const __VLS_13 = {}.ASelectOption;
    /** @type {[typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        key: (item.uuid),
        value: (item.uuid),
    }));
    const __VLS_15 = __VLS_14({
        key: (item.uuid),
        value: (item.uuid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    (item.name);
    var __VLS_16;
}
var __VLS_12;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-xl font-bold mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block font-semibold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ class: "w-full border-2 border-blue-200 rounded-lg p-4 focus:outline-none focus:border-blue-400 text-gray-700 bg-white" },
    placeholder: "请输入机器人名称",
});
(__VLS_ctx.localAssistant.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block font-semibold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    value: (__VLS_ctx.localAssistant.personality),
    ...{ class: "w-full min-h-[60px] border-2 border-blue-200 rounded-lg p-4 focus:outline-none focus:border-blue-400 resize-none text-gray-700 bg-white" },
    placeholder: "请输入机器人的人设描述",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "block font-semibold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    value: (__VLS_ctx.localAssistant.desc),
    ...{ class: "w-full min-h-[60px] border-2 border-blue-200 rounded-lg p-4 focus:outline-none focus:border-blue-400 resize-none text-gray-700 bg-white" },
    placeholder: "请输入机器人简介",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end mt-8 gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.onClose) },
    type: "button",
    ...{ class: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.onSave) },
    type: "button",
    ...{ class: "px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" },
});
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[9999]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-w-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[60px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[60px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            knowledgeStore: knowledgeStore,
            localAssistant: localAssistant,
            showKnowledgeModal: showKnowledgeModal,
            selectedKnowledgeUuids: selectedKnowledgeUuids,
            handleKnowledgeOk: handleKnowledgeOk,
            handleKnowledgeCancel: handleKnowledgeCancel,
            onSave: onSave,
            onClose: onClose,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
