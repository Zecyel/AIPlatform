import { z } from 'zod'
import { Model, ModelZod } from '../models/Model'
import { adminProcedure, publicProcedure, router } from '../trpc/trpc'

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
  chat: publicProcedure
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
    .mutation(async ({ input }) => {
      console.log(input)
      return {
        type: 'ai',
        content: 'Hello, I am an AI model',
      }
    }),
})

export default ModelRoute
