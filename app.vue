<script lang="ts" setup>
import type { HeaderLink } from '#ui-pro/types'

const route = useRoute()

const links = computed<HeaderLink[]>(() => {
  return [{
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
