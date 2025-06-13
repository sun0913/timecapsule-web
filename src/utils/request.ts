import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 响应数据格式
export interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
    timestamp: number
    traceId?: string
}

// 创建axios实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()

        // 添加token
        if (userStore.token) {
            config.headers.Authorization = `Bearer ${userStore.token}`
        }

        // 添加平台标识
        config.headers['X-Platform'] = 'web'

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const res = response.data

        // 成功响应
        if (res.code === 200) {
            return res
        }

        // 业务错误
        ElMessage.error(res.message || '请求失败')
        return Promise.reject(new Error(res.message || '请求失败'))
    },
    (error) => {
        const userStore = useUserStore()

        if (error.response) {
            const { status, data } = error.response

            switch (status) {
                case 401:
                    // 未认证，跳转登录
                    ElMessage.error('登录已过期，请重新登录')
                    userStore.logout()
                    break
                case 403:
                    ElMessage.error('没有权限访问')
                    break
                case 404:
                    ElMessage.error('请求的资源不存在')
                    break
                case 500:
                    ElMessage.error('服务器错误')
                    break
                default:
                    ElMessage.error(data.message || '请求失败')
            }
        } else {
            ElMessage.error('网络错误，请检查网络连接')
        }

        return Promise.reject(error)
    }
)

export default service