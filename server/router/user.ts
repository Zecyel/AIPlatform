import z from 'zod'
import { User, UserZod } from '../models/User'
import { publicProcedure, router } from '../trpc/trpc'
import { generateToken } from '../utils/auth'

export const UserRoute = router({
  login: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
        password: z.string(),
      }),
    )
    .output(
      UserZod.omit({
        password: true,
      }),
    )
    .mutation(async ({ input: { studentId, password }, ctx }) => {
      const user = await User.findOne({ studentId }).exec()

      if (!user) {
        throw new Error('学号或密码错误')
      }
      const isMatch = await user.matchPassword(password)
      if (!isMatch) {
        throw new Error('学号或密码错误')
      }

      const token = generateToken(user)

      // 设置 HTTP-Only Cookie
      ctx.res.setHeader(
        'Set-Cookie',
        `auth-token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`,
      )

      // 返回用户信息，不包括密码
      return {
        username: user.username,
        role: user.role,
        points: user.points,
      }
    }),
  register: publicProcedure
    .input(UserZod)
    .output(
      UserZod.omit({
        password: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { username, password, role } = input

      // 检查用户名是否已存在
      const existingUser = await User.findOne({ username }).exec()
      if (existingUser) {
        throw new Error('用户名已存在')
      }

      // 创建新用户
      const user = new User({
        username,
        password,
        role,
      })

      await user.save()

      const token = generateToken(user)

      // 设置 HTTP-Only Cookie
      ctx.res.setHeader(
        'Set-Cookie',
        `auth-token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`,
      )

      // 返回用户信息，不包括密码
      return {
        username: user.username,
        role: user.role,
        points: user.points,
      }
    }),
})
