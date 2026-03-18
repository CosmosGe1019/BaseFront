import '@/assets/theme.css';
import { useTempAiSetting } from '../../stores/globalStore';
import { onMounted, ref, watch } from 'vue';
import Knowledge from './Knowledge.vue';
const tempAiSetting = useTempAiSetting();
const localText = ref(tempAiSetting.input);
const updateTempAiSetting = () => {
    tempAiSetting.setValue(localText.value);
    console.log(tempAiSetting.getValue());
};
onMounted(() => {
    localText.value = tempAiSetting.input;
});
watch(() => tempAiSetting.input, (newValue) => {
    localText.value = newValue;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-[var(--theme-aside)] from-[#f0f9ff] to-[#e0e7ef] p-8 min-h-[87vh] w-full flex flex-col gap-6 rounded-2xl" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-[var(--theme-body)] rounded-2xl shadow-[0_4px_24px_0_rgba(96,165,250,0.08),0_1.5px_6px_0_rgba(59,130,246,0.06)] border-[1.5px] border-[#e0e7ef] p-10 w-full max-w-4xl min-w-[320px] min-h-[320px] mx-auto flex flex-col justify-start box-border transition-all" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center border-b border-blue-100 pb-2 mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-lg font-bold flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "inline-block bg-gradient-to-r from-[var(--theme-main)] to-emerald-400 bg-clip-text" },
    width: "20",
    height: "20",
    fill: "#60a5fa",
    viewBox: "0 0 24 24",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M0 0h24v24H0z",
    fill: "none",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/images/pen.png",
    alt: "pen",
    ...{ class: "w-6 h-6 opacity-70" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    ...{ onBlur: (__VLS_ctx.updateTempAiSetting) },
    id: "content",
    ...{ class: "w-full min-h-[180px] p-5 bg-white/50 rounded-lg border-[1.5px] border-[#c7d2fe] bg-[#f9fafb] text-[1.1rem] text-[#2563eb] shadow-[0_1px_4px_0_rgba(96,165,250,0.06)] transition-all resize-vertical focus:outline-none focus:border-[#60a5fa] focus:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]" },
    placeholder: "请输入您对ai的人设...",
    value: (__VLS_ctx.localText),
});
/** @type {[typeof Knowledge, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Knowledge, new Knowledge({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-aside)]']} */ ;
/** @type {__VLS_StyleScopedClasses['from-[#f0f9ff]']} */ ;
/** @type {__VLS_StyleScopedClasses['to-[#e0e7ef]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[87vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-body)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_4px_24px_0_rgba(96,165,250,0.08),0_1.5px_6px_0_rgba(59,130,246,0.06)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#e0e7ef]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[320px]']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[320px]']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['box-border']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['to-emerald-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[#c7d2fe]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#f9fafb]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[1.1rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#2563eb]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_1px_4px_0_rgba(96,165,250,0.06)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['resize-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-[#60a5fa]']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:shadow-[0_4px_16px_0_rgba(59,130,246,0.10)]']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Knowledge: Knowledge,
            localText: localText,
            updateTempAiSetting: updateTempAiSetting,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
