<!-- src/views/profile/components/WalletBindDialog.vue -->
<template>
  <el-dialog
      :model-value="modelValue"
      title="绑定钱包"
      width="500px"
      @close="handleClose"
  >
    <div class="bind-steps">
      <el-steps :active="currentStep" align-center>
        <el-step title="连接钱包" />
        <el-step title="签名验证" />
        <el-step title="绑定成功" />
      </el-steps>

      <!-- 步骤1：连接钱包 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="wallet-options">
          <div
              class="wallet-option"
              @click="connectMetaMask"
          >
            <img src="/icons/metamask.svg" alt="MetaMask" />
            <span>MetaMask</span>
          </div>
          <div
              class="wallet-option"
              @click="connectWalletConnect"
          >
            <img src="/icons/walletconnect.svg" alt="WalletConnect" />
            <span>WalletConnect</span>
          </div>
        </div>
        <el-alert
            type="info"
            :closable="false"
            show-icon
        >
          请选择您的钱包进行连接
        </el-alert>
      </div>

      <!-- 步骤2：签名验证 -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="sign-info">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="钱包地址">
              {{ formatAddress(walletAddress) }}
            </el-descriptions-item>
            <el-descriptions-item label="网络">
              {{ chainName }}
            </el-descriptions-item>
          </el-descriptions>

          <el-alert
              type="warning"
              :closable="false"
              show-icon
              class="sign-tip"
          >
            请在钱包中签名以验证身份，此操作不会产生任何费用
          </el-alert>

          <el-button
              type="primary"
              :loading="signing"
              @click="requestSignature"
          >
            请求签名
          </el-button>
        </div>
      </div>

      <!-- 步骤3：绑定成功 -->
      <div v-if="currentStep === 2" class="step-content">
        <el-result
            icon="success"
            title="绑定成功"
            sub-title="您的钱包已成功绑定"
        >
          <template #extra>
            <el-button type="primary" @click="handleComplete">
              完成
            </el-button>
          </template>
        </el-result>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { bindWallet } from '@/api/user'
import { ethers } from 'ethers'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const currentStep = ref(0)
const walletAddress = ref('')
const chainId = ref(137) // 默认Polygon
const signing = ref(false)

const chainName = computed(() => {
  const chains: Record<number, string> = {
    1: 'Ethereum Mainnet',
    137: 'Polygon',
    80001: 'Mumbai Testnet',
  }
  return chains[chainId.value] || 'Unknown'
})

// 连接MetaMask
const connectMetaMask = async () => {
  if (!window.ethereum) {
    ElMessage.error('请先安装MetaMask钱包')
    return
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])

    if (accounts.length > 0) {
      walletAddress.value = accounts[0]
      const network = await provider.getNetwork()
      chainId.value = Number(network.chainId)
      currentStep.value = 1
    }
  } catch (error: any) {
    ElMessage.error(error.message || '连接失败')
  }
}

// 连接WalletConnect
const connectWalletConnect = () => {
  ElMessage.info('WalletConnect功能开发中')
}

// 请求签名
const requestSignature = async () => {
  if (!window.ethereum) return

  signing.value = true
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    // 生成签名消息
    const message = `绑定钱包到时光信笺\n钱包地址: ${walletAddress.value}\n时间戳: ${Date.now()}`

    // 请求签名
    const signature = await signer.signMessage(message)

    // 提交绑定
    await bindWallet({
      walletAddress: walletAddress.value,
      signature,
      message,
      chainId: chainId.value,
    })

    currentStep.value = 2
    ElMessage.success('钱包绑定成功')

  } catch (error: any) {
    ElMessage.error(error.message || '签名失败')
  } finally {
    signing.value = false
  }
}

// 格式化地址
const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 关闭对话框
const handleClose = () => {
  emit('update:modelValue', false)
  // 重置状态
  currentStep.value = 0
  walletAddress.value = ''
}

// 完成绑定
const handleComplete = () => {
  emit('success')
  handleClose()
}

// TypeScript类型声明
declare global {
  interface Window {
    ethereum?: any
  }
}
</script>

<style lang="scss" scoped>
.bind-steps {
  padding: 20px;
}

.step-content {
  margin-top: 40px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wallet-options {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  .wallet-option {
    width: 150px;
    padding: 20px;
    border: 2px solid #e4e7ed;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;

    &:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    img {
      width: 60px;
      height: 60px;
      margin: 0 auto 10px;
      display: block;
    }

    span {
      display: block;
      font-weight: 500;
      color: #303133;
    }
  }
}

.sign-info {
  width: 100%;
  text-align: center;

  .el-descriptions {
    margin-bottom: 20px;
  }

  .sign-tip {
    margin-bottom: 20px;
  }
}
</style>