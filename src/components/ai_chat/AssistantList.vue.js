/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateAssistantModal from './CreateAssistantModal.vue';
import EditAssistantModal from './EditAssistantModal.vue';
import http from '@/api/http';
import { useAssistantStore } from '@/stores/assistant';
const collapsed = ref(false);
const minWidth = 1300;
function handleResize() {
    collapsed.value = window.innerWidth < minWidth;
}
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
// 动画钩子
function beforeEnter(el) {
    el.style.height = '0';
    el.style.opacity = '0';
}
function enter(el) {
    const height = el.scrollHeight;
    el.style.transition =
        'height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)';
    el.style.height = height + 'px';
    el.style.opacity = '1';
    el.addEventListener('transitionend', () => {
        el.style.height = '';
        el.style.transition = '';
    }, { once: true });
}
function leave(el) {
    el.style.transition =
        'height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)';
    el.style.height = el.scrollHeight + 'px';
    void el.offsetHeight;
    el.style.height = '0';
    el.style.opacity = '0';
}
const assistantStore = useAssistantStore();
const router = useRouter();
function toggleCollapse() {
    collapsed.value = !collapsed.value;
}
onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    http
        .getAISettings(1, 20)
        .then((res) => {
        if (Array.isArray(res)) {
            const filteredData = res
                .filter((a) => a.uuid !== 'default-uuid')
                .map((a) => ({
                uuid: a.uuid,
                name: a.name,
                desc: a.desc,
                personality: a.personality || '',
                knowledge: a.knowledge || [],
                history: a.history || [],
            }));
            assistantStore.setAssistants([
                {
                    uuid: 'default-uuid',
                    name: '默认机器人',
                    desc: '这是一个可以用于简单测试对话的语音机器人',
                    personality: '这是一个可以用于简单测试对话的语音机器人',
                    knowledge: [],
                    history: [],
                },
                ...filteredData,
            ]);
        }
    })
        .catch((err) => {
        console.error('请求失败:', err);
    });
    if (!assistantStore.selectedId && assistantStore.assistants.length > 0) {
        onSelect(assistantStore.assistants[0]);
    }
});
function onAddClick() {
    assistantStore.newAssistant = {
        uuid: '',
        name: '',
        personality: '',
        knowledge: [],
        desc: '',
        history: [],
    };
    assistantStore.setShowAddModal(true);
    http.getAISettings(1, 20).then((res) => {
        console.log(res);
    });
}
function onEdit(item) {
    if (item.uuid === 'default-uuid') {
        alert('默认机器人不能编辑');
        return;
    }
    assistantStore.setEditingAssistant({ ...item });
    assistantStore.setShowEditModal(true);
}
function onSetting(item) {
    if (item.uuid === 'default-uuid') {
        alert('默认机器人不能设置');
        return;
    }
    assistantStore.setEditingAssistant({ ...item });
    assistantStore.setShowEditKnowledge(true);
}
function onDelete(uuid) {
    assistantStore.setToDeleteId(uuid);
    assistantStore.setShowDeleteModal(true);
}
function confirmDelete() {
    const uuid = assistantStore.toDeleteId;
    if (uuid === 'default-uuid') {
        alert('默认机器人不能删除');
        return;
    }
    http
        .deleteAISetting(uuid)
        .then(() => {
        assistantStore.setAssistants(assistantStore.assistants.filter((a) => a.uuid !== uuid));
        assistantStore.setShowDeleteModal(false);
        if (assistantStore.selectedId === uuid && assistantStore.assistants.length > 0) {
            assistantStore.setSelectedId(assistantStore.assistants[0].uuid);
            onSelect(assistantStore.assistants[0]);
        }
        assistantStore.setToDeleteId(null);
        console.log('删除成功');
    })
        .catch((error) => {
        console.error('删除失败:', error);
    });
}
function cancelDelete() {
    assistantStore.setShowDeleteModal(false);
    assistantStore.setToDeleteId(null);
}
function onSelect(item) {
    assistantStore.setSelectedId(item.uuid);
    router.push({ path: `/AI/chat/${encodeURIComponent(item.uuid)}` });
}
defineOptions({
    name: 'AssistantList',
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onBeforeEnter': {} },
    ...{ 'onEnter': {} },
    ...{ 'onLeave': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onBeforeEnter': {} },
    ...{ 'onEnter': {} },
    ...{ 'onLeave': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onBeforeEnter: (__VLS_ctx.beforeEnter)
};
const __VLS_8 = {
    onEnter: (__VLS_ctx.enter)
};
const __VLS_9 = {
    onLeave: (__VLS_ctx.leave)
};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative h-[83.4vh]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleCollapse) },
    ...{ class: "absolute top-1/2 -translate-y-1/2 right-0 z-50 w-8 h-8 border border-gray-200 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition" },
    title: "折叠/展开助手列表",
    ...{ style: {} },
});
if (!__VLS_ctx.collapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "20",
        height: "20",
        viewBox: "0 0 1024 1024",
        fill: "none",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M256 874.057143l76.8 76.8L768 512 332.8 73.142857 256 149.942857l358.4 362.057143z",
        fill: "#333",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "20",
        height: "20",
        viewBox: "0 0 1024 1024",
        fill: "none",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M768 149.942857L691.2 73.142857 256 512l435.2 438.857143 76.8-76.8-358.4-362.057143z",
        fill: "#333",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4 flex flex-col min-h-[700px] h-full transition-all duration-500 ease-in-out" },
    ...{ style: (__VLS_ctx.collapsed
            ? 'width:2px;min-width:2px;max-width:2px;padding-left:0;padding-right:0'
            : 'width:100%;min-width:200px;max-width:260px;') },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-4" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.collapsed) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.onAddClick) },
    ...{ class: "w-full py-2 px-4 bg-[var(--theme-main)] text-white rounded hover:bg-[var(--theme-button-hover)] transition" },
});
if (__VLS_ctx.assistantStore.showAddModal) {
    /** @type {[typeof CreateAssistantModal, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(CreateAssistantModal, new CreateAssistantModal({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
if (__VLS_ctx.assistantStore.showEditModal) {
    /** @type {[typeof EditAssistantModal, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(EditAssistantModal, new EditAssistantModal({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
if (__VLS_ctx.assistantStore.showDeleteModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded-lg shadow-lg p-6 min-w-[320px]" },
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
        ...{ onClick: (__VLS_ctx.cancelDelete) },
        ...{ class: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.confirmDelete) },
        ...{ class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 overflow-y-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white/50 rounded-lg shadow mb-4" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.collapsed) }, null, null);
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.assistantStore.assistants.filter((a) => a.uuid === 'defult-uuid')))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.uuid),
        ...{ class: "mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onSelect(item);
            } },
        ...{ class: ([
                'rounded-lg px-4 py-3 cursor-pointer transition relative',
                __VLS_ctx.assistantStore.selectedId === item.uuid ? 'bg-[var(--theme-select-button)]' : '',
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative pr-24" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute top-2 right-2 flex gap-1 z-10" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onEdit(item);
            } },
        ...{ class: "text-gray-500 hover:text-blue-500 transition" },
        ...{ style: {} },
        title: "编辑",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "22",
        height: "22",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 20h9",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onSetting(item);
            } },
        ...{ class: "p-1 text-blue-500 hover:text-blue-700 transition" },
        ...{ style: {} },
        title: "设置",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        t: "1753338826732",
        ...{ class: "icon" },
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        'p-id': "1540",
        width: "28",
        height: "28",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M511.62 656.52c-79.84 0-144.64-64.8-144.64-144.64s64.8-144.64 144.64-144.64 144.64 64.8 144.64 144.64-64.8 144.64-144.64 144.64z m0-231.42c-47.82 0-86.78 38.96-86.78 86.78s38.96 86.78 86.78 86.78 86.78-38.96 86.78-86.78-38.96-86.78-86.78-86.78z",
        fill: "#1296db",
        'p-id': "1541",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M635.42 904.9c-8.1 0-16.2-1.16-24.3-3.08-23.92-6.56-43.96-21.6-56.7-42.82l-4.62-7.72c-22.76-39.34-54-39.34-76.76 0l-4.24 7.32c-12.72 21.6-32.78 37.02-56.7 43.2-24.3 6.56-49.36 3.08-70.58-9.64l-66.34-38.18c-23.52-13.5-40.5-35.48-47.82-62.1-6.94-26.62-3.48-54 10.02-77.52 11.18-19.66 14.28-37.42 7.72-48.6s-23.14-17.74-45.9-17.74c-56.32 0-102.2-45.9-102.2-102.2v-67.88c0-56.32 45.9-102.2 102.2-102.2 22.76 0 39.34-6.56 45.9-17.74 6.56-11.18 3.86-28.92-7.72-48.6-13.5-23.52-16.98-51.3-10.02-77.52 6.94-26.62 23.92-48.6 47.82-62.1l66.72-38.18c43.58-25.84 101.06-10.8 127.28 33.56l4.62 7.72c22.76 39.34 54 39.34 76.76 0l4.24-7.32c26.22-44.74 83.7-59.78 127.66-33.56l66.34 38.18c23.52 13.5 40.5 35.48 47.82 62.1 6.94 26.62 3.48 54-10.02 77.52-11.18 19.68-14.28 37.42-7.72 48.6s23.14 17.74 45.9 17.74c56.32 0 102.2 45.9 102.2 102.2v67.88c0 56.32-45.9 102.2-102.2 102.2-22.76 0-39.34 6.56-45.9 17.74-6.56 11.18-3.86 28.92 7.72 48.6 13.5 23.52 17.36 51.3 10.02 77.52-6.94 26.62-23.92 48.6-47.82 62.1l-66.72 38.18c-14.64 8.1-30.46 12.34-46.66 12.34z m-123.8-142.7c34.32 0 66.34 21.6 88.32 59.78l4.24 7.32c4.62 8.1 12.34 13.88 21.6 16.2 9.26 2.32 18.52 1.16 26.22-3.48l66.72-38.56c10.02-5.78 17.74-15.42 20.82-27 3.08-11.58 1.54-23.52-4.24-33.56-21.98-37.8-24.68-76.76-7.72-106.46 16.98-29.7 52.06-46.66 96.04-46.66 24.68 0 44.36-19.68 44.36-44.36v-67.88c0-24.3-19.66-44.36-44.36-44.36-43.96 0-79.06-16.98-96.04-46.66-16.98-29.7-14.28-68.66 7.72-106.44 5.78-10.02 7.32-21.98 4.24-33.56-3.08-11.58-10.42-20.82-20.44-27L652.4 181.34c-16.58-10.02-38.56-4.24-48.6 12.72l-4.24 7.32c-21.98 38.18-54 59.78-88.32 59.78-34.32 0-66.34-21.6-88.32-59.78l-4.24-7.72c-9.64-16.2-31.24-21.98-47.82-12.34l-66.72 38.56c-10.02 5.78-17.74 15.42-20.82 27-3.08 11.58-1.54 23.52 4.24 33.56 21.98 37.8 24.68 76.76 7.72 106.44-16.98 29.7-52.06 46.66-96.04 46.66-24.68 0-44.36 19.66-44.36 44.36v67.88c0 24.3 19.68 44.36 44.36 44.36 43.96 0 79.06 16.98 96.04 46.66 16.96 29.7 14.28 68.66-7.72 106.44-5.78 10.02-7.32 21.98-4.24 33.56 3.08 11.58 10.42 20.82 20.44 27l66.72 38.18c8.1 5.02 17.74 6.18 26.62 3.86 9.26-2.32 16.98-8.48 21.98-16.58l4.24-7.32c21.96-37.76 53.96-59.74 88.3-59.74z",
        fill: "#1296db",
        'p-id': "1542",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onDelete(item.uuid);
            } },
        ...{ class: "text-red-500 hover:text-red-700 transition" },
        ...{ style: {} },
        title: "删除",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "23",
        height: "23",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline)({
        points: "3 6 5 6 21 6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "10",
        y1: "11",
        x2: "10",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "14",
        y1: "11",
        x2: "14",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-base mb-1" },
    });
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-500" },
    });
    (item.desc);
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.assistantStore.assistants.filter((a) => a.uuid !== '')))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white/50 rounded-lg shadow mb-4" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.collapsed) }, null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onSelect(item);
            } },
        ...{ class: ([
                'rounded-lg px-4 py-3 cursor-pointer transition relative',
                __VLS_ctx.assistantStore.selectedId === item.uuid ? 'bg-[var(--theme-select-button)]' : '',
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative pr-24" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute top-2 right-2 flex gap-1 z-10" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onEdit(item);
            } },
        ...{ class: "text-gray-500 hover:text-blue-500 transition" },
        ...{ style: {} },
        title: "编辑",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "22",
        height: "22",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 20h9",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onSetting(item);
            } },
        ...{ class: "p-1 text-blue-500 hover:text-blue-700 transition" },
        ...{ style: {} },
        title: "设置",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        t: "1753338826732",
        ...{ class: "icon" },
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        'p-id': "1540",
        width: "28",
        height: "28",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M511.62 656.52c-79.84 0-144.64-64.8-144.64-144.64s64.8-144.64 144.64-144.64 144.64 64.8 144.64 144.64-64.8 144.64-144.64 144.64z m0-231.42c-47.82 0-86.78 38.96-86.78 86.78s38.96 86.78 86.78 86.78 86.78-38.96 86.78-86.78-38.96-86.78-86.78-86.78z",
        fill: "#1296db",
        'p-id': "1541",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M635.42 904.9c-8.1 0-16.2-1.16-24.3-3.08-23.92-6.56-43.96-21.6-56.7-42.82l-4.62-7.72c-22.76-39.34-54-39.34-76.76 0l-4.24 7.32c-12.72 21.6-32.78 37.02-56.7 43.2-24.3 6.56-49.36 3.08-70.58-9.64l-66.34-38.18c-23.52-13.5-40.5-35.48-47.82-62.1-6.94-26.62-3.48-54 10.02-77.52 11.18-19.66 14.28-37.42 7.72-48.6s-23.14-17.74-45.9-17.74c-56.32 0-102.2-45.9-102.2-102.2v-67.88c0-56.32 45.9-102.2 102.2-102.2 22.76 0 39.34-6.56 45.9-17.74 6.56-11.18 3.86-28.92-7.72-48.6-13.5-23.52-16.98-51.3-10.02-77.52 6.94-26.62 23.92-48.6 47.82-62.1l66.72-38.18c43.58-25.84 101.06-10.8 127.28 33.56l4.62 7.72c22.76 39.34 54 39.34 76.76 0l4.24-7.32c26.22-44.74 83.7-59.78 127.66-33.56l66.34 38.18c23.52 13.5 40.5 35.48 47.82 62.1 6.94 26.62 3.48 54-10.02 77.52-11.18 19.68-14.28 37.42-7.72 48.6s23.14 17.74 45.9 17.74c56.32 0 102.2 45.9 102.2 102.2v67.88c0 56.32-45.9 102.2-102.2 102.2-22.76 0-39.34 6.56-45.9 17.74-6.56 11.18-3.86 28.92 7.72 48.6 13.5 23.52 17.36 51.3 10.02 77.52-6.94 26.62-23.92 48.6-47.82 62.1l-66.72 38.18c-14.64 8.1-30.46 12.34-46.66 12.34z m-123.8-142.7c34.32 0 66.34 21.6 88.32 59.78l4.24 7.32c4.62 8.1 12.34 13.88 21.6 16.2 9.26 2.32 18.52 1.16 26.22-3.48l66.72-38.56c10.02-5.78 17.74-15.42 20.82-27 3.08-11.58 1.54-23.52-4.24-33.56-21.98-37.8-24.68-76.76-7.72-106.46 16.98-29.7 52.06-46.66 96.04-46.66 24.68 0 44.36-19.68 44.36-44.36v-67.88c0-24.3-19.66-44.36-44.36-44.36-43.96 0-79.06-16.98-96.04-46.66-16.98-29.7-14.28-68.66 7.72-106.44 5.78-10.02 7.32-21.98 4.24-33.56-3.08-11.58-10.42-20.82-20.44-27L652.4 181.34c-16.58-10.02-38.56-4.24-48.6 12.72l-4.24 7.32c-21.98 38.18-54 59.78-88.32 59.78-34.32 0-66.34-21.6-88.32-59.78l-4.24-7.72c-9.64-16.2-31.24-21.98-47.82-12.34l-66.72 38.56c-10.02 5.78-17.74 15.42-20.82 27-3.08 11.58-1.54 23.52 4.24 33.56 21.98 37.8 24.68 76.76 7.72 106.44-16.98 29.7-52.06 46.66-96.04 46.66-24.68 0-44.36 19.66-44.36 44.36v67.88c0 24.3 19.68 44.36 44.36 44.36 43.96 0 79.06 16.98 96.04 46.66 16.96 29.7 14.28 68.66-7.72 106.44-5.78 10.02-7.32 21.98-4.24 33.56 3.08 11.58 10.42 20.82 20.44 27l66.72 38.18c8.1 5.02 17.74 6.18 26.62 3.86 9.26-2.32 16.98-8.48 21.98-16.58l4.24-7.32c21.96-37.76 53.96-59.74 88.3-59.74z",
        fill: "#1296db",
        'p-id': "1542",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.onDelete(item.uuid);
            } },
        ...{ class: "text-red-500 hover:text-red-700 transition" },
        ...{ style: {} },
        title: "删除",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "23",
        height: "23",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline)({
        points: "3 6 5 6 21 6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "10",
        y1: "11",
        x2: "10",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "14",
        y1: "11",
        x2: "14",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-base mb-1" },
    });
    (item.name && item.name.trim() ? item.name : '未命名助手');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-500" },
    });
    (item.desc && item.desc.trim() ? item.desc : '暂无简介');
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[83.4vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[700px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--theme-button-hover)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
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
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-24']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-24']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CreateAssistantModal: CreateAssistantModal,
            EditAssistantModal: EditAssistantModal,
            collapsed: collapsed,
            beforeEnter: beforeEnter,
            enter: enter,
            leave: leave,
            assistantStore: assistantStore,
            toggleCollapse: toggleCollapse,
            onAddClick: onAddClick,
            onEdit: onEdit,
            onSetting: onSetting,
            onDelete: onDelete,
            confirmDelete: confirmDelete,
            cancelDelete: cancelDelete,
            onSelect: onSelect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
