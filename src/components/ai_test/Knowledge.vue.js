/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import '@/assets/theme.css';
import { computed } from 'vue';
import { useKnowledgeStore } from '@/stores/konwledge';
import { useKonwledgeTestStore } from '@/stores/konwledgeTest';
const knowledgeStore = useKnowledgeStore();
const konwledgeTestStore = useKonwledgeTestStore();
const selectedKnowledgeUuids = computed({
    get: () => konwledgeTestStore.selectedKnowledgeUuids,
    set: (v) => konwledgeTestStore.setSelectedKnowledgeUuids(v),
});
const knowledgeOptions = computed(() => knowledgeStore.knowledges.map((k) => ({ label: k.name, value: k.uuid })));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-[var(--theme-body)] shadow-[0_4px_24px_0_rgba(96,165,250,0.08),0_1.5px_6px_0_rgba(59,130,246,0.06)] border-[1.5px] w-full h-full max-w-none min-h-0 p-8 box-border flex flex-col rounded-2xl justify-start border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-lg font-extrabold text-gray-800 tracking-wide" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-xs text-blue-400 ml-2 font-medium" },
});
const __VLS_0 = {}.ASelect;
/** @type {[typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    value: (__VLS_ctx.selectedKnowledgeUuids),
    mode: "multiple",
    ...{ style: {} },
    placeholder: "选择知识库",
    options: (__VLS_ctx.knowledgeOptions),
    ...{ class: "ml-4" },
}));
const __VLS_2 = __VLS_1({
    value: (__VLS_ctx.selectedKnowledgeUuids),
    mode: "multiple",
    ...{ style: {} },
    placeholder: "选择知识库",
    options: (__VLS_ctx.knowledgeOptions),
    ...{ class: "ml-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4 flex flex-col gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between bg-white/50 rounded-xl px-6 py-4 cursor-pointer shadow-[0_1px_4px_0_rgba(96,165,250,0.06)] transition-all hover:from-[#bae6fd] hover:to-[#dbeafe] hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-semibold text-gray-700 text-base" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "icon" },
    viewBox: "0 0 1024 1024",
    width: "20",
    height: "20",
    fill: "#60a5fa",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M384 192.512l320.512 320.512-320.512 320.512z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between rounded-xl bg-white/50 px-6 py-4 cursor-pointer shadow-[0_1px_4px_0_rgba(96,165,250,0.06)] transition-all hover:from-[#bae6fd] hover:to-[#dbeafe] hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-semibold text-gray-700 text-base" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "icon" },
    viewBox: "0 0 1024 1024",
    width: "20",
    height: "20",
    fill: "#60a5fa",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M384 192.512l320.512 320.512-320.512 320.512z",
});
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-body)]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_4px_24px_0_rgba(96,165,250,0.08),0_1.5px_6px_0_rgba(59,130,246,0.06)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-none']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['box-border']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_1px_4px_0_rgba(96,165,250,0.06)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-[#bae6fd]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-[#dbeafe]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_1px_4px_0_rgba(96,165,250,0.06)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-[#bae6fd]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-[#dbeafe]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            selectedKnowledgeUuids: selectedKnowledgeUuids,
            knowledgeOptions: knowledgeOptions,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
