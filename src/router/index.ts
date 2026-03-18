import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FetchUtil from '@/api/http'

interface RouteMeta {
  requiresAuth?: boolean // 标记路由是否需要认证
}


const routes: Array<RouteRecordRaw> = [
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
    meta: { requiresAuth: true } as RouteMeta,
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
        meta: { requiresAuth: true } as RouteMeta,
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: () => import('@/components/knowledge/KnowledgeHome.vue'),
        meta: { requiresAuth: true } as RouteMeta,
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: () => import('@/components/user/ChangePassword.vue'),
        meta: { requiresAuth: true } as RouteMeta,
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('@/components/user/Account.vue'),
        meta: { requiresAuth: true } as RouteMeta,
      },
      {
        path: 'setting',
        name: 'system-setting',
        component: () => import('@/components/user/Account.vue'),
        meta: { requiresAuth: true } as RouteMeta,
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
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // 检查路由元信息
  const routeMeta = to.meta as RouteMeta
  if (routeMeta.requiresAuth) {
    try {
      const res = await FetchUtil.verifyToken()
      if (!res) {
        next({ path: '/login' })
        return
      }
    } catch (error) {
      next({ path: '/login' })
      return
    }
  }

  if (to.path.startsWith('/AI/chat') && !from.path.startsWith('/AI/chat')) {
    sessionStorage.setItem('chat_enter_new', '1')
    localStorage.removeItem('chat_current_conversation_uuid')
  }

  next()
})

export default router
