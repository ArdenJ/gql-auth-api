import jwt from 'jsonwebtoken';

import {User} from '../generated/graphql'

export const tradeTokenForUser = (token: string):User => {
  const userToken = token.split(' ')[1]
  return getUser(userToken)
}

const getUser = (token:string):User | null => {
  let user = null
  try {
    if (token) {
      user = jwt.verify(token, '😧😧😧😧😧')
    }
    return user
  } catch (err) {
    return null
  }
}
