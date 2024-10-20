import { allRouters } from '@/server/router'
import { getUserFromToken } from '@/server/utils/auth'
import cookie from 'cookie'
import { createNuxtApiHandler } from 'trpc-nuxt'

export const appRouter = allRouters

export type AppRouter = typeof appRouter

export default createNuxtApiHandler<AppRouter>({
  router: appRouter,
  createContext: async ({ node }) => {
    const token = node.req.headers.cookie ? cookie.parse(node.req.headers.cookie)['auth-token'] : null
    const user = token ? await getUserFromToken(token) : null
    return { req: node.req, res: node.res, user }
  },
})
