/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { useRoute, useRouter } from 'vue-router';
import { h, onMounted, ref, watch } from 'vue';
import http from '../api/http';
import { useUserStore } from '@/stores/user';
import { ClusterOutlined, GlobalOutlined, HomeOutlined, SettingOutlined, UserOutlined, } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import { useConversationStore } from '@/stores/conversation';
const doMenuClick = ({ key }) => {
    if (key === '/account') {
        // 触发 ChatAside 的账号管理 tab 切换事件
        window.dispatchEvent(new CustomEvent('show-account-tab'));
    }
    router.push({
        path: key,
    });
    console.log(useConversationStore().getConfirmConversation);
};
onMounted(() => {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'default');
    }
    applyTheme(theme.value);
});
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
const router = useRouter();
const showLogoutModal = ref(false);
const route = useRoute();
async function confirmLogout() {
    await http.logout();
    router.push('/home');
    showLogoutModal.value = false;
    useUserStore().logout();
}
const current = ref([]);
watch(() => route.path, (newPath) => {
    // 根据当前路由路径设置选中的菜单项
    current.value = [newPath];
}, { immediate: true });
const items = ref([
    {
        key: '/AI/chat', // 对应路由中的 alias: '/'
        icon: () => h(HomeOutlined),
        label: '主页',
        title: '主页',
    },
    {
        key: '/AI/account', // 跳转到账号管理页面
        icon: () => h(UserOutlined),
        label: '用户管理',
        title: '账号管理',
    },
    {
        key: '/AI/knowledge', // 对应路由中的 /AI/knowledge
        icon: () => h(GlobalOutlined),
        label: '知识库管理',
        title: '知识库管理',
    },
    {
        key: '/AI/setting', // 跳转到系统设置页面
        icon: () => h(SettingOutlined),
        label: '系统设置',
        title: '系统设置',
    },
    {
        key: '/AI/test', // 对应路由中的 /AI/chat
        icon: () => h(ClusterOutlined),
        label: '系统测试',
        title: '系统测试',
    },
]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['transparent-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['transparent-menu']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "w-full bg-[var(--theme-bg)] border-b border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-2 md:py-2 relative z-10 min-h-33" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/AI/chat",
    ...{ class: "flex items-center gap-5 w-1/6 md:w-auto" },
}));
const __VLS_2 = __VLS_1({
    to: "/AI/chat",
    ...{ class: "flex items-center gap-5 w-1/6 md:w-auto" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-center rounded-full w-10 h-10 mr-2 dark:bg-transparent" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    t: "1752914624151",
    ...{ class: "icon" },
    viewBox: "0 0 1051 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "48",
    height: "48",
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-w-0 w-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[var(--theme-main)] to-emerald-400 bg-clip-text text-transparent drop-shadow-sm select-none break-words" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm md:text-base text-[var(--theme-main)] opacity-80 mt-0.5 select-none break-words" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-[var(--theme-main)] text-xs leading-relaxed font-medium select-none break-words w-full max-w-full mt-0.5" },
});
var __VLS_3;
const __VLS_4 = {}.AMenu;
/** @type {[typeof __VLS_components.AMenu, typeof __VLS_components.aMenu, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    ...{ class: "transparent-menu" },
    selectedKeys: (__VLS_ctx.current),
    mode: "horizontal",
    items: (__VLS_ctx.items),
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    ...{ class: "transparent-menu" },
    selectedKeys: (__VLS_ctx.current),
    mode: "horizontal",
    items: (__VLS_ctx.items),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.doMenuClick)
};
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ml-4 flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showLogoutModal = true;
        } },
    ...{ class: "ml-4 flex items-center justify-center w-8 h-8 rounded-full transition" },
    title: "退出",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    t: "1753333840646",
    ...{ class: "icon" },
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "22",
    height: "22",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M675.84 768c-22.528 0-40.96 18.944-40.96 42.496v106.496c0 11.776-8.704 24.576-19.968 24.576h-512c-11.264 0-20.992-13.312-20.992-24.576V106.496c0-11.776 9.728-24.576 20.992-24.576h512c11.264 0 19.968 13.312 19.968 24.576v106.496c0 23.552 18.432 42.496 40.96 42.496s40.96-18.944 40.96-42.496V106.496C716.8 47.616 670.72 0 614.4 0H102.4C46.08 0 0 47.616 0 106.496v810.496C0 976.384 46.08 1024 102.4 1024h512c56.32 0 102.4-47.616 102.4-106.496v-106.496c0-24.064-18.432-43.008-40.96-43.008z",
    fill: "#d81e06",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M1011.2 481.792l-184.32-181.248c-16.896-16.384-44.544-16.384-61.44 0-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024L875.52 469.504H448.512c-24.064 0-43.52 18.944-43.52 42.496 0 23.552 19.456 42.496 43.52 42.496H875.52l-110.08 108.032c-16.896 16.384-16.896 43.008-1.024 59.392l1.024 1.024c8.704 8.192 19.456 12.8 30.72 12.8s22.528-4.096 30.72-12.8l184.32-181.248c16.896-16.384 16.896-43.52 0-59.904z",
    fill: "#d81e06",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-gray-700 font-medium select-none" },
});
if (__VLS_ctx.showLogoutModal) {
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
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-bg)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-33']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-1/6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['to-emerald-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['drop-shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['transparent-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
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
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            doMenuClick: doMenuClick,
            showLogoutModal: showLogoutModal,
            confirmLogout: confirmLogout,
            current: current,
            items: items,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
