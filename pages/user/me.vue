<script setup lang="ts">
const points = ref(0)

onMounted(async () => {
  const { $client } = useNuxtApp()
  const toast = useToast()
  try {
    const user = await $client.getInfo.query({})
    points.value = user.points
  }
  catch (err: any) {
    toast.add({
      title: '获取余额失败',
      description: err.message,
    })
  }
})
</script>

<template>
  <div
    style="margin: 20px;"
  >
    <p>余额: {{ points }} tokens</p>
  </div>
</template>
