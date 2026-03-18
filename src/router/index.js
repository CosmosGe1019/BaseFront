import { createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FetchUtil from '@/api/http';
const routes = [
    {
        path: '/home',
        alias: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/login/Login.vue'),
    },
    {
        path: '/AI',
        name: 'AI',
        component: () => import('@/layouts/BasicLayout.vue'),
        redirect: '/AI/chat',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'chat',
                name: 'chat',
                component: () => import('@/views/AiChatView.vue'),
                children: [
                    {
                        path: '', // 默认子路由
                        name: 'chat-default',
                        component: () => import('@/components/ai_chat/ChatPanel.vue'),
                    },
                    {
                        path: ':name',
                        name: 'chat-main',
                        component: () => import('@/components/ai_chat/ChatPanel.vue'),
                    },
                ],
            },
            {
                path: 'test',
                name: 'test',
                component: () => import('@/views/AiTestView.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'knowledge',
                name: 'knowledge',
                component: () => import('@/components/knowledge/KnowledgeHome.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'change-password',
                name: 'change-password',
                component: () => import('@/components/user/ChangePassword.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'account',
                name: 'account',
                component: () => import('@/components/user/Account.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'setting',
                name: 'system-setting',
                component: () => import('@/components/setting/SystemSetting.vue'),
                meta: { requiresAuth: true },
            },
        ],
    },
    {
        path: '/terms',
        name: 'user-agreement',
        component: () => import('@/components/setting/UserAgreement.vue'),
    },
    {
        path: '/privacy',
        name: 'privacy-policy',
        component: () => import('@/components/setting/PrivacyPolicy.vue'),
    },
    {
        path: '/404',
        name: 'not-found',
        component: () => import('@/components/not_found/NotFound.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    }
];
const router = createRouter({
    history: createWebHistory(),   
    routes,
});
async function verifyTokenAndNavigate(next) {
    try {
        const res = await FetchUtil.verifyToken();   
        console.log(res);
        next(res ? undefined : { path: '/login' });
    }
    catch (error) {
        next({ path: '/login' });
    }
}
router.beforeEach(async (to, from, next) => {
    // 检查路由元信息
    const routeMeta = to.meta;
    if (routeMeta.requiresAuth) {
        await verifyTokenAndNavigate(next);
    }
    else {
        next();
    }
});
export default router;
