  <template>
  <el-container class="main-layout">
    <el-header class="main-header">
      <div class="header-left">
        <router-link to="/" class="logo-link">
          <LogoIcon :size="40" />
          <h1 class="logo-text">时光信笺</h1>
        </router-link>
      </div>

      <div class="header-center" v-if="userStore.isLoggedIn">
        <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            :ellipsis="false"
            router
            class="nav-menu"
        >
          <el-menu-item index="/letter">
            <el-icon><Message /></el-icon>
            <span>写信</span>
          </el-menu-item>
          <el-menu-item index="/inbox">
            <el-icon><Collection /></el-icon>
            <span>信箱</span>
          </el-menu-item>
          <el-menu-item index="/stamps">
            <el-icon><Stamp /></el-icon>
            <span>邮票收藏</span>
          </el-menu-item>
          <el-menu-item index="/friends">
            <el-icon><User /></el-icon>
            <span>笔友</span>
          </el-menu-item>
          <el-menu-item index="/system/config" v-if="userInfo?.roles?.includes('ADMIN')">
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="header-right">
        <!-- 未登录状态 -->
        <template v-if="!userStore.isLoggedIn">
          <el-button
              type="primary"
              round
              @click="router.push('/login')"
              class="auth-btn"
          >
            登录
          </el-button>
          <el-button
              round
              @click="router.push('/register')"
              class="auth-btn register-btn"
          >
            注册
          </el-button>
        </template>

        <!-- 已登录状态 -->
        <template v-else>
          <!-- 通知图标 -->
          <el-badge :value="12" class="notification-badge">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>

          <!-- 用户下拉菜单 -->
          <el-dropdown class="user-dropdown">
            <div class="user-info">
              <el-avatar :src="userInfo?.avatar || '/avatar/default.png'" />
              <span class="username">{{ userInfo?.nickname || userInfo?.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/wallet')">
                  <el-icon><Wallet /></el-icon>
                  我的钱包
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/settings')">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </el-header>

    <el-main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  User, Setting, SwitchButton, Message, Collection,
  Stamp, Bell, Wallet
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import LogoIcon from '@/components/LogoIcon.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const activeMenu = computed(() => route.path)

onMounted(() => {
  if (userStore.isLoggedIn) {
    userStore.fetchUserInfo()
  }
})

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout()
  })
}
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  background: #f8f9fa;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 70px;

  .header-left {
    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      gap: 12px;

      .logo-img {
        width: 40px;
        height: 40px;
      }

      .logo-text {
        font-size: 24px;
        font-weight: 600;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
      }
    }
  }

  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
    margin: 0 40px;

    .nav-menu {
      border: none;
      background: transparent;

      .el-menu-item {
        font-size: 15px;
        font-weight: 500;
        padding: 0 25px;

        &.is-active {
          color: #667eea;
          border-bottom-color: #667eea;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .auth-btn {
      padding: 8px 24px;
      font-weight: 500;
    }

    .register-btn {
      background: #f5f7fa;
      color: #606266;
      border: 1px solid #e4e7ed;

      &:hover {
        background: #667eea;
        color: #fff;
        border-color: #667eea;
      }
    }

    .notification-badge {
      cursor: pointer;
      margin-right: 10px;

      :deep(.el-badge__content) {
        background: #ff6b6b;
      }
    }

    .user-dropdown {
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 5px;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          background: #f5f7fa;
        }

        .username {
          font-weight: 500;
          color: #303133;
        }
      }
    }
  }
}

.main-content {
  padding: 0;
  overflow-y: auto;
}

// 自定义图标组件（邮票图标）
.el-icon-stamp {
  &::before {
    content: "📮";
    font-size: 16px;
  }
}
</style>