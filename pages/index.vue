<script setup lang="ts">
import { ref } from 'vue'

// 定义页面的数据
const page = ref({
  title: 'AI Platform',
  description: '欢迎来到我的AI平台，提供最先进的人工智能解决方案。',
  hero: {
    title: 'Finish you homework in seconds',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    links: [
      {
        'label': 'Get started',
        // icon: 'i-heroicons-arrow-right-20-solid',
        // icon: 'i-heroicons-rocket-launch',
        // trailing: true,
        'trailing-icon': 'i-heroicons-arrow-small-right',
        'to': '#utils',
        'size': 'xl',
        // style: {
        //   borderRadius: '9999px',
        //   padding: '1rem 2rem',
        // },
      },
    ],
  },
  utils: {
    // headline: 'Utilities',
    title: 'What can AIPlatform do?',
    description: '',
    items: [
      {
        title: '模型列表',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
        link: '/model/list',
        icon: 'i-material-symbols-format-list-bulleted',
      },
      {
        title: '历史对话',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
        link: '/user/history',
        icon: 'i-solar-dialog-2-bold',
      },
      {
        title: 'AI 绘图',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
        link: '/model/list',
        icon: 'i-hugeicons-paint-board',
      },
      {
        title: '我也不知道写什么了先放把椅子在这里',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
        link: '/model/list',
        icon: 'i-material-symbols-chair-alt-outline-rounded',
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <ULandingHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
    />

    <!-- utils Section -->
    <ULandingSection

      icon="i-heroicons-rocket-launch"
      :title="page.utils.title"
      :description="page.utils.description"
    >
      <ULandingGrid>
        <ULandingCard
          v-for="(item, index) in page.utils.items"
          id="utils"
          :key="index"
          class="col-span-6 row-span-2"
          :title="item.title"
          :description="item.description"
          :to="item.link"
          :icon="item.icon"
        />
      </ULandingGrid>
    </ULandingSection>
    <br><br><br><br><br><br><br><br><br><br><br>
  </div>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
