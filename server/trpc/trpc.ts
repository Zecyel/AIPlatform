import type { IUser } from '@/server/models/User'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { initTRPC } from '@trpc/server'
import * as cookie from 'cookie'

// const t = initTRPC.create()
const t = initTRPC.context<{
  req: IncomingMessage
  res: ServerResponse
  user: IUser | null
}>().create()

export const publicProcedure = t.procedure
export const router = t.router
export const middleware = t.middleware
export const mergeRouters = t.mergeRouters

export const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const parsedCookie = cookie.parse(ctx.req.headers.cookie || '')
  const token = parsedCookie['auth-token']

  if (!token) {
    throw new Error('未认证，请登录')
  }

  const user = await getUserFromToken(token)

  if (!user) {
    throw new Error('用户未找到，特殊情况已截流上传')
  }

  return next({
    ctx: {
      user: await getUserFromToken(token),
    },
  })
})

export const protectedProcedure = publicProcedure.use(isAuthenticated)

export const isAdmin = t.middleware(async ({ ctx, next }) => {
  const parsedCookie = cookie.parse(ctx.req.headers.cookie || '')
  const token = parsedCookie['auth-token']

  if (!token) {
    throw new Error('未认证，请登录')
  }

  const user = await getUserFromToken(token)

  if (!user) {
    throw new Error('用户未找到，特殊情况已截流上传')
  }

  ctx.user = user

  if (ctx.user.role !== 'admin') {
    throw new Error('无权限，请使用管理员账号登录')
  }
  return next({ ctx })
})

export const adminProcedure = publicProcedure.use(isAdmin)
