import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo, type LoginParams, type RegisterParams } from '@/api/user'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
    const token = ref<string>(localStorage.getItem('token') || '')
    const refreshToken = ref<string>(localStorage.getItem('refreshToken') || '')
    const userInfo = ref<any>(null)

    const isLoggedIn = computed(() => !!token.value)

    // 登录
    async function handleLogin(params: LoginParams) {
        try {
            const res = await login(params)
            token.value = res.data.token
            refreshToken.value = res.data.refreshToken

            localStorage.setItem('token', token.value)
            localStorage.setItem('refreshToken', refreshToken.value)

            ElMessage.success('登录成功')
            router.push('/')

            // 获取用户信息
            await fetchUserInfo()
        } catch (error: any) {
            ElMessage.error(error.message || '登录失败')
            throw error
        }
    }

    // 注册
    async function handleRegister(params: RegisterParams) {
        try {
            const res = await register(params)
            token.value = res.data.token
            refreshToken.value = res.data.refreshToken

            localStorage.setItem('token', token.value)
            localStorage.setItem('refreshToken', refreshToken.value)

            ElMessage.success('注册成功')
            router.push('/')

            // 获取用户信息
            await fetchUserInfo()
        } catch (error: any) {
            ElMessage.error(error.message || '注册失败')
            throw error
        }
    }

    // 获取用户信息
    async function fetchUserInfo() {
        if (!token.value) return

        try {
            const res = await getUserInfo()
            userInfo.value = res.data
        } catch (error) {
            console.error('获取用户信息失败', error)
        }
    }

    // 退出登录
    function logout() {
        token.value = ''
        refreshToken.value = ''
        userInfo.value = null

        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')

        router.push('/login')
    }

    return {
        token,
        refreshToken,
        userInfo,
        isLoggedIn,
        handleLogin,
        handleRegister,
        fetchUserInfo,
        logout,
    }
})