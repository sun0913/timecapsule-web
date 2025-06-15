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
            <h2>{{ userInfo?.nickname || userInfo?.username }}</h2>
            <p>UID: {{ userInfo?.userId }}</p>
            <div class="user-badges">
              <el-tag>Lv.{{ userInfo?.level || 1 }}</el-tag>
              <el-tag type="warning">信誉 {{ userInfo?.reputation || 100 }}</el-tag>
            </div>
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
                maxlength="50"
                show-word-limit
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
                :disabled-date="disabledDate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
                v-model="profileForm.email"
                :disabled="!isEdit"
                placeholder="请输入邮箱"
            >
              <template #append v-if="userInfo?.emailVerified === 0">
                <el-button @click="verifyEmail">验证</el-button>
              </template>
            </el-input>
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

    <!-- 右侧：钱包和安全设置 -->
    <div class="side-cards">
      <!-- 钱包卡片 -->
      <el-card class="wallet-card">
        <template #header>
          <div class="card-header">
            <span>我的钱包</span>
            <el-icon><Wallet /></el-icon>
          </div>
        </template>

        <div v-if="!walletInfo" class="wallet-empty">
          <el-empty description="未绑定钱包">
            <el-button type="primary" @click="showBindWallet = true">
              绑定钱包
            </el-button>
          </el-empty>
        </div>

        <div v-else class="wallet-info">
          <div class="wallet-address">
            <el-text type="info">钱包地址</el-text>
            <el-text class="address" :title="walletInfo.walletAddress">
              {{ formatAddress(walletInfo.walletAddress) }}
            </el-text>
          </div>
          <div class="wallet-meta">
            <el-text type="info">绑定时间</el-text>
            <el-text>{{ walletInfo.bindTime }}</el-text>
          </div>
          <el-button type="danger" text @click="handleUnbindWallet">
            解绑钱包
          </el-button>
        </div>
      </el-card>

      <!-- 安全设置卡片 -->
      <el-card class="security-card">
        <template #header>
          <div class="card-header">
            <span>安全设置</span>
            <el-icon><Lock /></el-icon>
          </div>
        </template>

        <div class="security-items">
          <div class="security-item">
            <div class="item-info">
              <el-icon><Key /></el-icon>
              <span>登录密码</span>
            </div>
            <el-button text @click="showChangePassword = true">修改</el-button>
          </div>

          <div class="security-item">
            <div class="item-info">
              <el-icon><Message /></el-icon>
              <span>邮箱验证</span>
              <el-tag v-if="userInfo?.emailVerified" type="success" size="small">
                已验证
              </el-tag>
              <el-tag v-else type="info" size="small">未验证</el-tag>
            </div>
            <el-button v-if="!userInfo?.emailVerified" text @click="verifyEmail">
              验证
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 账号统计 -->
      <el-card class="stats-card">
        <template #header>
          <span>账号统计</span>
        </template>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ userStats.letterCount || 0 }}</div>
            <div class="stat-label">发送信件</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats.nftCount || 0 }}</div>
            <div class="stat-label">NFT邮票</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats.friendCount || 0 }}</div>
            <div class="stat-label">好友数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats.tokenBalance || 0 }}</div>
            <div class="stat-label">TIME代币</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
        v-model="showChangePassword"
        title="修改密码"
        width="400px"
    >
      <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入当前密码"
              show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确定</el-button>
      </template>
    </el-dialog>

    <!-- 绑定钱包对话框 -->
    <WalletBindDialog
        v-model="showBindWallet"
        @success="handleBindSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  updateUserInfo,
  uploadAvatar,
  getWalletInfo,
  changePassword,
  sendVerifyCode,
  type UserInfo,
  type WalletInfo,
  type ChangePasswordParams
} from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Camera, Wallet, Lock, Key, Message
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import WalletBindDialog from './components/WalletBindDialog.vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 表单相关
const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const isEdit = ref(false)
const showChangePassword = ref(false)
const showBindWallet = ref(false)

// 数据
const profileForm = reactive<Partial<UserInfo>>({
  nickname: '',
  avatar: '',
  gender: 0,
  birthday: '',
  email: '',
  bio: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const walletInfo = ref<WalletInfo | null>(null)
const userStats = ref({
  letterCount: 0,
  nftCount: 0,
  friendCount: 0,
  tokenBalance: 0,
})

// 表单规则
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

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度在8-20个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 上传配置
const uploadUrl = '/api/v1/file/avatar'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${userStore.token}`,
}))

// 初始化数据
const initData = async () => {
  // 初始化表单数据
  if (userInfo.value) {
    Object.assign(profileForm, {
      nickname: userInfo.value.nickname || '',
      avatar: userInfo.value.avatar || '',
      gender: userInfo.value.gender || 0,
      birthday: userInfo.value.birthday || '',
      email: userInfo.value.email || '',
      bio: userInfo.value.bio || '',
    })
  }

  // 获取钱包信息
  try {
    const res = await getWalletInfo()
    walletInfo.value = res.data
  } catch (error) {
    // 未绑定钱包
  }

  // TODO: 获取用户统计数据
}

onMounted(() => {
  initData()
})

// 头像上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    profileForm.avatar = response.data
    ElMessage.success('头像上传成功')
    userStore.fetchUserInfo()
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
  await profileFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await updateUserInfo(profileForm)
        ElMessage.success('保存成功')
        isEdit.value = false
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
  initData()
}

// 修改密码
const handleChangePassword = async () => {
  await passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await changePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        })
        ElMessage.success('密码修改成功')
        showChangePassword.value = false
        // 清空表单
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      } catch (error) {
        // 错误已处理
      }
    }
  })
}

// 验证邮箱
const verifyEmail = async () => {
  if (!profileForm.email) {
    ElMessage.warning('请先填写邮箱地址')
    return
  }

  try {
    await sendVerifyCode({
      target: profileForm.email,
      type: 'email',
      purpose: 'bind',
    })
    ElMessage.success('验证码已发送到您的邮箱')
    // TODO: 打开验证码输入对话框
  } catch (error) {
    // 错误已处理
  }
}

// 解绑钱包
const handleUnbindWallet = () => {
  ElMessageBox.confirm(
      '解绑钱包后需要重新绑定才能使用相关功能，确定要解绑吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    // TODO: 实现解绑功能
    ElMessage.info('功能开发中')
  })
}

// 绑定成功
const handleBindSuccess = () => {
  showBindWallet.value = false
  initData()
}

// 格式化地址
const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 禁用未来日期
const disabledDate = (date: Date) => {
  return date.getTime() > Date.now()
}
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
      margin: 0 0 10px;
      color: #909399;
      font-size: 14px;
    }

    .user-badges {
      display: flex;
      gap: 8px;
    }
  }
}

.profile-form {
  max-width: 600px;
}

.side-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 钱包卡片
.wallet-card {
  .wallet-empty {
    padding: 20px 0;
  }

  .wallet-info {
    .wallet-address {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 15px;

      .address {
        font-family: monospace;
        font-size: 14px;
      }
    }

    .wallet-meta {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ebeef5;
    }
  }
}

// 安全设置卡片
.security-card {
  .security-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .item-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        font-size: 18px;
        color: #909399;
      }
    }
  }
}

// 统计卡片
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