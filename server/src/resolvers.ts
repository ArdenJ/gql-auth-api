import fetch from 'node-fetch'
import { ApolloError } from 'apollo-server'

import {
  User,
  Resolvers,
  UserResult,
  AllUsersResult,
  ActionYieldsNoResult,
  NewUserResult,
  LoginUserResult,
  AltAllUsersResult
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

    users: async (root, args, { db }, info): Promise<AllUsersResult> => {

      const message = { message: 'There are currently no registered users' }
      
      try {
        const res = await fetch(db)
        const users = await res.json()
        console.log(users)
        if (await users.length !== 0) {
          return {
            status: true,
            success: [...users],
          }
        }
        return {
          status: false,
          failure: message
        }
      } catch (err) {
          throw UNHANDLED_ACTION(err)      
      }
    },

    altusers: async (root, args, { db }, info): Promise<AltAllUsersResult> => {

      const message = { message: 'There are currently no registered users' }

      try {
        const res = await fetch(db)
        const users = await res.json()
        console.log(users)
        if (await users.length !== 0) {
          return {
            __typename: "AllUsersSuccess",
            status: true,
            result: [...users],
          }
        }
        return {
          __typename: "AllUsersFailure",
          status: false,
          result: message.message
        }
      } catch (err) {
          throw UNHANDLED_ACTION(err)      
      }

    },

    usersWithStatus: async (root, { isLoggedIn }, { db }, info): Promise<AllUsersResult> => {

      const message = { message: `There are currently no registered users matching status ${isLoggedIn}` }

      try {
        const res = await fetch(db)
        const users = await res.json()
        if (await users) {
          const matching = users.filter(user => user.isLoggedIn === isLoggedIn)
          if (matching) {
            return {
              status: true,
              success: [...matching],
            }
          }
          return {
            status: false,
            failure: message
          }
        }
      } catch (err) {
          throw UNHANDLED_ACTION(err)
      }
    },
    userCanLogIn: async (root, { id }, { db }, info): Promise<UserResult> => {
      try {
        const res = await fetch(db)
        const users = await res.json()
        const user = await users.find(i => i.id === id)
 
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

  // MUTATIONS
  // createNewUser: async (root, {username, email}, { db, id }, info):Promise<NewUserResult> => {
    // let NEW_USER = {
    //   id: id,
    //   username: username,
    //   email: email || null,
    //   dateCreateAt: Date.now().toString(),
    //   isLoggedIn: false
    // }

    // const res = await fetch(db).then(res => res.json()).then(data => data)

    // const usernameTaken = res.filter(i => i.username !== username)
    // const emailTaken = res.filter(i => i.email !== email)

    // if  (usernameTaken) return {message: `Aun account with the sername ${username} already exists`} 
    // if  (emailTaken) return {message: `An account with the email ${email} already exists`} 

    // const user:Promise<User> = Promise.resolve(fetch(db, {
    //   method: 'POST',
    //   body: JSON.stringify(NEW_USER),
    //   headers: { 'Content-Type': 'application/json' },
    // })
    //   .then(res => res.json())
    //   .then(data => data)
    //   .catch(err => console.log(err)))

    // return Promise.resolve(user)
  // },

  // RESOLVE UNION TYPES
  AltAllUsersResult: {
    __resolveType(obj) {
      if (obj.status) {
        return 'AllUsersSuccess'
      }
      if (!obj.status) {
        return 'AllUsersFailure'
      }
    }
  },
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
      if (obj[0].hasOwnProperty('id')) {
        return 'User'
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