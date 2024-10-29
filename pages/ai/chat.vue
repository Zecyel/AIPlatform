<script setup lang="ts">
// 定义消息类型
interface Message {
  type: 'user' | 'ai' | 'error'
  content: string
}

const userInput = ref('')
const conversation = reactive<Message[]>([])

const { $client } = useNuxtApp()
const toast = useToast()

async function sendChatMutation() {
  try {
    const resp = await $client.chat.mutate({
      dialog: conversation,
      model: 'gpt-3.5-turbo',
    })

    conversation.push(resp)
  }
  catch (err: any) {
    toast.add({
      title: '未知错误',
      description: err.message,
    })
  }
}

// 发送消息函数
function sendMessage() {
  const input = userInput.value.trim()
  if (!input)
    return

  // 添加用户消息
  conversation.push({ type: 'user', content: input })
  userInput.value = ''

  // 发送到后端
  sendChatMutation()
}

// 删除消息及以下的内容
function deleteMessage(index: number) {
  conversation.splice(index)
}

// 重新提问
function retryMessage(index: number) {
  // 获取当前上下文直到指定索引
  const context = conversation
    .slice(0, index + 1)
    // .filter(msg => msg.type === 'user')
    .map(msg => msg.content)

  // const lastMessage = conversation[index].content

  // 重新发送请求
  conversation.splice(index + 1) // 删除后续的 AI 或错误消息

  sendChatMutation()
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="max-w-sm w-full mx-auto my-2 sm:my-4 md:my-8 p-6 rounded-lg shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold">
          Chat with AI
        </h2>
      </template>

      <div class="overflow-y-auto max-h-[60vh] mb-4">
        <div v-for="(message, index) in conversation" :key="index" class="mb-4">
          <div v-if="message.type === 'user'" class="text-right">
            <UChip color="blue">
              {{ message.content }}
            </UChip>
          </div>
          <div v-else-if="message.type === 'ai'" class="mt-2">
            <MDC :value="message.content" />
          </div>
          <div v-else-if="message.type === 'error'" class="mt-2 border border-red-500 p-2 rounded">
            <p class="text-red-500">
              {{ message.content }}
            </p>
          </div>

          <!-- 操作按钮 -->
          <div v-if="message.type === 'user'" class="flex space-x-2 mt-1">
            <UButton size="sm" color="red" @click="deleteMessage(index)">
              删除
            </UButton>
            <UButton size="sm" color="yellow" @click="retryMessage(index)">
              重新提问
            </UButton>
          </div>
        </div>
      </div>

      <div class="flex">
        <UInput
          v-model="userInput"
          placeholder="请输入您的问题..."
          class="flex-1 mr-2"
          @keyup.enter="sendMessage"
        />
        <UButton color="primary" @click="sendMessage">
          发送
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
/* 可选：根据需要添加样式 */
</style>
