<script setup lang="ts">
import { useNuxtApp } from '#app'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 定义表单字段
const fields = [
  {
    name: 'username',
    type: 'text',
    label: '用户名',
    placeholder: '请输入您的用户名',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: '密码',
    placeholder: '请输入您的密码',
    required: true,
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: '确认密码',
    placeholder: '请再次输入您的密码',
    required: true,
  },
]

// 定义验证函数
function validate(state: any) {
  const errors = []
  if (!state.username) {
    errors.push({ path: 'username', message: '用户名为必填项' })
  }
  if (!state.password) {
    errors.push({ path: 'password', message: '密码为必填项' })
  }
  else if (state.password.length < 8) {
    errors.push({ path: 'password', message: '密码至少需要8个字符' })
  }
  if (!state.confirmPassword) {
    errors.push({ path: 'confirmPassword', message: '确认密码为必填项' })
  }
  else if (state.password !== state.confirmPassword) {
    errors.push({ path: 'confirmPassword', message: '密码不匹配' })
  }
  return errors
}

// 定义错误信息
const errorMessage = ref('')

// 定义加载状态
const loading = ref(false)

// 使用路由进行跳转
const router = useRouter()

// 获取 Nuxt 应用实例
const { $client } = useNuxtApp()

// 提交处理函数
async function onSubmit(data: any) {
  loading.value = true
  errorMessage.value = ''

  try {
    // 调用注册 API
    const user = await $client.register.mutate({
      username: data.username,
      password: data.password,
      // 如果有其他字段，可以在这里传递
    })
    const userStore = useUserStore()
    userStore.login(user)

    // 注册成功后跳转到首页或其他页面
    router.push('/')
  }
  catch (err: any) {
    errorMessage.value = err.message
  }

  loading.value = false
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="max-w-sm w-full mx-auto my-2 sm:my-4 md:my-8 p-6 rounded-lg shadow-md">
      <UAuthForm
        :fields="fields"
        :validate="validate"
        title="注册新账号"
        align="top"
        icon="i-heroicons-user-circle"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :loading="loading"
        :submit-button="{ label: '注册', icon: 'i-material-symbols-register-rounded' }"
        @submit="onSubmit"
      >
        <template #description>
          已有账号？ <NuxtLink to="/user/login" class="text-primary font-medium">
            登录
          </NuxtLink>。
        </template>

        <template #validation>
          <UAlert
            v-if="errorMessage"
            color="red"
            icon="i-heroicons-information-circle-20-solid"
            :title="errorMessage"
          />
          <!-- this icon does not exist -->
        </template>

        <template #footer>
          注册即表示您同意我们的 <NuxtLink to="/terms" class="text-primary font-medium">
            服务条款
          </NuxtLink>。
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>
