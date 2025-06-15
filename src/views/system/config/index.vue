<!-- src/views/system/config/index.vue -->
<template>
  <div class="config-container">
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="模块">
          <el-select
              v-model="queryParams.module"
              placeholder="请选择模块"
              clearable
              style="width: 150px"
          >
            <el-option label="系统配置" value="system" />
            <el-option label="用户配置" value="user" />
            <el-option label="信件配置" value="letter" />
            <el-option label="NFT配置" value="nft" />
            <el-option label="代币配置" value="token" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置键">
          <el-input
              v-model="queryParams.configKey"
              placeholder="请输入配置键"
              clearable
              style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>配置列表</span>
          <div class="actions">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增配置
            </el-button>
            <el-button
                type="danger"
                :disabled="!selectedIds.length"
                @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
            <el-button @click="handleRefreshCache">
              <el-icon><RefreshRight /></el-icon>
              刷新缓存
            </el-button>
          </div>
        </div>
      </template>

      <el-table
          v-loading="loading"
          :data="configList"
          @selection-change="handleSelectionChange"
          border
          stripe
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column prop="module" label="模块" width="120">
          <template #default="{ row }">
            <el-tag :type="getModuleType(row.module)">
              {{ getModuleName(row.module) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="configKey"
            label="配置键"
            min-width="200"
            show-overflow-tooltip
        />

        <el-table-column prop="configValue" label="配置值" min-width="200">
          <template #default="{ row }">
            <div class="config-value">
              <span v-if="!row.editing">{{ formatConfigValue(row) }}</span>
              <el-input
                  v-else
                  v-model="row.tempValue"
                  :type="getInputType(row.configType)"
                  size="small"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="configName"
            label="配置名称"
            min-width="150"
            show-overflow-tooltip
        />

        <el-table-column prop="configType" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getTypeTagType(row.configType)">
              {{ row.configType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="可见性" width="120" align="center">
          <template #default="{ row }">
            <div class="visibility-tags">
              <el-tag v-if="row.isFrontend" type="success" size="small">
                前端
              </el-tag>
              <el-tag v-if="row.isPublic" type="warning" size="small">
                公开
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            align="center"
        />

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <template v-if="!row.editing">
              <el-button link type="primary" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button link type="primary" @click="handleQuickEdit(row)">
                <el-icon><EditPen /></el-icon>
                快速修改
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
            <template v-else>
              <el-button link type="success" @click="handleSaveQuickEdit(row)">
                <el-icon><Check /></el-icon>
                保存
              </el-button>
              <el-button link @click="handleCancelQuickEdit(row)">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleQuery"
            @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- 配置编辑对话框 -->
    <ConfigEditDialog
        v-model="editDialogVisible"
        :config="currentConfig"
        :is-edit="isEdit"
        @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Refresh, Plus, Delete, RefreshRight,
  Edit, EditPen, Check, Close
} from '@element-plus/icons-vue'
import {
  getConfigPage,
  updateConfig,
  deleteConfig,
  batchDeleteConfig,
  refreshCache,
  type SysConfig,
  type ConfigPageParams
} from '@/api/system'
import ConfigEditDialog from './components/ConfigEditDialog.vue'

// 查询参数
const queryParams = reactive<ConfigPageParams>({
  pageNum: 1,
  pageSize: 20,
  module: undefined,
  configKey: undefined,
  status: undefined
})

// 数据状态
const loading = ref(false)
const configList = ref<any[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 编辑状态
const editDialogVisible = ref(false)
const currentConfig = ref<SysConfig>({} as SysConfig)
const isEdit = ref(false)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getConfigPage(queryParams)
    // 根据PageResult结构，数据在res.data.list中
    configList.value = res.data.list.map(item => ({
      ...item,
      editing: false,
      tempValue: item.configValue
    }))
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  queryParams.pageNum = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.module = undefined
  queryParams.configKey = undefined
  queryParams.status = undefined
  handleQuery()
}

// 新增配置
const handleAdd = () => {
  currentConfig.value = {
    module: 'system',
    configType: 'string',
    status: 1,
    isFrontend: 0,
    isPublic: 0,
    sortOrder: 0
  } as SysConfig
  isEdit.value = false
  editDialogVisible.value = true
}

// 编辑配置
const handleEdit = (row: SysConfig) => {
  currentConfig.value = { ...row }
  isEdit.value = true
  editDialogVisible.value = true
}

// 快速编辑
const handleQuickEdit = (row: any) => {
  row.editing = true
  row.tempValue = row.configValue
}

// 取消快速编辑
const handleCancelQuickEdit = (row: any) => {
  row.editing = false
  row.tempValue = row.configValue
}

// 保存快速编辑
const handleSaveQuickEdit = async (row: any) => {
  try {
    await updateConfig(row.id, {
      ...row,
      configValue: row.tempValue
    })
    row.configValue = row.tempValue
    row.editing = false
    ElMessage.success('修改成功')
  } catch (error) {
    ElMessage.error('修改失败')
  }
}

// 删除配置
const handleDelete = (row: SysConfig) => {
  ElMessageBox.confirm(
      `确定要删除配置 "${row.configName}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    await deleteConfig(row.id!)
    ElMessage.success('删除成功')
    loadData()
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个配置吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    await batchDeleteConfig(selectedIds.value)
    ElMessage.success('删除成功')
    loadData()
  })
}

// 状态变更
const handleStatusChange = async (row: SysConfig) => {
  try {
    await updateConfig(row.id!, row)
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('状态更新失败')
  }
}

// 刷新缓存
const handleRefreshCache = async () => {
  try {
    await refreshCache()
    ElMessage.success('缓存刷新成功')
  } catch (error) {
    ElMessage.error('缓存刷新失败')
  }
}

// 选择变更
const handleSelectionChange = (selection: SysConfig[]) => {
  selectedIds.value = selection.map(item => item.id!)
}

// 编辑成功
const handleEditSuccess = () => {
  editDialogVisible.value = false
  loadData()
}

// 格式化配置值
const formatConfigValue = (row: SysConfig) => {
  if (row.configType === 'json') {
    try {
      return JSON.stringify(JSON.parse(row.configValue), null, 2)
    } catch {
      return row.configValue
    }
  }
  if (row.configType === 'boolean') {
    return row.configValue === 'true' || row.configValue === '1' ? '是' : '否'
  }
  return row.configValue
}

// 获取输入框类型
const getInputType = (configType: string) => {
  switch (configType) {
    case 'number':
      return 'number'
    case 'json':
      return 'textarea'
    default:
      return 'text'
  }
}

// 获取模块名称
const getModuleName = (module: string) => {
  const moduleMap: Record<string, string> = {
    system: '系统',
    user: '用户',
    letter: '信件',
    nft: 'NFT',
    token: '代币'
  }
  return moduleMap[module] || module
}

// 获取模块类型
const getModuleType = (module: string): string => {
  const typeMap: Record<string, string> = {
    system: '',
    user: 'success',
    letter: 'warning',
    nft: 'danger',
    token: 'info'
  }
  return typeMap[module] || ''
}

// 获取类型标签类型
const getTypeTagType = (configType: string): string => {
  const typeMap: Record<string, string> = {
    string: '',
    number: 'success',
    boolean: 'warning',
    json: 'danger'
  }
  return typeMap[configType] || 'info'
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.config-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .actions {
    display: flex;
    gap: 10px;
  }
}

.config-value {
  max-width: 300px;
}

.visibility-tags {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>