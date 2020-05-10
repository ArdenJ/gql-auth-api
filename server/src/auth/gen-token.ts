import { User } from './../generated/graphql';
import jwt from 'jsonwebtoken'

export const createToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    '😧😧😧😧😧',
    {
      expiresIn: '1d', 
    },
  )
}