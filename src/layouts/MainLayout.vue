<template>
  <el-container class="main-layout">
    <el-header class="main-header">
      <div class="header-left">
        <h1 class="logo">时光信笺</h1>
      </div>

      <div class="header-center">
        <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            :ellipsis="false"
            router
        >
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/letter">信件</el-menu-item>
          <el-menu-item index="/nft">邮票收藏</el-menu-item>
          <el-menu-item index="/social">好友</el-menu-item>
        </el-menu>
      </div>

      <div class="header-right">
        <el-dropdown>
          <div class="user-info">
            <el-avatar :src="userInfo?.avatar || '/avatar/default.png'" />
            <span>{{ userInfo?.nickname || userInfo?.username }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/profile')">
                <el-icon><User /></el-icon>
                个人中心
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
import { User, Setting, SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const activeMenu = computed(() => route.path)

onMounted(() => {
  // 获取用户信息
  userStore.fetchUserInfo()
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
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;

  .header-left {
    .logo {
      font-size: 24px;
      font-weight: 600;
      color: #667eea;
      margin: 0;
    }
  }

  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;

    .el-menu {
      border: none;
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      &:hover {
        color: #667eea;
      }
    }
  }
}

.main-content {
  background: #f5f7fa;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>