// src/api/system/config.ts
import request from '@/utils/request'

// 系统配置类型
export interface SysConfig {
    id?: number
    module: string
    configKey: string
    configValue: string
    configName: string
    configType: string
    configDesc?: string
    configOptions?: string
    isFrontend: number
    isPublic: number
    sortOrder: number
    status: number
    createBy?: string
    updateBy?: string
    createTime?: string
    updateTime?: string
}

// 分页查询系统配置
export function getConfigPage(params: {
    pageNum?: number
    pageSize?: number
    module?: string
    configKey?: string
    status?: number
}) {
    return request({
        url: '/system/config/page',
        method: 'get',
        params,
    })
}

// 获取配置详情
export function getConfigById(id: number) {
    return request({
        url: `/system/config/${id}`,
        method: 'get',
    })
}

// 新增配置
export function createConfig(data: SysConfig) {
    return request({
        url: '/system/config',
        method: 'post',
        data,
    })
}

// 更新配置
export function updateConfig(id: number, data: SysConfig) {
    return request({
        url: `/system/config/${id}`,
        method: 'put',
        data,
    })
}

// 删除配置
export function deleteConfig(id: number) {
    return request({
        url: `/system/config/${id}`,
        method: 'delete',
    })
}

// 批量删除
export function batchDeleteConfig(ids: number[]) {
    return request({
        url: '/system/config/batch',
        method: 'delete',
        data: ids,
    })
}

// 根据配置键获取值
export function getConfigValue(configKey: string) {
    return request({
        url: `/system/config/value/${configKey}`,
        method: 'get',
    })
}

// 根据模块获取配置
export function getConfigsByModule(module: string) {
    return request({
        url: `/system/config/module/${module}`,
        method: 'get',
    })
}

// 获取前端配置
export function getFrontendConfigs() {
    return request({
        url: '/system/config/frontend',
        method: 'get',
    })
}

// 刷新缓存
export function refreshCache() {
    return request({
        url: '/system/config/refresh-cache',
        method: 'post',
    })
}