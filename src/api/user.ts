import request from '@/utils/request'

// 登录参数
export interface LoginParams {
    username: string
    password: string
    captcha?: string
    captchaId?: string
}

// 注册参数
export interface RegisterParams {
    username: string
    password: string
    email?: string
    inviteCode?: string
    platform?: string
}

// 用户登录
export function login(data: LoginParams) {
    return request({
        url: '/auth/login',
        method: 'post',
        data,
    })
}

// 用户注册
export function register(data: RegisterParams) {
    return request({
        url: '/auth/register',
        method: 'post',
        data: {
            ...data,
            platform: data.platform || 'web',
        },
    })
}

// 获取用户信息
export function getUserInfo() {
    return request({
        url: '/user/profile',
        method: 'get',
    })
}

// 更新用户信息
export function updateUserInfo(data: any) {
    return request({
        url: '/user/profile',
        method: 'put',
        data,
    })
}

// 上传头像
export function uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return request({
        url: '/file/avatar',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}