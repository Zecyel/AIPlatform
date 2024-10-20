import { defineMongooseModel } from '#nuxt/mongoose'
import mongoose from 'mongoose'
import z from 'zod'

export const UserZod = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(['admin', 'teacher', 'student']),
  class: z.string().min(1),
  studentId: z.string(),
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
      enum: ['admin', 'teacher', 'student'],
      default: 'student',
    },
    class: { type: String, required: true },
    studentId: { type: String, unique: true, sparse: true },
    points: { type: Number, default: 0 },
    // Add other relevant fields here
  },
  { timestamps: true },
)

// Pre-save hook to hash the password if it's modified
UserSchema.pre('save', async (next) => {
//   if (!this.isModified('password'))
//     return next()
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Instance method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password)
  return enteredPassword === this.password // this operation is not secure, just for demo purposes
}

// Define and export the User model
export const User = defineMongooseModel<IUser>({
  name: 'User',
  schema: UserSchema,
})
