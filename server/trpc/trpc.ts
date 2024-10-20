import type { IUser } from '@/server/models/User'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { initTRPC } from '@trpc/server'

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

export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('未认证，请登录')
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

export const protectedProcedure = publicProcedure.use(isAuthenticated)
