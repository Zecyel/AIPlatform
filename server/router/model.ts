import OpenAI from 'openai'
import { z } from 'zod'
import { Model, ModelZod } from '../models/Model'
import { adminProcedure, protectedProcedure, publicProcedure, router } from '../trpc/trpc'

// Define the TRPC router for model operations
export const ModelRoute = router({
  // 1. Query all model names
  getModels: publicProcedure.query(async () => {
    const models = await Model.find({}, 'name').exec()
    return models.map(model => model.name)
  }),
  addModel: adminProcedure
    .input(ModelZod)
    // .output(z.object({
    //   success: z.boolean(),
    //   model: z.string().min(1),
    // }))
    .mutation(async ({ input }) => {
      const existing = await Model.findOne({ name: input.name }).exec()
      if (existing) {
        throw new Error('Model with this name already exists')
      }
      const newModel = new Model(input)
      await newModel.save()
      return { success: true, model: newModel.name }
    }),
  deleteModel: adminProcedure
    .input(z.object({ name: z.string().min(1) }))
    // .output(z.object({
    //   success: z.boolean(),
    //   deletedModel: z.string().min(1),
    // }))
    .mutation(async ({ input }) => {
      const result = await Model.deleteOne({ name: input.name }).exec()
      if (result.deletedCount === 0) {
        throw new Error('Model not found')
      }
      return { success: true, deletedModel: input.name }
    }),
  updateModel: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        updates: ModelZod.partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const updatedModel = await Model.findOneAndUpdate(
        { name: input.name },
        { $set: input.updates },
        { new: true },
      ).exec()

      if (!updatedModel) {
        throw new Error('Model not found')
      }

      return { success: true, model: updatedModel.name }
    }),
  chat: protectedProcedure
    .input(z.object({
      dialog: z.object({
        type: z.enum(['user', 'ai', 'error']),
        content: z.string(),
      }).array(),
      model: z.string().min(1),
    }))
    .output(z.object({
      type: z.enum(['ai', 'error']),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.dialog.filter(message => message.type === 'error').length > 0) {
        throw new Error('在对话上下文中存在错误，请修复错误后重试')
      }
      if (ctx.user!.points <= 0) {
        throw new Error('您的积分不足，请充值后重试')
      }
      const model = await Model.findOne({ name: input.model }).exec()
      if (!model) {
        throw new Error(`未能识别的模型 ${input.model}`)
      }
      const token = model.token

      try {
        const client = new OpenAI({
          apiKey: token,
          baseURL: 'https://xiaoai.plus/v1',
        })

        const message = input.dialog.map(message => ({
          role: message.type === 'user' ? 'user' : 'assistant',
          content: message.content,
        }))
        const response = await client.chat.completions.create({
          messages: message as any[],
          model: model.name,
        })

        // console.log(response)

        const input_token = response.usage?.prompt_tokens
        const output_token = response.usage?.completion_tokens
        // const total_token = response.usage?.total_tokens

        // console.log(`input_token: ${input_token}, output_token: ${output_token}, total_token: ${total_token}`)

        ctx.user!.points -= model.calculatePrice(input_token, output_token)
        await ctx.user!.save()

        return {
          type: 'ai',
          content: response.choices[0].message.content!,
        }
      }
      catch (err: any) {
        // console.log(err)
        throw new Error(err.message)
      }
    }),
})

export default ModelRoute
