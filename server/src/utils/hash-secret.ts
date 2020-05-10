import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const hashPass = (pw: string) => crypto.createHash('sha256').update(pw).digest('base64')

export const encrypt = async (password: string) => {
  return await bcrypt.hash(hashPass(password), 12)
}

export const validatePassword = async (password, user: any) => {
  return await bcrypt.compare(hashPass(password), user.password)
} 