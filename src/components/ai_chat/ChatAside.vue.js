/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { ChevronLeft, ChevronRight, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-vue-next';
import router from '@/router/index.js';
import { useConversationStore } from '@/stores/conversation.js';
import { useUserStore } from '@/stores/user.js';
import http from '@/api/http.js';
import { useAssistantStore } from '@/stores/assistant.js';
const conversationStore = useConversationStore();
const assistantStore = useAssistantStore();
const userStore = useUserStore();
const collapsed = ref(false);
const showLogoutModal = ref(false);
const minWidth = 1300;
const showUserMenu = ref(false);
const userMenuOpen = ref(false);
// 系统设置弹窗相关
const showSettingsModal = ref(false);
const activeTab = ref('general');
function goPrivacy() {
    router.push({ name: 'privacy' });
}
function goTerms() {
    router.push({ name: 'terms' });
}
// 主题切换相关（六种主题，含渐变和新主题）
const themeOptions = [
    { value: 'default', label: '蓝色主题', color: 'bg-blue-400' },
    { value: 'pink', label: '粉色主题', color: 'bg-pink-400' },
    { value: 'brown', label: '棕色主题', color: 'bg-amber-700' },
    {
        value: 'gradient-blue-pink',
        label: '蓝粉渐变',
        color: 'bg-gradient-to-r from-blue-400 to-pink-400',
    },
    { value: 'new-theme', label: '绿色主题', color: 'bg-green-400' },
];
function handleResize() {
    collapsed.value = window.innerWidth < minWidth;
}
onMounted(async () => {
    window.addEventListener('resize', handleResize);
    handleResize();
    await reloadConvList();
    // 监听 AppHeader 触发的账号管理 tab 切换事件
    window.addEventListener('show-account-tab', handleShowAccountTab);
});
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('show-account-tab', handleShowAccountTab);
});
function handleShowAccountTab() {
    showSettingsModal.value = true;
    activeTab.value = 'account';
}
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
function toggleCollapse() {
    collapsed.value = !collapsed.value;
}
async function reloadConvList() {
    try {
        const res = await http.listConversations(1, 20);
        // 批量获取所有会话的消息
        if (!res || res.length === 0)
            return;
        const conversationPromises = res.map(fetchConvs);
        const conversations = await Promise.all(conversationPromises);
        // 统一添加，避免重复
        conversationStore.setConversations(conversations);
    }
    catch (e) {
        // 获取会话列表失败
        console.error('获取会话列表失败', e);
    }
}
async function fetchConvs(element) {
    const conversation = {
        uuid: element.uuid,
        title: '',
        user_id: userStore.user.uuid,
        setting_id: 0,
        messages: [],
    };
    try {
        const messages = await http.getConversationMessages(conversation.uuid);
        if (messages && messages.length > 0) {
            conversation.title = messages[0].content || '新会话';
            conversation.messages = messages.map((message) => ({
                uuid: message.uuid,
                conversation_uuid: message.conversation_uuid,
                role: message.role,
                content: message.content,
                sequence: message.sequence,
            }));
        }
        else {
            await http.deleteConversation(conversation.uuid);
        }
    }
    catch {
        conversation.title = '新会话';
    }
    return conversation;
}
function showUserMenuButton() {
    showUserMenu.value = !showUserMenu.value;
    http.getUserInfo().then((res) => {
        console.log(res);
        userStore.setUser({
            uuid: res.uuid,
            name: res.name,
            email: res.email,
        });
    });
}
async function confirmLogout() {
    await http.logout();
    router.push('/login');
    showLogoutModal.value = false;
}
// 动画钩子
function beforeEnter(el) {
    el.style.height = '0';
    el.style.opacity = '0';
}
function handleSettings() {
    showSettingsModal.value = true;
    activeTab.value = 'general';
}
function handleAccount() {
    showSettingsModal.value = true;
    activeTab.value = 'account';
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
const menuVisible = ref(false);
const menuItem = ref(null);
function toggleMenu(item, event) {
    if (menuVisible.value && menuItem.value === item) {
        hideMenu();
        return;
    }
    menuItem.value = item;
    menuVisible.value = true;
    document.addEventListener('click', hideMenu, { once: true });
}
function hideMenu() {
    menuVisible.value = false;
    menuItem.value = null;
}
async function remove(conv) {
    console.log('删除会话', conv.uuid);
    await http.deleteConversation(conv.uuid).then(() => {
        if (conversationStore.currentConversationId === conv.uuid) {
            conversationStore.currentConversationId = '';
        }
    });
    menuVisible.value = false;
    router.go(0);
}
function changeTheme() {
    applyTheme(theme.value);
}
function selectTheme(val) {
    theme.value = val;
    applyTheme(val);
}
const theme = ref(localStorage.getItem('theme') || 'default');
function applyTheme(val) {
    if ([
        'default',
        'pink',
        'brown',
        'gradient-blue-pink',
        'gradient-orange-purple',
        'new-theme',
    ].includes(val)) {
        document.body.setAttribute('data-theme', val);
        localStorage.setItem('theme', val);
        document.documentElement.classList.remove('dark');
    }
    else if (val === 'light') {
        document.body.removeAttribute('data-theme');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    else if (val === 'dark') {
        document.body.removeAttribute('data-theme');
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        // 跟随系统
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'system');
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }
}
onMounted(() => {
    // ...existing code...
    function goAccount() {
        router.push('/account');
    }
});
function showConversation(uuid) {
    conversationStore.setConfirmCreateConversation(false);
    console.log('showConversation:', uuid);
    if (typeof conversationStore.setCurrentConversation === 'function') {
        conversationStore.setCurrentConversation(uuid);
    }
    else {
        conversationStore.currentConversationId = uuid;
    }
}
function newConversation() {
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
    conversationStore.setConfirmCreateConversation(true);
}
const currentConversationEmpty = computed(() => {
    const conv = conversationStore.conversations.find((c) => c.uuid === conversationStore.currentConversationId);
    return conv && conv.messages.length === 0;
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
    persisted: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onBeforeEnter': {} },
    ...{ 'onEnter': {} },
    ...{ 'onLeave': {} },
    persisted: true,
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: ([
            'flex flex-col h-full bg-[var(--theme-aside)] border-r border-gray-200 shadow-md relative',
            __VLS_ctx.collapsed ? 'w-16' : 'w-64 md:w-72 ',
        ]) },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.collapsed || __VLS_ctx.collapsed) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-3 py-3 min-h-[48px]" },
});
if (!__VLS_ctx.collapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        t: "1752914624151",
        ...{ class: "icon" },
        viewBox: "0 0 1051 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M210.393996 472.446294h73.053471v160.717636h-73.053471z",
        fill: "var(--theme-main)",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M791.169091 531.619605V300.770637H431.746014v-50.406895a127.843574 127.843574 0 0 0 91.316838-121.268762 127.843574 127.843574 0 1 0-164.370309 121.268762v50.406895H0V804.839587h475.578096a230.118434 230.118434 0 0 0 127.11304 131.496248V1024l159.256567-52.598499c157.795497 0 285.639072-100.083255 285.639071-219.160413s-112.502345-207.471858-256.417683-220.621483zM341.15971 129.09498A54.059569 54.059569 0 0 1 395.219278 74.304877a54.790103 54.790103 0 1 1 0 108.849672 54.059569 54.059569 0 0 1-54.059568-54.059569zM73.053471 373.824108h645.062149v157.064963h-34.335131l-32.143528 8.035882-18.993902 5.844277-29.951923 11.688556-18.263368 13.149624h-6.574812V472.446294h-73.053471v160.717636H511.374297a239.615385 239.615385 0 0 0-23.377111 25.568715l-5.844277 13.149625a155.603893 155.603893 0 0 0-10.227486 25.568715 127.11304 127.11304 0 0 0 0 16.071763v16.071764H73.053471z m683.049954 522.332318l-80.358818 24.83818v-34.335131L651.636961 877.893058a159.256567 159.256567 0 0 1-113.23288-116.885554 56.251173 56.251173 0 0 1 0-10.95802c0-80.358818 97.891651-146.106942 219.160413-146.106942 118.346623 0 219.160413 67.939728 219.160413 146.106942s-100.083255 146.106942-220.621482 146.106942z",
        fill: "var(--theme-main)",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M684.511023 714.253283a36.526736 36.526736 0 0 0-36.526735 36.526735 35.065666 35.065666 0 0 0 4.383208 17.532833 36.526736 36.526736 0 0 0 64.287055 0 35.065666 35.065666 0 0 0 4.383208-17.532833 36.526736 36.526736 0 0 0-36.526736-36.526735z",
        fill: "var(--theme-main)",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M827.695826 750.780018m-36.526735 0a36.526736 36.526736 0 1 0 73.053471 0 36.526736 36.526736 0 1 0-73.053471 0Z",
        fill: "var(--theme-main)",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-bold text-base text-[var(--theme-main)] select-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleCollapse) },
        ...{ class: "p-1 rounded hover:bg-black/10 dark:hover:bg-gray-800 transition-colors" },
    });
    const __VLS_10 = {}.ChevronLeft;
    /** @type {[typeof __VLS_components.ChevronLeft, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_12 = __VLS_11({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleCollapse) },
        ...{ class: "p-1 rounded hover:bg-white/50 dark:hover:bg-gray-800 transition-colors mb-2" },
    });
    const __VLS_14 = {}.ChevronRight;
    /** @type {[typeof __VLS_components.ChevronRight, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_16 = __VLS_15({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-center mt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.newConversation) },
    ...{ class: "p-1 rounded hover:bg-black/10 dark:hover:bg-blue-900 transition-colors flex items-center" },
    title: "新建对话",
});
const __VLS_18 = {}.PlusCircle;
/** @type {[typeof __VLS_components.PlusCircle, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    ...{ class: "w-5 h-5 text-[var(--theme-main)]" },
}));
const __VLS_20 = __VLS_19({
    ...{ class: "w-5 h-5 text-[var(--theme-main)]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
if (!__VLS_ctx.collapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-1 text-[var(--theme-main)] font-medium" },
    });
}
if (!__VLS_ctx.collapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 overflow-y-auto px-2 py-1" },
    });
    if (__VLS_ctx.conversationStore.conversations.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-gray-400 text-center py-8 select-none" },
        });
    }
    for (const [conv] of __VLS_getVForSourceType((__VLS_ctx.conversationStore.conversations))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.collapsed))
                        return;
                    __VLS_ctx.showConversation(conv.uuid);
                } },
            key: (conv.uuid),
            ...{ class: "group flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-black/10 dark:hover:bg-gray-800 transition-colors mb-1 relative" },
            ...{ class: (__VLS_ctx.conversationStore.currentConversationId === conv.uuid
                    ? 'bg-purple-50 dark:bg-gray-800'
                    : '') },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-8 h-8 bg-[var(--theme-main)] rounded-full flex items-center justify-center text-white text-sm font-bold" },
        });
        (conv.title ? conv.title[0] : '会');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex-1 min-w-0" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "truncate font-medium" },
        });
        (conv.title.length > 20
            ? conv.title.slice(0, 20) + '...'
            : conv.title || '未命名会话');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "truncate text-xs text-gray-500" },
        });
        (conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1].content
            : '暂无消息');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.collapsed))
                        return;
                    __VLS_ctx.toggleMenu(conv, $event);
                } },
            ...{ class: "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" },
        });
        const __VLS_22 = {}.MoreHorizontal;
        /** @type {[typeof __VLS_components.MoreHorizontal, ]} */ ;
        // @ts-ignore
        const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
            ...{ class: "w-5 h-5 text-gray-400" },
        }));
        const __VLS_24 = __VLS_23({
            ...{ class: "w-5 h-5 text-gray-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_23));
        if (__VLS_ctx.menuVisible && __VLS_ctx.menuItem && __VLS_ctx.menuItem.uuid === conv.uuid) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "absolute right-8 top-[60%] -translate-y-0 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-100 dark:border-gray-800 z-10 flex flex-col min-w-[120px]" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.collapsed))
                            return;
                        if (!(__VLS_ctx.menuVisible && __VLS_ctx.menuItem && __VLS_ctx.menuItem.uuid === conv.uuid))
                            return;
                        __VLS_ctx.remove(conv);
                    } },
                ...{ class: "flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-red-500" },
            });
            const __VLS_26 = {}.Trash2;
            /** @type {[typeof __VLS_components.Trash2, ]} */ ;
            // @ts-ignore
            const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
                ...{ class: "w-4 h-4" },
            }));
            const __VLS_28 = __VLS_27({
                ...{ class: "w-4 h-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        }
    }
    if (__VLS_ctx.currentConversationEmpty) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-gray-400 text-center py-4 select-none" },
        });
    }
}
if (!__VLS_ctx.collapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.showUserMenuButton) },
        ...{ class: "px-3 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 min-h-[48px] group hover:bg-black/10 dark:hover:bg-gray-800 transition-colors cursor-pointer relative" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 group-hover:text-purple-600 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        t: "1753323187383",
        ...{ class: "icon" },
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M511.931733 1023.351467a512.887467 512.887467 0 0 1-377.514666-166.126934l-20.241067-21.742933 20.241067-21.742933a513.7408 513.7408 0 0 1 377.514666-166.126934c143.121067 0 281.088 60.552533 377.514667 166.126934l20.241067 21.742933-20.206934 21.742933a512.887467 512.887467 0 0 1-377.514666 166.126934z m-308.565333-187.869867a448.853333 448.853333 0 0 0 308.565333 123.1872 448.853333 448.853333 0 0 0 308.565334-123.1872 448.853333 448.853333 0 0 0-308.565334-123.1872 448.853333 448.853333 0 0 0-308.565333 123.221333z m309.077333-234.461867c-90.2144 0-163.84-73.489067-163.84-163.5328 0-90.043733 73.6256-163.566933 163.84-163.566933 90.248533 0 163.874133 73.5232 163.874134 163.566933a163.7376 163.7376 0 0 1-163.84 163.5328z m0-262.382933a99.259733 99.259733 0 0 0-99.0208 98.850133 99.259733 99.259733 0 0 0 99.0208 98.850134 99.259733 99.259733 0 0 0 99.054934-98.850134 98.952533 98.952533 0 0 0-99.054934-98.850133z",
        fill: "#515151",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M116.770133 721.1008A442.88 442.88 0 0 1 64.9216 512c0-246.340267 200.704-446.122667 447.010133-446.122667 246.340267 0 447.010133 200.2944 447.010134 446.122667 0 72.977067-18.1248 144.930133-51.848534 208.5888 16.5888 15.530667 32.1536 32.085333 46.6944 49.698133A506.914133 0 0 0 1023.761067 512c0-282.043733-229.717333-511.317333-512.341334-511.317333C229.307733 1.160533 0.1024 230.434133 0.1024 512c0 91.101867 24.3712 180.6336 70.519467 258.286933 13.994667-17.066667 29.559467-33.655467 46.148266-49.152z",
        fill: "#515151",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-2 text-gray-700" },
    });
    if (__VLS_ctx.showUserMenu) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "absolute left-0 bottom-full mb-2 z-50 min-w-[180px] bg-white/50 dark:bg-gray-900 shadow-lg rounded-lg border border-gray-100 dark:border-gray-800 py-2 flex flex-col" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleAccount) },
            ...{ class: "flex items-center gap-2 px-4 py-2 hover:bg-black/10 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            t: "1753337769292",
            ...{ class: "icon" },
            viewBox: "0 0 1024 1024",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            'p-id': "16932",
            width: "18",
            height: "18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M827.4 86.3H164.8c-55.5 0-100.6 45.1-100.6 100.6v628.8c0 55.5 45.1 100.6 100.6 100.6h662.6c55.5 0 100.6-45.1 100.6-100.7V186.9c0-55.5-45.1-100.6-100.6-100.6z m0 769.5H164.8c-22.1 0-40.2-18-40.2-40.2V186.9c0-22.1 18-40.2 40.2-40.2h662.6c22.1 0 40.2 18 40.2 40.2v95.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.7H716.7c-16.7 0-30.2 13.5-30.2 30.2S700 705 716.7 705h150.9v110.6c0 22.1-18 40.2-40.2 40.2z",
            'p-id': "16933",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M506.5 498.4c28.1-25.9 45.7-63 45.7-104.2 0-78.2-63.7-141.8-141.9-141.8S268.5 316 268.5 394.2c0 41.1 17.6 78.2 45.6 104.1-70.8 35.4-119.5 108.6-119.5 193 0 16.7 13.5 30.2 30.2 30.2S255 708 255 691.3c0-85.7 69.7-155.3 155.3-155.3s155.3 69.7 155.3 155.3c0 16.7 13.5 30.2 30.2 30.2S626 708 626 691.3c0-84.3-48.8-157.5-119.5-192.9z m-96.2-185.7c45 0 81.5 36.6 81.5 81.5s-36.6 81.5-81.5 81.5-81.5-36.6-81.5-81.5 36.6-81.5 81.5-81.5z",
            'p-id': "16934",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleSettings) },
            ...{ class: "flex items-center gap-2 px-4 py-2 hover:bg-black/10 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            t: "1753337701105",
            ...{ class: "icon" },
            viewBox: "0 0 1083 1024",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            'p-id': "15849",
            width: "18",
            height: "18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M1078.873696 431.922687c-4.213645-23.656607-27.027523-47.553993-50.443349-52.851147l-17.516724-4.03306a175.167241 175.167241 0 0 1-101.428454-80.360229 174.204122 174.204122 0 0 1-18.660428-128.817146l5.176764-16.553605c7.042807-22.934268-2.167017-54.5968-20.466276-70.127092 0 0-16.6138-14.025418-63.325064-40.932551-46.711264-26.967328-66.996955-34.311109-66.996955-34.311109-22.633293-8.18651-54.656995-0.36117-71.030015 17.275945l-12.33996 13.242884a175.227436 175.227436 0 0 1-120.389857 47.734578 175.046851 175.046851 0 0 1-120.871415-48.155943L408.663367 21.333083C392.470931 3.635774 360.32684-4.189567 337.693547 3.996943c0 0-20.225496 7.343781-67.05715 34.311109-46.711264 26.967328-63.204675 40.872356-63.204675 40.872356-18.359453 15.530291-27.569277 47.072434-20.466275 70.127092l5.176764 16.673995A175.588605 175.588605 0 0 1 71.33099 375.098675l-17.035165 3.852475c-23.476022 5.417544-46.229705 29.254735-50.503545 52.851147 0 0-3.79228 21.24881-3.79228 75.24366C0 560.980613 3.79228 582.169228 3.79228 582.169228c4.334035 23.716802 27.087718 47.553993 50.503545 52.971536l16.6138 3.732086a175.6488 175.6488 0 0 1 121.052001 209.47835l-4.996179 16.553605c-7.163196 22.934268 2.106822 54.536605 20.466275 70.127091 0 0 16.553605 13.965223 63.26487 40.932551 46.771459 27.027523 66.996955 34.311109 66.996955 34.311109 22.753683 8.126315 54.5968 0.36117 71.030015-17.275944l11.738011-12.58074a175.829385 175.829385 0 0 1 242.043806 0l11.617621 12.640935c16.433215 17.576919 48.276332 25.342065 71.030015 17.155554 0 0 20.165301-7.343781 67.117345-34.250914 46.711264-26.967328 63.204675-40.932551 63.204674-40.932551 18.359453-15.590486 27.509082-47.132629 20.466276-70.127091l-5.116569-17.035165a175.468215 175.468215 0 0 1 121.052-209.056985V638.75246l16.613801-3.79228c23.536217-5.417544 46.350095-29.19454 50.503544-52.851147 0 0 3.852475-21.24881 3.852476-75.24366-0.060195-53.754071-3.972865-74.942685-3.972866-74.942686z m-537.540708 249.146808a173.963342 173.963342 0 1 1-0.060194-347.806295 173.963342 173.963342 0 0 1 0.060194 347.806295z",
            fill: "#1296db",
            'p-id': "15850",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.collapsed))
                        return;
                    if (!(__VLS_ctx.showUserMenu))
                        return;
                    __VLS_ctx.showLogoutModal = true;
                } },
            ...{ class: "flex items-center gap-2 px-4 py-2 hover:bg-black/10 dark:hover:bg-gray-800 text-red-500 dark:text-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            t: "1753333840646",
            ...{ class: "icon" },
            viewBox: "0 0 1024 1024",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            width: "18",
            height: "18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M675.84 768c-22.528 0-40.96 18.944-40.96 42.496v106.496c0 11.776-8.704 24.576-19.968 24.576h-512c-11.264 0-20.992-13.312-20.992-24.576V106.496c0-11.776 9.728-24.576 20.992-24.576h512c11.264 0 19.968 13.312 19.968 24.576v106.496c0 23.552 18.432 42.496 40.96 42.496s40.96-18.944 40.96-42.496V106.496C716.8 47.616 670.72 0 614.4 0H102.4C46.08 0 0 47.616 0 106.496v810.496C0 976.384 46.08 1024 102.4 1024h512c56.32 0 102.4-47.616 102.4-106.496v-106.496c0-24.064-18.432-43.008-40.96-43.008z",
            fill: "#d81e06",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M1011.2 481.792l-184.32-181.248c-16.896-16.384-44.544-16.384-61.44 0-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024L875.52 469.504H448.512c-24.064 0-43.52 18.944-43.52 42.496 0 23.552 19.456 42.496 43.52 42.496H875.52l-110.08 108.032c-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024c8.704 8.192 19.456 12.8 30.72 12.8s22.528-4.096 30.72-12.8l184.32-181.248c16.896-16.384 16.896-43.52 0-59.904z",
            fill: "#d81e06",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
if (__VLS_ctx.collapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute left-0 bottom-2 w-16 px-2 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center min-h-[48px] bg-[var(--theme-bg)] z-40" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.showUserMenuButton) },
        ...{ class: "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-purple-100 hover:text-purple-600 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 group-hover:bg-purple-100 group-hover:text-purple-600 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        t: "1753323187383",
        ...{ class: "icon" },
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M511.931733 1023.351467a512.887467 512.887467 0 0 1-377.514666-166.126934l-20.241067-21.742933 20.241067-21.742933a513.7408 513.7408 0 0 1 377.514666-166.126934c143.121067 0 281.088 60.552533 377.514667 166.126934l20.241067 21.742933-20.206934 21.742933a512.887467 512.887467 0 0 1-377.514666 166.126934z m-308.565333-187.869867a448.853333 448.853333 0 0 0 308.565333 123.1872 448.853333 448.853333 0 0 0 308.565334-123.1872 448.853333 448.853333 0 0 0-308.565334-123.1872 448.853333 448.853333 0 0 0-308.565333 123.221333z m309.077333-234.461867c-90.2144 0-163.84-73.489067-163.84-163.5328 0-90.043733 73.6256-163.566933 163.84-163.566933 90.248533 0 163.874133 73.5232 163.874134 163.566933a163.7376 163.7376 0 0 1-163.84 163.5328z m0-262.382933a99.259733 99.259733 0 0 0-99.0208 98.850133 99.259733 99.259733 0 0 0 99.0208 98.850134 99.259733 99.259733 0 0 0 99.054934-98.850134 98.952533 98.952533 0 0 0-99.054934-98.850133z",
        fill: "#515151",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M116.770133 721.1008A442.88 442.88 0 0 1 64.9216 512c0-246.340267 200.704-446.122667 447.010133-446.122667 246.340267 0 447.010133 200.2944 447.010134 446.122667 0 72.977067-18.1248 144.930133-51.848534 208.5888 16.5888 15.530667 32.1536 32.085333 46.6944 49.698133A506.914133 0 0 0 1023.761067 512c0-282.043733-229.717333-511.317333-512.341334-511.317333C229.307733 1.160533 0.1024 230.434133 0.1024 512c0 91.101867 24.3712 180.6336 70.519467 258.286933 13.994667-17.066667 29.559467-33.655467 46.148266-49.152z",
        fill: "#515151",
    });
    if (__VLS_ctx.showUserMenu) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "absolute left-[-140px] bottom-[56px] bg-white/50 z-50 min-w-[180px] shadow-lg rounded-lg border border-gray-100 py-2 flex flex-col" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleAccount) },
            ...{ class: "flex items-center gap-2 px-4 py-2 hover:bg-black/10 text-[#222] dark:text-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            t: "1753337769292",
            ...{ class: "icon" },
            viewBox: "0 0 1024 1024",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            'p-id': "16932",
            width: "18",
            height: "18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M827.4 86.3H164.8c-55.5 0-100.6 45.1-100.6 100.6v628.8c0 55.5 45.1 100.6 100.6 100.6h662.6c55.5 0 100.6-45.1 100.6-100.7V186.9c0-55.5-45.1-100.6-100.6-100.6z m0 769.5H164.8c-22.1 0-40.2-18-40.2-40.2V186.9c0-22.1 18-40.2 40.2-40.2h662.6c22.1 0 40.2 18 40.2 40.2v95.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.6H716.7c-16.7 0-30.2 13.5-30.2 30.2s13.5 30.2 30.2 30.2h150.9v120.7H716.7c-16.7 0-30.2 13.5-30.2 30.2S700 705 716.7 705h150.9v110.6c0 22.1-18 40.2-40.2 40.2z",
            'p-id': "16933",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M506.5 498.4c28.1-25.9 45.7-63 45.7-104.2 0-78.2-63.7-141.8-141.9-141.8S268.5 316 268.5 394.2c0 41.1 17.6 78.2 45.6 104.1-70.8 35.4-119.5 108.6-119.5 193 0 16.7 13.5 30.2 30.2 30.2S255 708 255 691.3c0-85.7 69.7-155.3 155.3-155.3s155.3 69.7 155.3 155.3c0 16.7 13.5 30.2 30.2 30.2S626 708 626 691.3c0-84.3-48.8-157.5-119.5-192.9z m-96.2-185.7c45 0 81.5 36.6 81.5 81.5s-36.6 81.5-81.5 81.5-81.5-36.6-81.5-81.5 36.6-81.5 81.5-81.5z",
            'p-id': "16934",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleSettings) },
            ...{ class: "flex items-center gap-2 px-4 py-2 hover:bg-black/10 text-[#222] dark:text-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            t: "1753337701105",
            ...{ class: "icon" },
            viewBox: "0 0 1083 1024",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            'p-id': "15849",
            width: "18",
            height: "18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M1078.873696 431.922687c-4.213645-23.656607-27.027523-47.553993-50.443349-52.851147l-17.516724-4.03306a175.167241 175.167241 0 0 1-101.428454-80.360229 174.204122 174.204122 0 0 1-18.660428-128.817146l5.176764-16.553605c7.042807-22.934268-2.167017-54.5968-20.466276-70.127092 0 0-16.6138-14.025418-63.325064-40.932551-46.711264-26.967328-66.996955-34.311109-66.996955-34.311109-22.633293-8.18651-54.656995-0.36117-71.030015 17.275945l-12.33996 13.242884a175.227436 175.227436 0 0 1-120.389857 47.734578 175.046851 175.046851 0 0 1-120.871415-48.155943L408.663367 21.333083C392.470931 3.635774 360.32684-4.189567 337.693547 3.996943c0 0-20.225496 7.343781-67.05715 34.311109-46.711264 26.967328-63.204675 40.872356-63.204675 40.872356-18.359453 15.530291-27.569277 47.072434-20.466275 70.127092l5.176764 16.673995A175.588605 175.588605 0 0 1 71.33099 375.098675l-17.035165 3.852475c-23.476022 5.417544-46.229705 29.254735-50.503545 52.851147 0 0-3.79228 21.24881-3.79228 75.24366C0 560.980613 3.79228 582.169228 3.79228 582.169228c4.334035 23.716802 27.087718 47.553993 50.503545 52.971536l16.6138 3.732086a175.6488 175.6488 0 0 1 121.052001 209.47835l-4.996179 16.553605c-7.163196 22.934268 2.106822 54.536605 20.466275 70.127091 0 0 16.553605 13.965223 63.26487 40.932551 46.771459 27.027523 66.996955 34.311109 66.996955 34.311109 22.753683 8.126315 54.5968 0.36117 71.030015-17.275944l11.738011-12.58074a175.829385 175.829385 0 0 1 242.043806 0l11.617621 12.640935c16.433215 17.576919 48.276332 25.342065 71.030015 17.155554 0 0 20.165301-7.343781 67.117345-34.250914 46.711264-26.967328 63.204675-40.932551 63.204674-40.932551 18.359453-15.590486 27.509082-47.132629 20.466276-70.127091l-5.116569-17.035165a175.468215 175.468215 0 0 1 121.052-209.056985V638.75246l16.613801-3.79228c23.536217-5.417544 46.350095-29.19454 50.503544-52.851147 0 0 3.852475-21.24881 3.852476-75.24366-0.060195-53.754071-3.972865-74.942685-3.972866-74.942686z m-537.540708 249.146808a173.963342 173.963342 0 1 1-0.060194-347.806295 173.963342 173.963342 0 0 1 0.060194 347.806295z",
            fill: "#1296db",
            'p-id': "15850",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.collapsed))
                        return;
                    if (!(__VLS_ctx.showUserMenu))
                        return;
                    __VLS_ctx.showLogoutModal = true;
                } },
            ...{ class: "flex items-center gap-2 px-4 py-2 hover:bg-black/10 text-red-500 dark:text-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            t: "1753333840646",
            ...{ class: "icon" },
            viewBox: "0 0 1024 1024",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            width: "18",
            height: "18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M675.84 768c-22.528 0-40.96 18.944-40.96 42.496v106.496c0 11.776-8.704 24.576-19.968 24.576h-512c-11.264 0-20.992-13.312-20.992-24.576V106.496c0-11.776 9.728-24.576 20.992-24.576h512c11.264 0 19.968 13.312 19.968 24.576v106.496c0 23.552 18.432 42.496 40.96 42.496s40.96-18.944 40.96-42.496V106.496C716.8 47.616 670.72 0 614.4 0H102.4C46.08 0 0 47.616 0 106.496v810.496C0 976.384 46.08 1024 102.4 1024h512c56.32 0 102.4-47.616 102.4-106.496v-106.496c0-24.064-18.432-43.008-40.96-43.008z",
            fill: "#d81e06",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M1011.2 481.792l-184.32-181.248c-16.896-16.384-44.544-16.384-61.44 0-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024L875.52 469.504H448.512c-24.064 0-43.52 18.944-43.52 42.496 0 23.552 19.456 42.496 43.52 42.496H875.52l-110.08 108.032c-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024c8.704 8.192 19.456 12.8 30.72 12.8s22.528-4.096 30.72-12.8l184.32-181.248c16.896-16.384 16.896-43.52 0-59.904z",
            fill: "#d81e06",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
if (__VLS_ctx.showLogoutModal) {
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
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showLogoutModal))
                    return;
                __VLS_ctx.showLogoutModal = false;
            } },
        ...{ class: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.confirmLogout) },
        ...{ class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" },
    });
}
if (__VLS_ctx.showSettingsModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white/70 dark:bg-gray-900 rounded-lg shadow-lg min-w-[480px] max-w-[90vw] min-h-[340px] relative p-0" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-lg text-gray-900 dark:text-gray-100" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showSettingsModal))
                    return;
                __VLS_ctx.showSettingsModal = false;
            } },
        ...{ class: "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex px-6 pt-4 pb-2 gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showSettingsModal))
                    return;
                __VLS_ctx.activeTab = 'general';
            } },
        ...{ class: "flex-1 py-2 rounded-lg font-medium transition-colors" },
        ...{ class: (__VLS_ctx.activeTab === 'general'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200') },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showSettingsModal))
                    return;
                __VLS_ctx.activeTab = 'account';
            } },
        ...{ class: "flex-1 py-2 rounded-lg font-medium transition-colors" },
        ...{ class: (__VLS_ctx.activeTab === 'account'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200') },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showSettingsModal))
                    return;
                __VLS_ctx.activeTab = 'service';
            } },
        ...{ class: "flex-1 py-2 rounded-lg font-medium transition-colors" },
        ...{ class: (__VLS_ctx.activeTab === 'service'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200') },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-6 py-4 min-h-[180px]" },
    });
    if (__VLS_ctx.activeTab === 'general') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mb-6" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "block text-gray-700 dark:text-gray-200 mb-2 font-medium" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-wrap gap-2 mt-3" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.themeOptions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showSettingsModal))
                            return;
                        if (!(__VLS_ctx.activeTab === 'general'))
                            return;
                        __VLS_ctx.selectTheme(item.value);
                    } },
                key: (item.value),
                ...{ class: ([
                        'cursor-pointer px-3 py-1 rounded flex items-center gap-2 border',
                        __VLS_ctx.theme === item.value
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-gray-200 bg-gray-100',
                    ]) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (item.color) },
                ...{ class: "w-4 h-4 rounded-full inline-block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-sm" },
            });
            (item.label);
        }
    }
    else if (__VLS_ctx.activeTab === 'account') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium text-gray-500 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-900 dark:text-gray-100" },
        });
        (__VLS_ctx.userStore.user.uuid);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium text-gray-500 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-900 dark:text-gray-100" },
        });
        (__VLS_ctx.userStore.user.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium text-gray-500 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-900 dark:text-gray-100" },
        });
        (__VLS_ctx.userStore.user.email);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium text-gray-500 dark:text-gray-400" },
        });
        const __VLS_30 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
            to: "/AI/change-password",
            ...{ class: "text-blue-500 hover:underline" },
        }));
        const __VLS_32 = __VLS_31({
            to: "/AI/change-password",
            ...{ class: "text-blue-500 hover:underline" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        __VLS_33.slots.default;
        var __VLS_33;
    }
    else if (__VLS_ctx.activeTab === 'service') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-gray-700 dark:text-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.goPrivacy) },
            ...{ class: "w-full flex items-center justify-between px-6 py-4 rounded-xl border border-gray-30 bg-white/40 transition-all shadow group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-lg text-black" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: "opacity-60 group-hover:opacity-100 transition" },
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            fill: "currentColor",
            d: "M13.293 5.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L16.586 12H6a1 1 0 0 1 0-2h10.586l-3.293-3.293a1 1 0 0 1 0-1.414z",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.goTerms) },
            ...{ class: "w-full mt-4 flex items-center justify-between px-6 py-4 rounded-xl border border-gray-300 bg-white/40 transition-all shadow group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-lg text-black" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: "opacity-60 group-hover:opacity-100 transition" },
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            fill: "currentColor",
            d: "M13.293 5.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L16.586 12H6a1 1 0 0 1 0-2h10.586l-3.293-3.293a1 1 0 0 1 0-1.414z",
        });
    }
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-aside)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[48px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-blue-900']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-8']} */ ;
/** @type {__VLS_StyleScopedClasses['top-[60%]']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[48px]']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[48px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-bg)]']} */ ;
/** @type {__VLS_StyleScopedClasses['z-40']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-purple-100']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:bg-purple-100']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-[-140px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-[56px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#222]']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#222]']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
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
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/70']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[480px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[90vw]']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[340px]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-30']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/40']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/40']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChevronLeft: ChevronLeft,
            ChevronRight: ChevronRight,
            MoreHorizontal: MoreHorizontal,
            PlusCircle: PlusCircle,
            Trash2: Trash2,
            conversationStore: conversationStore,
            userStore: userStore,
            collapsed: collapsed,
            showLogoutModal: showLogoutModal,
            showUserMenu: showUserMenu,
            showSettingsModal: showSettingsModal,
            activeTab: activeTab,
            goPrivacy: goPrivacy,
            goTerms: goTerms,
            themeOptions: themeOptions,
            toggleCollapse: toggleCollapse,
            showUserMenuButton: showUserMenuButton,
            confirmLogout: confirmLogout,
            beforeEnter: beforeEnter,
            handleSettings: handleSettings,
            handleAccount: handleAccount,
            enter: enter,
            leave: leave,
            menuVisible: menuVisible,
            menuItem: menuItem,
            toggleMenu: toggleMenu,
            remove: remove,
            selectTheme: selectTheme,
            theme: theme,
            showConversation: showConversation,
            newConversation: newConversation,
            currentConversationEmpty: currentConversationEmpty,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
