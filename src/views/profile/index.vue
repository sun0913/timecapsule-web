<template>
  <div class="profile-page">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button v-if="!isEdit" type="primary" text @click="isEdit = true">
            编辑资料
          </el-button>
        </div>
      </template>

      <div class="profile-content">
        <div class="avatar-section">
          <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :disabled="!isEdit"
          >
            <el-avatar
                :size="120"
                :src="profileForm.avatar || '/avatar/default.png'"
                class="avatar"
            />
            <div v-if="isEdit" class="avatar-overlay">
              <el-icon><Camera /></el-icon>
              <span>更换头像</span>
            </div>
          </el-upload>

          <div class="user-basic">
            <h2>{{ userInfo?.username }}</h2>
            <p>{{ userInfo?.userId }}</p>
          </div>
        </div>

        <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
            class="profile-form"
        >
          <el-form-item label="昵称" prop="nickname">
            <el-input
                v-model="profileForm.nickname"
                :disabled="!isEdit"
                placeholder="请输入昵称"
            />
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="profileForm.gender" :disabled="!isEdit">
              <el-radio :label="0">保密</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="生日" prop="birthday">
            <el-date-picker
                v-model="profileForm.birthday"
                type="date"
                placeholder="选择生日"
                :disabled="!isEdit"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
                v-model="profileForm.email"
                :disabled="!isEdit"
                placeholder="请输入邮箱"
            />
          </el-form-item>

          <el-form-item label="个人简介" prop="bio">
            <el-input
                v-model="profileForm.bio"
                type="textarea"
                :rows="4"
                :disabled="!isEdit"
                placeholder="介绍一下自己吧"
                maxlength="500"
                show-word-limit
            />
          </el-form-item>

          <el-form-item v-if="isEdit">
            <el-button type="primary" @click="handleSave">保存修改</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="stats-card">
      <template #header>
        <span>我的数据</span>
      </template>

      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ userInfo?.level || 1 }}</div>
          <div class="stat-label">等级</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo?.reputation || 100 }}</div>
          <div class="stat-label">信誉值</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">发送信件</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">收到信件</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateUserInfo, uploadAvatar } from '@/api/user'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const profileFormRef = ref<FormInstance>()
const isEdit = ref(false)

const profileForm = reactive({
  nickname: '',
  avatar: '',
  gender: 0,
  birthday: '',
  email: '',
  bio: '',
})

const profileRules: FormRules = {
  nickname: [
    { max: 50, message: '昵称长度不能超过50个字符', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  bio: [
    { max: 500, message: '个人简介不能超过500个字符', trigger: 'blur' },
  ],
}

// 上传配置
const uploadUrl = '/api/v1/file/avatar'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${userStore.token}`,
}))

// 初始化表单数据
const initFormData = () => {
  if (userInfo.value) {
    profileForm.nickname = userInfo.value.nickname || ''
    profileForm.avatar = userInfo.value.avatar || ''
    profileForm.gender = userInfo.value.gender || 0
    profileForm.birthday = userInfo.value.birthday || ''
    profileForm.email = userInfo.value.email || ''
    profileForm.bio = userInfo.value.bio || ''
  }
}

onMounted(() => {
  initFormData()
})

// 头像上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    profileForm.avatar = response.data
    ElMessage.success('头像上传成功')
    // 更新store中的用户信息
    userStore.fetchUserInfo()
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 头像上传前验证
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(rawFile.type)
  const isLt5M = rawFile.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 保存修改
const handleSave = async () => {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateUserInfo(profileForm)
        ElMessage.success('保存成功')
        isEdit.value = false
        // 更新用户信息
        await userStore.fetchUserInfo()
      } catch (error) {
        // 错误已在request中处理
      }
    }
  })
}

// 取消编辑
const handleCancel = () => {
  isEdit.value = false
  initFormData()
}
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;

  .avatar-uploader {
    position: relative;

    .avatar {
      cursor: pointer;
      border: 4px solid #f0f0f0;
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      opacity: 0;
      transition: opacity 0.3s;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }

      .el-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }
    }
  }

  .user-basic {
    h2 {
      margin: 0 0 10px;
      font-size: 24px;
    }

    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }
}

.profile-form {
  max-width: 600px;
}

.stats-card {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .stat-item {
      text-align: center;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 8px;

      .stat-value {
        font-size: 32px;
        font-weight: 600;
        color: #667eea;
        margin-bottom: 5px;
      }

      .stat-label {
        color: #909399;
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 768px) {
  .profile-page {
    grid-template-columns: 1fr;
  }
}
</style>