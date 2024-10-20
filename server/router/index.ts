import { mergeRouters } from '../trpc/trpc'
import { TestRoute } from './test'
import { UserRoute } from './user'

export const allRouters = mergeRouters(TestRoute, UserRoute)
