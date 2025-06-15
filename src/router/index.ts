import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: { title: '登录', noAuth: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/register/index.vue'),
        meta: { title: '注册', noAuth: true },
    },
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/views/home/index.vue'),
                meta: { title: '首页', noAuth: true }, // 添加 noAuth，允许未登录访问
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/profile/index.vue'),
                meta: { title: '个人中心', requireAuth: true }, // 明确标记需要登录
            },
            {
                path: 'letter',
                name: 'Letter',
                component: () => import('@/views/letter/index.vue'),
                meta: { title: '写信', requireAuth: true }, // 需要登录
            },
            {
                path: 'letter/write',
                name: 'WriteLetter',
                component: () => import('@/views/letter/write.vue'),
                meta: { title: '写信', requireAuth: true }, // 需要登录
            },
            {
                path: 'inbox',
                name: 'Inbox',
                component: () => import('@/views/letter/inbox.vue'),
                meta: { title: '收件箱', requireAuth: true }, // 需要登录
            },
            {
                path: 'stamps',
                name: 'Stamps',
                component: () => import('@/views/stamps/index.vue'),
                meta: { title: '邮票收藏', noAuth: true }, // 可以浏览，但购买需要登录
            },
            {
                path: 'friends',
                name: 'Friends',
                component: () => import('@/views/social/friends.vue'),
                meta: { title: '笔友', requireAuth: true }, // 需要登录
            },
            {
                path: 'wallet',
                name: 'Wallet',
                component: () => import('@/views/wallet/index.vue'),
                meta: { title: '我的钱包', requireAuth: true }, // 需要登录
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/settings/index.vue'),
                meta: { title: '设置', requireAuth: true }, // 需要登录
            },
            {
                path: 'system',
                name: 'System',
                meta: { title: '系统管理', requireAuth: true },
                children: [
                    {
                        path: 'config',
                        name: 'SystemConfig',
                        component: () => import('@/views/system/config/index.vue'),
                        meta: {
                            title: '系统配置',
                            requireAuth: true,
                            roles: ['ADMIN'] // 只有管理员可访问
                        }
                    }
                ]
            }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 路由守卫 - 优化逻辑
router.beforeEach((to, _from, next) => {
    const userStore = useUserStore()

    // 设置页面标题
    document.title = `${to.meta.title || '时光信笺'} - 时光信笺`

    // 明确需要认证的页面
    if (to.meta.requireAuth && !userStore.token) {
        // 保存目标路径，登录后跳转
        sessionStorage.setItem('redirectPath', to.fullPath)
        next('/login')
        return
    }

    if (to.meta.roles && userStore.userInfo) {
        const hasRole = to.meta.roles.some((role: string) =>
            userStore.userInfo.roles?.includes(role)
        )

        if (!hasRole) {
            ElMessage.error('没有访问权限')
            next('/')
            return
        }
    }

    next()
})

export default router