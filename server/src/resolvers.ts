import fetch from 'node-fetch'
import { ApolloError } from 'apollo-server'

import {
  User,
  Resolvers,
  UserResult,
  AllUsersResult,
  NewUserResult,
  LoginUserResult,
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
      try {
        const res = await fetch(db)
        const users = await res.json()
        console.log(users)
        if (await users.length !== 0) {
          return {
            __typename: "AllUsersSuccess",
            result: [...users],
          }
        }
        return {
          __typename: "AllUsersFailure",
          message: 'There are currently no registered users'
        }
      } catch (err) {
          throw UNHANDLED_ACTION(err)      
      }

    },

    usersWithStatus: async (root, { isLoggedIn }, { db }, info): Promise<AllUsersResult> => {

      try {
        const res = await fetch(db)
        const users = await res.json()
        if (await users) {
          const matching = users.filter(user => user.isLoggedIn === isLoggedIn)
          if (matching.length > 0) {
            return {
              __typename: 'AllUsersSuccess',
              result: [...matching],
            }
          }
          return {
            __typename: 'AllUsersFailure',
            message: `There are currently no registered users matching status ${isLoggedIn}` 
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

  Mutation: {
  // MUTATIONS
  createNewUser: async (root, {username, email}, { db, id }, info):Promise<NewUserResult> => {
    const NEW_USER = {
      id: id,
      username: username,
      email: email,
      dateCreated: Date.now(),
      isLoggedIn: (false)
    }
    try {
      const test = await fetch(db)
      const response = await test.json() 
      if (await response.filter(i => i.username === NEW_USER.username).length !== 0) return {
        __typename: 'UserAlreadyExistsErr',
        message: `A user w/ username ${NEW_USER.username} already exists` 
      }

      const newUser =  await fetch(db, {
        method: 'POST', 
        body: JSON.stringify(NEW_USER), 
        headers: {'Content-Type': 'application/json'
      }})
      const res = await newUser.json()
      return {
        __typename: 'User',
        ...res
      }
    } catch (err) {
      throw UNHANDLED_ACTION(err)
    }
  },
  toggleUserLogIn: async (root, {id, isLoggedIn}, { db }, info):Promise<LoginUserResult> => {
    try {
      const test = await fetch(db)
      const response = await test.json() 
      const findUser = await response.filter(i => i.id === id)
      if (await findUser.length === 0) return {
        __typename: 'ErrorOnUserLogin',
        UserNotFoundErr: {
          __typename: 'UserNotFoundErr',
          message: `A user w/ id ${id} doesn't exists` 
        }
      } 
      else if (await findUser[0].isLoggedIn === isLoggedIn) return {
        __typename: 'ErrorOnUserLogin',
        UserLoginErr: {
          __typename: 'UserLoginErr',
          message: `The user w/ id ${id} could not be set to ${isLoggedIn} because their status is already ${isLoggedIn}}` 
        }
      }
      const updateUser = {
        ...findUser[0],
        isLoggedIn: isLoggedIn
      }
      const toggledUser =  await fetch(`${db}/${id}`, {
        method: 'PATCH', 
        body: JSON.stringify(updateUser), 
        headers: {'Content-Type': 'application/json'
      }})
      const res = await toggledUser.json()
      return {
        __typename: 'User',
        ...res
      }
    } catch (err) {
      throw UNHANDLED_ACTION(err)
    }
  },
},

  // RESOLVE UNION TYPES
  AllUsersResult: {
    __resolveType(obj) {
      if (obj.result) {
        return 'AllUsersSuccess'
      }
      if (obj.message) {
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
      if(obj.UserLoginErr) {
        return 'ErrorOnUserLogin'
      }
      if(obj.UserNotFoundErr) {
        return 'ErrorOnUserLogin'
      }
    }
  }
}