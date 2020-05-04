import fetch from 'node-fetch'
import { ApolloError } from 'apollo-server'

import {
  User,
  Resolvers,
  UserResult,
  AllUsersResult,
  ActionYieldsNoResult,
  NewUserResult,
  LoginUserResult
} from './generated/graphql'

const UNHANDLED_ACTION = ({err}: any) => new ApolloError(`APOLLO ERR -- UNHANDLED ACTION: ${err}`)

export const resolvers = {
  // QUERIES
  Query: {
    user: async (root, { id }, { db }, info): Promise<UserResult> => {
      try {
        const res = await fetch(db)
        const users = await res.json()
        const user = await users.find(i => i.id === id)
        if (await user) {
          return {
            __typename: "User",
            ...user,
          }
        }
        return {
          __typename: "UserNotFoundErr",
          message: `The user with the id ${id} does not exist.`,
        }
      } catch (err) {
        return UNHANDLED_ACTION(err)
      }
    }, 
    // TODO: Users and Logged in users would be better handled by returning an actual response fragment to the front end 
    users: async (root, args, { db }, info): Promise<User | ActionYieldsNoResult> => {

      const message = { message: 'There are currently no registered users' }
      
      try {
        const res = await fetch(db)
        const users = await res.json()
        console.log(users)
        if (await users) {
          return {
            __typename: 'User',
            ...users,
          }
        }
        return {
          __typename: 'ActionYieldsNoResult',
          ...message
        }
      } catch (err) {
          return UNHANDLED_ACTION(err)
      }
    },
    usersWithStatus: async (root, { isLoggedIn }, { db }, info): Promise<User[] | ActionYieldsNoResult> => {

      const message = { message: `There are currently no registered users matching status ${isLoggedIn}` }

      try {
        const res = await fetch(db)
        const users = await res.json()
        if (await users) {
          const matching = users.filter(user => user.isLoggedIn === isLoggedIn)
          console.log(matching === true)
          if (matching) {
            return {
              __typename: 'User',
              ...matching,
            }
          }
        }
        return {
          __typename: 'ActionYieldsNoResult',
          ...message
        }
      } catch (err) {
          return UNHANDLED_ACTION(err)
      }
    },
    userCanLogIn: async (root, { id }, { db }, info): Promise<UserResult> => {
      try {
        const res = await fetch(db)
        const users = await res.json()
        const user = await users.find(i => i.id === id)

        let reason = ''
        if (!user) {
          reason = `A user with ID ${id} does not exist`
        }
 
        if (await user && !user.isLoggedIn) {
          return {
            __typename: "User",
            ...user,
          }
        }
        return {
          __typename: "UserNotFoundErr",
          message: `The user with the id ${id} is unable to log in: ${
            !user 
            ? 'user does not exist' 
            : 'user is already logged in'
          }`,
        }
      } catch (err) {
        return UNHANDLED_ACTION(err)
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
  AllUsersResult: {
    __resolveType(obj) {
      if (obj.length > 0) {
        if (obj.id) {
          return 'User'
        }
      }
      if (obj.message) {
        return 'ActionYieldsNoResult'
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