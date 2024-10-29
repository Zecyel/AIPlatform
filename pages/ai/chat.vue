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

// 模型列表
const models = ['gpt-4-32k', 'o1-mini', 'o1-preview']
const selectedModel = ref('o1-mini') // 默认选择

// 发送聊天请求
async function sendChatMutation() {
  try {
    const resp = await $client.chat.mutate({
      dialog: conversation,
      model: selectedModel.value, // 使用选择的模型
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
  conversation.splice(index + 1)
  sendChatMutation()
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <UCard class="w-full mx-auto my-2 sm:m-4 md:m-8 p-6 rounded-lg shadow-md max-w-full">
      <template #header>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-semibold">
            Chat with AI
          </h2>
          <USelectMenu v-model="selectedModel" :options="models" />
        </div>
      </template>

      <div class="overflow-y-auto max-h-[60vh] mb-4">
        <div v-for="(message, index) in conversation" :key="index" class="mb-4">
          <div v-if="message.type === 'user'" class="text-right border-2 border-blue-300 p-2 rounded">
            <UChip color="blue">
              {{ message.content }}
            </UChip>
          </div>
          <div v-else-if="message.type === 'ai'" class="mt-2 border-2 border-green-300 p-4 rounded">
            <MDC :value="message.content" />
          </div>
          <div v-else-if="message.type === 'error'" class="mt-2 border-2 border-red-500 p-2 rounded">
            <p class="text-red-500">
              {{ message.content }}
            </p>
          </div>

          <!-- 操作按钮 -->
          <div v-if="message.type === 'user'" class="flex justify-end space-x-2 mt-2">
            <UButton size="sm" class="text-gray-700 bg-transparent hover:bg-gray-100" @click="deleteMessage(index)">
              删除
            </UButton>
            <UButton size="sm" class="text-gray-700 bg-transparent hover:bg-gray-100" @click="retryMessage(index)">
              重新提问
            </UButton>
          </div>
        </div>
      </div>

      <div class="flex">
        <!-- 多行输入框 -->
        <UTextarea
          v-model="userInput"
          placeholder="请输入您的问题..."
          class="flex-1 mr-2 rounded resize-none"
          @keyup.ctrl.enter="sendMessage"
        />
        <UButton color="primary" @click="sendMessage">
          发送
        </UButton>
      </div>
      <p class="text-sm text-gray-500 mt-2">
        按 <code>Ctrl + Enter</code> 发送消息
      </p>
    </UCard>
  </div>
</template>

<style scoped>
/* 可选：根据需要添加额外的样式 */

/* 确保UCard在小屏幕设备上有适当的内边距 */
@media (max-width: 640px) {
  .UCard {
    padding: 1rem;
  }
}
</style>
