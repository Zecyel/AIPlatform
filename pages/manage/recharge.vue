<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
  username: '',
  amount: '',
})

function validate(state: any): FormError[] {
  const errors: FormError[] = []

  if (!state.username) {
    errors.push({ path: 'username', message: '用户名是必填项' })
  }

  if (!state.amount) {
    errors.push({ path: 'amount', message: '充值数量是必填项' })
  }
  else if (Number.isNaN(Number(state.amount)) || Number(state.amount) <= 0) {
    errors.push({ path: 'amount', message: '充值数量必须是正数' })
  }

  return errors
}

const toast = useToast()
const { $client } = useNuxtApp()

async function onSubmit(_: FormSubmitEvent<any>) {
  try {
    const recharge = await $client.recharge.mutate({
      username: state.username,
      amount: Number(state.amount),
    })

    toast.add({
      title: '充值成功',
      description: `充值成功，当前余额为 ${recharge.new_amount}`,
    })
  }
  catch (err: any) {
    toast.add({
      title: '充值失败',
      description: err.message,
    })
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="max-w-sm w-full mx-auto my-2 sm:my-4 md:my-8 p-6 rounded-lg shadow-md">
      <template #header>
        <h1>
          <b>Recharge</b>
        </h1>
      </template>
      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="用户名" name="username">
          <UInput v-model="state.username" placeholder="请输入用户名" />
        </UFormGroup>

        <UFormGroup label="充值数量" name="amount">
          <UInput v-model="state.amount" type="number" placeholder="请输入充值数量" />
        </UFormGroup>

        <UButton type="submit">
          充值
          <UIcon name="i-heroicons-arrow-small-right" />
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
