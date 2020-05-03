const fetch = require('node-fetch')
import {
  User,
  Resolvers,
  UserResult,
  NewUserResult,
  LoginUserResult
} from './generated/graphql'

export const resolvers = {
  // QUERIES
  Query: {
    user: async (root, { id }, { db }, info): Promise<UserResult> => {
      try {
        const res = await fetch(db)
        const users = await res.json()
        const user = await users.find(i => i.id === id)
        console.log(user)
        return {
          __typename: "User",
          ...user,
        }
      } catch (err) {
        return {
          __typename: "UserNotFoundErr",
          message: `The user with the id ${id} does not exist.`,
        }
      }
    },
    users: async (root, args, { db }, info): Promise<User> => {
      try {
        const res = await fetch(db)
        const users = await res.json()
        console.log(users)
        return await users
      } catch (err) {
        console.log(err)
      }
    },
  },

  // RESOLVE UNION TYPES
  UserResult: {
    __resolveType(obj) {
      if (obj.hasOwnProperty('id')) {
        return 'User'
      } 
      if (obj.hasOwnProperty('message')){
        return 'UserNotFoundErr'
      }
      return null
    }
  },
  NewUserResult: {
    __resolveType(obj) {
      if(obj.username) {
        return 'User'
      }
      if(obj.message) {
        return 'UserAlreadyExistsErr'
      }
    }
  },
  LoginUserResult: {
    __resolveType(obj) {
      if(obj.hasOwnProperty('id')) {
        return 'User'
      }
      if(obj.hasOwnProperty('message')) {
        return 'LoginUserErr'
      }
    }
  }
}