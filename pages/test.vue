<script setup lang="ts">
const { $client } = useNuxtApp()

const { data: hello } = await $client.test.useQuery({ text: 'client', plain: '666' })
// hello may be undefined, meaning the query is failed.

const { data: all_user } = await $client.test_database.useQuery({})

const { data: env } = await $client.test_environment.useQuery({})
</script>

<template>
  <div>
    <p>{{ hello }}</p>
    <p>{{ all_user }}</p>
    <p>{{ env }}</p>
  </div>
</template>
