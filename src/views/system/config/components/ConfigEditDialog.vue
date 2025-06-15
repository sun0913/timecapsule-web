<!-- src/views/system/config/components/ConfigEditDialog.vue -->
<template>
  <el-dialog
      :title="isEdit ? '编辑配置' : '新增配置'"
      :model-value="modelValue"
      width="600px"
      @close="handleClose"
  >
    <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
    >
      <el-form-item label="模块" prop="module">
        <el-select
            v-model="formData.module"
            placeholder="请选择模块"
            :disabled="isEdit"
        >
          <el-option label="系统配置" value="system" />
          <el-option label="用户配置" value="user" />
          <el-option label="信件配置" value="letter" />
          <el-option label="NFT配置" value="nft" />
          <el-option label="代币配置" value="token" />
        </el-select>
      </el-form-item>

      <el-form-item label="配置键" prop="configKey">
        <el-input
            v-model="formData.configKey"
            placeholder="请输入配置键（如：site_name）"
            :disabled="isEdit"
        />
      </el-form-item>

      <el-form-item label="配置名称" prop="configName">
        <el-input
            v-model="formData.configName"
            placeholder="请输入配置名称"
        />
      </el-form-item>

      <el-form-item label="配置类型" prop="configType">
        <el-select
            v-model="formData.configType"
            placeholder="请选择配置类型"
        >
          <el-option label="字符串" value="string" />
          <el-option label="数字" value="number" />
          <el-option label="布尔值" value="boolean" />
          <el-option label="JSON" value="json" />
        </el-select>
      </el-form-item>

      <el-form-item label="配置值" prop="configValue">
        <template v-if="formData.configType === 'boolean'">
          <el-switch
              v-model="booleanValue"
              active-text="是"
              inactive-text="否"
          />
        </template>
        <template v-else-if="formData.configType === 'json'">
          <el-input
              v-model="formData.configValue"
              type="textarea"
              :rows="6"
              placeholder="请输入JSON格式的配置值"
          />
        </template>
        <template v-else>
          <el-input
              v-model="formData.configValue"
              :type="formData.configType === 'number' ? 'number' : 'text'"
              placeholder="请输入配置值"
          />
        </template>
      </el-form-item>

      <el-form-item label="配置说明" prop="configDesc">
        <el-input
            v-model="formData.configDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入配置说明"
        />
      </el-form-item>

      <el-form-item label="配置选项" prop="configOptions">
        <el-input
            v-model="formData.configOptions"
            type="textarea"
            :rows="3"
            placeholder="请输入配置选项（JSON格式）"
        />
      </el-form-item>

      <el-form-item label="可见性">
        <el-checkbox v-model="formData.isFrontend" :true-label="1" :false-label="0">
          前端可见
        </el-checkbox>
        <el-checkbox v-model="formData.isPublic" :true-label="1" :false-label="0">
          公开配置
        </el-checkbox>
      </el-form-item>

      <el-form-item label="排序号" prop="sortOrder">
        <el-input-number v-model="formData.sortOrder" :min="0" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createConfig, updateConfig, type SysConfig } from '@/api/system'

interface Props {
  modelValue: boolean
  config: SysConfig
  isEdit: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const formRef = ref<FormInstance>()
const formData = reactive<SysConfig>({} as SysConfig)

// 布尔值的双向绑定
const booleanValue = computed({
  get: () => formData.configValue === 'true' || formData.configValue === '1',
  set: (val) => {
    formData.configValue = val ? 'true' : 'false'
  }
})

// 表单规则
const rules: FormRules = {
  module: [
    { required: true, message: '请选择模块', trigger: 'change' }
  ],
  configKey: [
    { required: true, message: '请输入配置键', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '配置键必须以字母开头，只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  configName: [
    { required: true, message: '请输入配置名称', trigger: 'blur' }
  ],
  configType: [
    { required: true, message: '请选择配置类型', trigger: 'change' }
  ],
  configValue: [
    { required: true, message: '请输入配置值', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (formData.configType === 'json' && value) {
          try {
            JSON.parse(value)
            callback()
          } catch {
            callback(new Error('请输入有效的JSON格式'))
          }
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  configOptions: [
    {
      validator: (rule, value, callback) => {
        if (value) {
          try {
            JSON.parse(value)
            callback()
          } catch {
            callback(new Error('请输入有效的JSON格式'))
          }
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听props变化
watch(() => props.config, (newVal) => {
  Object.assign(formData, newVal)
}, { deep: true, immediate: true })

// 关闭对话框
const handleClose = () => {
  emit('update:modelValue', false)
  formRef.value?.resetFields()
}

// 提交表单
const handleSubmit = async () => {
  await formRef.value?.validate()

  try {
    if (props.isEdit) {
      await updateConfig(formData.id!, formData)
      ElMessage.success('更新成功')
    } else {
      await createConfig(formData)
      ElMessage.success('新增成功')
    }
    emit('success')
    handleClose()
  } catch (error) {
    ElMessage.error(props.isEdit ? '更新失败' : '新增失败')
  }
}
</script>