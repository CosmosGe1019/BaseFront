/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch } from 'vue';
import http from '../../api/http';
import { UpdateAISetting } from '@/types/request';
import { useAssistantStore } from '@/stores/assistant';
import { useKnowledgeStore } from '@/stores/konwledge';
const assistantStore = useAssistantStore();
const knowledgeStore = useKnowledgeStore();
const visible = ref(false);
watch(() => assistantStore.showEditKnowledge, (v) => (visible.value = v), { immediate: true });
// knowledge结构调整为 {uuid, name}
const localAssistant = ref({
    uuid: '',
    name: '',
    desc: '',
    personality: '',
    knowledge: [],
});
// 自动填充表单，desc=简介，personality=人设
watch(() => assistantStore.editingAssistant, (val) => {
    if (val) {
        localAssistant.value = {
            uuid: val.uuid,
            name: val.name,
            desc: val.desc || '',
            personality: val.personality || '',
            knowledge: Array.isArray(val.knowledge)
                ? val.knowledge.map((k) => typeof k === 'string'
                    ? {
                        uuid: k,
                        name: k,
                    }
                    : k)
                : [],
        };
    }
    else {
        localAssistant.value = { uuid: '', name: '', desc: '', personality: '', knowledge: [] };
    }
}, { immediate: true });
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
    const updateData = {
        uuid: localAssistant.value.uuid,
        name: localAssistant.value.name,
        desc: localAssistant.value.desc,
        personality: localAssistant.value.personality,
        knowledge: localAssistant.value.knowledge,
    };
    http
        .updateAISetting(updateData)
        .then((res) => {
        // 更新 pinia
        const idx = assistantStore.assistants.findIndex((a) => a.uuid === localAssistant.value.uuid);
        if (idx !== -1) {
            assistantStore.assistants[idx] = {
                ...assistantStore.assistants[idx],
                ...localAssistant.value,
            };
        }
        assistantStore.setShowEditKnowledge(false);
        assistantStore.setEditingAssistant(null);
    })
        .catch((err) => {
        console.error('请求失败:', err);
    });
}
function onClose() {
    assistantStore.setShowEditKnowledge(false);
    assistantStore.setEditingAssistant(null);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.visible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-xl p-4 md:p-6 overflow-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-base font-bold mb-4 flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.onClose) },
        ...{ class: "text-gray-400 hover:text-blue-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "18",
        height: "18",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "4",
        y1: "4",
        x2: "14",
        y2: "14",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "14",
        y1: "4",
        x2: "4",
        y2: "14",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
        value: (__VLS_ctx.localAssistant.personality),
        ...{ class: "w-full border border-gray-200 rounded p-3 mb-6 min-h-[80px] resize-none" },
        placeholder: "请输入人设描述",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-base font-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-xs text-gray-400 ml-2" },
    });
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-w-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[80px]']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            localAssistant: localAssistant,
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
