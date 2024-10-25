import { defineMongooseModel } from '#nuxt/mongoose'
import mongoose from 'mongoose'
import z from 'zod'

export const ModelZod = z.object({
  name: z.string().min(1),
  token: z.string().min(1),
  inputPrice: z.number().min(0),
  outputPrice: z.number().min(0),
  usage: z.enum(['dialog', 'paint']).default('dialog'),
})

export type IModel = z.infer<typeof ModelZod> & {
  calculatePrice: (input?: number, output?: number) => number
} & mongoose.Document

const ModelSchema = new mongoose.Schema<IModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    inputPrice: {
      type: Number,
      min: 0,
    },
    outputPrice: {
      type: Number,
      min: 0,
    },
    usage: {
      type: String,
      required: true,
      enum: ['dialog', 'paint'],
      default: 'dialog',
    },
  },
  { timestamps: true },
)

ModelSchema.methods.calculatePrice = function (
  input?: number,
  output?: number,
): number {
  if (this.usage === 'dialog') {
    return input! * this.inputPrice + output! * this.outputPrice
  }
  else {
    return this.outputPrice
  }
}

export const Model = defineMongooseModel<IModel>({
  name: 'Model',
  schema: ModelSchema,
})
