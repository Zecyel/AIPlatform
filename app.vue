<script lang="ts" setup>
import type { HeaderLink } from '#ui-pro/types'

const route = useRoute()
const user = useUserStore()

const links = computed<HeaderLink[]>(() => {
  const unlogined_links = [{
    label: '登录',
    icon: 'i-material-symbols-login-rounded',
    to: '/login',
    active: route.path.startsWith('/login'),
  }, {

    label: '注册',
    icon: 'i-material-symbols-person-add',
    to: '/register',
    active: route.path.startsWith('/register'),
  }]

  if (!user.isLogin()) {
    return unlogined_links
  }

  const default_links = [{
    label: '个人中心',
    icon: 'i-material-symbols-home',
    to: '/user/me',
    active: route.path.startsWith('/user/me'),
  }, {
    label: 'AI 对话',
    icon: 'i-material-symbols-how-to-vote-outline-rounded',
    to: '/ai/chat',
    active: route.path.startsWith('/vote'),
  }, {
    label: 'AI 绘图',
    icon: 'i-material-symbols-logout-rounded',
    to: '/ai/paint',
    active: route.path.startsWith('/logout'),
  }]

  const admin_links = [{
    label: '管理后台',
    icon: 'i-material-symbols-settings-outline-rounded',
    to: '/manage',
    active: route.path.startsWith('/manage'),
  }]

  if (user.isAdmin()) {
    return [...admin_links, ...default_links]
  }

  return default_links
})
</script>

<template>
  <div>
    <Header :links="links" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Footer />

    <UNotifications />
    <UModals />
    <USlideovers />
  </div>
</template>
