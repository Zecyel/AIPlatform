<script setup lang="ts">
// 定义表单字段
const fields = [
  {
    name: 'studentId',
    type: 'text',
    label: '学号',
    placeholder: '请输入您的学号',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: '密码',
    placeholder: '请输入您的密码',
    required: true,
  },
]

// 定义验证函数
function validate(state: any) {
  const errors = []
  if (!state.studentId) {
    errors.push({ path: 'studentId', message: '学号为必填项' })
  }
  if (!state.password) {
    errors.push({ path: 'password', message: '密码为必填项' })
  }
  return errors
}

// 定义错误信息
const errorMessage = ref('')

// 定义加载状态
const loading = ref(false)

// 使用路由进行跳转
const router = useRouter()

// 提交处理函数
const { $client } = useNuxtApp()

async function onSubmit(data: any) {
// async function onSubmit(_: any) {
  loading.value = true
  errorMessage.value = ''

  try {
    const user = await $client.login.mutate({
      studentId: data.studentId,
      password: data.password,
    })
    const userStore = useUserStore()
    userStore.login(user)

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
        :fields="fields" :validate="validate" title="欢迎回来！" align="top" icon="i-heroicons-lock-closed"
        :ui="{ base: 'text-center', footer: 'text-center' }" :loading="loading" :submit-button="{ label: '登录', icon: 'i-material-symbols-login-rounded' }"
        @submit="onSubmit"
      >
        <template #description>
          还没有账号？ <NuxtLink to="/register" class="text-primary font-medium">
            注册
          </NuxtLink>。
        </template>

        <template #password-hint>
          <NuxtLink to="/forgot-password" class="text-primary font-medium">
            忘记密码？
          </NuxtLink>
        </template>

        <template #validation>
          <UAlert
            v-if="errorMessage" color="red" icon="i-heroicons-information-circle-20-solid"
            :title="errorMessage"
          />
        </template>

        <template #footer>
          登录即表示您同意我们的 <NuxtLink to="/terms" class="text-primary font-medium">
            服务条款
          </NuxtLink>。
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>
