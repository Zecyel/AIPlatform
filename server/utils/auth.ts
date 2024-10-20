import type { IUser } from '@/server/models/User'
import { User } from '@/server/models/User'
import jwt from 'jsonwebtoken'

const config = useRuntimeConfig()

// 从环境变量读取 JWT 密钥
// const JWT_SECRET = process.env.JWT_SECRET! // 确保环境变量存在
const JWT_SECRET = config.private.JWT

// 生成 JWT 令牌的函数
export function generateToken(user: IUser) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '1h' }, // 令牌有效期为 1 小时
  )
}

// 根据 JWT 令牌获取用户信息的函数
export async function getUserFromToken(token: string): Promise<IUser | null> {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).exec()
    return user
  }
  catch (err) {
    console.error('Token verification failed:', err)
    return null
  }
}
