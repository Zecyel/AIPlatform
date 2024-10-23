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
    label: '文件共享',
    icon: 'i-material-symbols-cloud-download-outline-rounded',
    to: '/file',
    active: route.path.startsWith('/file'),
  }, {
    label: '投票',
    icon: 'i-material-symbols-how-to-vote-outline-rounded',
    to: '/vote',
    active: route.path.startsWith('/vote'),
  }, {
    label: 'AI小助手',
    icon: 'i-mdi-robot-outline',
    to: '/ai',
    active: route.path.startsWith('/ai'),
  }]

  const admin_links = [{
    label: '管理后台',
    icon: 'i-material-symbols-settings-outline-rounded',
    to: '/manager',
    active: route.path.startsWith('/manager'),
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
