<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="floating-letter letter-1">✉️</div>
        <div class="floating-letter letter-2">💌</div>
        <div class="floating-letter letter-3">📮</div>
        <div class="floating-letter letter-4">✉️</div>
      </div>

      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">让每一封信</span>
          <br />
          <span class="sub-title">都成为永恒的回忆</span>
        </h1>

        <p class="hero-desc">
          在这个快节奏的数字时代，重拾书信的温度<br />
          用区块链技术，让美好永存
        </p>

        <div class="hero-actions">
          <el-button
              type="primary"
              size="large"
              round
              @click="handleStartWriting"
              class="cta-button"
          >
            <el-icon><EditPen /></el-icon>
            开始写信
          </el-button>

          <el-button
              size="large"
              round
              @click="scrollToFeatures"
              class="secondary-button"
          >
            了解更多
          </el-button>
        </div>

        <!-- 统计数据 -->
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">10,000+</div>
            <div class="stat-label">永恒信件</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50,000+</div>
            <div class="stat-label">活跃笔友</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100,000+</div>
            <div class="stat-label">NFT邮票</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色功能区 -->
    <section class="features-section" ref="featuresSection">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">重新定义书信文化</span>
        </h2>
        <p class="section-desc">结合传统书信的温情与Web3的创新</p>

        <div class="features-grid">
          <!-- 时光信件 -->
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/icons/time-letter.svg" alt="时光信件" />
            </div>
            <h3>时光信件</h3>
            <p>写给未来的自己或他人，在指定时间自动送达，见证岁月变迁</p>
            <el-tag type="info">延迟投递</el-tag>
          </div>

          <!-- NFT邮票 -->
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/icons/nft-stamp.svg" alt="NFT邮票" />
            </div>
            <h3>NFT邮票收藏</h3>
            <p>限量发行的数字邮票，每一枚都独一无二，具有收藏价值</p>
            <el-tag type="success">可交易</el-tag>
          </div>

          <!-- 永恒上链 -->
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/icons/blockchain.svg" alt="永恒上链" />
            </div>
            <h3>永恒上链</h3>
            <p>重要信件永久保存在区块链上，永不丢失，代代相传</p>
            <el-tag type="warning">区块链存证</el-tag>
          </div>

          <!-- 代币奖励 -->
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/icons/token.svg" alt="代币奖励" />
            </div>
            <h3>TIME代币奖励</h3>
            <p>写信、互动都能获得TIME代币，参与平台治理，分享成长价值</p>
            <el-tag type="danger">价值激励</el-tag>
          </div>
        </div>
      </div>
    </section>

    <!-- 如何使用 -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">如何开始</h2>

        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h4>连接钱包</h4>
            <p>使用MetaMask等Web3钱包登录</p>
          </div>

          <div class="step-arrow">→</div>

          <div class="step">
            <div class="step-number">2</div>
            <h4>获取邮票</h4>
            <p>购买或赚取NFT邮票</p>
          </div>

          <div class="step-arrow">→</div>

          <div class="step">
            <div class="step-number">3</div>
            <h4>写信投递</h4>
            <p>书写心意，选择投递方式</p>
          </div>

          <div class="step-arrow">→</div>

          <div class="step">
            <div class="step-number">4</div>
            <h4>永久保存</h4>
            <p>重要信件上链永存</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>准备好开启你的慢时光之旅了吗？</h2>
          <p>加入我们，让每一个字都充满意义</p>
          <el-button
              type="primary"
              size="large"
              round
              @click="router.push('/register')"
              class="cta-button-large"
          >
            立即加入
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { EditPen } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const featuresSection = ref<HTMLElement>()

// 开始写信
const handleStartWriting = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.info('请先登录')
    router.push('/login')
    return
  }
  router.push('/letter/write')
}

// 滚动到特色功能区
const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.home-page {
  background: #fff;
}

// Hero 区域样式
.hero-section {
  position: relative;
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;

  .hero-background {
    position: absolute;
    width: 100%;
    height: 100%;

    .floating-letter {
      position: absolute;
      font-size: 48px;
      opacity: 0.1;
      animation: float 20s infinite ease-in-out;

      &.letter-1 {
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      &.letter-2 {
        top: 70%;
        left: 80%;
        animation-delay: 5s;
      }

      &.letter-3 {
        top: 40%;
        left: 90%;
        animation-delay: 10s;
      }

      &.letter-4 {
        top: 80%;
        left: 20%;
        animation-delay: 15s;
      }
    }
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 0 20px;

    .hero-title {
      font-size: 56px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 20px;

      .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .sub-title {
        font-size: 48px;
        color: #303133;
      }
    }

    .hero-desc {
      font-size: 20px;
      color: #606266;
      line-height: 1.8;
      margin-bottom: 40px;
    }

    .hero-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 80px;

      .cta-button {
        padding: 15px 40px;
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }
      }

      .secondary-button {
        padding: 15px 40px;
        font-size: 18px;
        font-weight: 500;
        background: #fff;
        color: #667eea;
        border: 2px solid #667eea;

        &:hover {
          background: #667eea;
          color: #fff;
        }
      }
    }

    .hero-stats {
      display: flex;
      gap: 60px;
      justify-content: center;

      .stat-item {
        .stat-number {
          font-size: 36px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 16px;
          color: #909399;
        }
      }
    }
  }
}

// 特色功能区样式
.features-section {
  padding: 100px 0;
  background: #f8f9fa;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    font-size: 42px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
  }

  .section-desc {
    font-size: 18px;
    color: #909399;
    text-align: center;
    margin-bottom: 60px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;

    .feature-card {
      background: #fff;
      padding: 40px 30px;
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
      }

      .feature-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 50px;
          height: 50px;
          filter: brightness(0) invert(1);
        }
      }

      h3 {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 15px;
      }

      p {
        font-size: 16px;
        color: #606266;
        line-height: 1.6;
        margin-bottom: 20px;
      }
    }
  }
}

// 如何使用区域
.how-it-works {
  padding: 100px 0;
  background: #fff;

  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 60px;

    .step {
      flex: 1;
      max-width: 200px;
      text-align: center;

      .step-number {
        width: 60px;
        height: 60px;
        margin: 0 auto 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        font-size: 24px;
        font-weight: 700;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      h4 {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        color: #909399;
      }
    }

    .step-arrow {
      font-size: 30px;
      color: #c0c4cc;
    }
  }
}

// CTA区域
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  .cta-content {
    text-align: center;

    h2 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    p {
      font-size: 20px;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .cta-button-large {
      padding: 18px 50px;
      font-size: 20px;
      font-weight: 600;
      background: #fff;
      color: #667eea;
      border: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      }
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(-5deg);
  }
  75% {
    transform: translateY(20px) rotate(3deg);
  }
}

// 响应式
@media (max-width: 768px) {
  .hero-section {
    .hero-title {
      font-size: 36px;

      .sub-title {
        font-size: 32px;
      }
    }

    .hero-stats {
      gap: 30px;

      .stat-item {
        .stat-number {
          font-size: 24px;
        }
      }
    }
  }

  .how-it-works .steps {
    flex-direction: column;

    .step-arrow {
      transform: rotate(90deg);
    }
  }
}
</style>