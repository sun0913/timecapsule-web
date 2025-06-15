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

// 用户信息
export interface UserInfo {
    id: number
    userId: string
    username: string
    nickname?: string
    avatar?: string
    email?: string
    emailVerified: number
    phone?: string
    phoneVerified: number
    gender: number
    birthday?: string
    bio?: string
    level: number
    exp: number
    reputation: number
    status: number
    createTime: string
}

// 钱包信息
export interface WalletInfo {
    walletAddress: string
    chainId: number
    bindTime: string
    balances?: string
    isPrimary: boolean
}

// 修改密码参数
export interface ChangePasswordParams {
    oldPassword: string
    newPassword: string
}

// 钱包绑定参数
export interface WalletBindParams {
    walletAddress: string
    signature: string
    message: string
    chainId?: number
}

// ========== 认证相关 ==========

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

// 刷新Token
export function refreshToken(refreshToken: string) {
    return request({
        url: '/auth/refresh',
        method: 'post',
        params: { refreshToken },
    })
}

// 退出登录
export function logout() {
    return request({
        url: '/auth/logout',
        method: 'post',
    })
}

// ========== 用户信息 ==========

// 获取当前用户信息
export function getUserInfo() {
    return request({
        url: '/user/profile',
        method: 'get',
    })
}

// 获取指定用户信息
export function getUserById(userId: string) {
    return request({
        url: `/user/${userId}`,
        method: 'get',
    })
}

// 更新用户信息
export function updateUserInfo(data: Partial<UserInfo>) {
    return request({
        url: '/user/profile',
        method: 'put',
        data,
    })
}

// 修改密码
export function changePassword(data: ChangePasswordParams) {
    return request({
        url: '/user/password',
        method: 'put',
        data,
    })
}

// 重置密码
export function resetPassword(data: {
    account: string
    verifyCode: string
    newPassword: string
}) {
    return request({
        url: '/user/password/reset',
        method: 'post',
        params: data,
    })
}

// ========== 文件上传 ==========

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

// ========== 钱包相关 ==========

// 获取钱包信息
export function getWalletInfo() {
    return request({
        url: '/user/wallet',
        method: 'get',
    })
}

// 绑定钱包
export function bindWallet(data: WalletBindParams) {
    return request({
        url: '/user/wallet/bind',
        method: 'post',
        data,
    })
}

// 解绑钱包
export function unbindWallet(password: string, verifyCode: string) {
    return request({
        url: '/user/wallet/unbind',
        method: 'post',
        params: { password, verifyCode },
    })
}

// ========== 验证码相关 ==========

// 发送验证码
export function sendVerifyCode(data: {
    target: string
    type: 'email' | 'sms'
    purpose: 'register' | 'reset' | 'bind'
}) {
    return request({
        url: '/user/verify-code/send',
        method: 'post',
        params: data,
    })
}

// ========== 验证相关 ==========

// 检查用户名是否存在
export function checkUsername(username: string) {
    return request({
        url: '/user/check-username',
        method: 'get',
        params: { username },
    })
}

// 检查邮箱是否存在
export function checkEmail(email: string) {
    return request({
        url: '/user/check-email',
        method: 'get',
        params: { email },
    })
}