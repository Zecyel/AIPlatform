import { defineMongooseModel } from '#nuxt/mongoose'
import mongoose from 'mongoose'
import z from 'zod'

export const UserZod = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(['admin', 'user']).default('user'),
  points: z.number().default(0),
  // Add other relevant fields here
})

export type IUser = z.infer<typeof UserZod> & {
  matchPassword: (enteredPassword: string) => Promise<boolean>
} & mongoose.Document

// Create a new Mongoose Schema instance
const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Pre-save hook to hash the password if it's modified
UserSchema.pre('save', async (next) => {
  next()
})

// Instance method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return enteredPassword === this.password
}

// Define and export the User model
export const User = defineMongooseModel<IUser>({
  name: 'User',
  schema: UserSchema,
})
