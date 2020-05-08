import fetch from 'node-fetch'
import { ApolloError } from 'apollo-server'
import { 
  getUsers, 
  getUsersByAttr, 
  getUserById, 
  getUserByAttr, 
  createUser, 
  toggleUserStatus 
} from './prisma-functions';

// The resolvers are quite opinionated...
// When a request is made to the api Apollo either returns a fragment 
// on the requested type or some kind of error/failure type with a reason.
// This is designed to remove the need to interpret the response on the client 
// side. Instead, if the expected type is not returned, the client only needs 
// to check that the expected type has been returned rather than an error.

import { authenticated } from './utils/auth-guard'

import {
  UserResult,
  AllUsersResult,
  NewUserResult,
  LoginUserResult,
} from './generated/graphql'

const UNHANDLED_ACTION = ({err}: any) => new ApolloError(`APOLLO ERR -- UNHANDLED ACTION: ${err}`)

export const resolvers = {
  // QUERIES
  Query: {
    me: authenticated((root, args, {req, authenticate}, info) => authenticate(req).currentUser),
    user: async (root, { id }, { db }, info): Promise<UserResult> => {
      try {
        const user = await getUserById(id)
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
        const res = await getUsers()
        console.log(res)
        if (await res.length !== 0) {
          return {
            __typename: "AllUsersSuccess",
            result: [...res],
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
        const users = await getUsersByAttr({ isLoggedIn: isLoggedIn })
        if (users.length > 0) {
          return {
            __typename: 'AllUsersSuccess',
            result: [...users],
          }
        }
        return {
          __typename: 'AllUsersFailure',
          message: `There are currently no registered users matching status ${isLoggedIn}` 
        }
      } catch (err) {
          throw UNHANDLED_ACTION(err)
      }
    },
    userCanLogIn: async (root, { id }, { db }, info): Promise<UserResult> => {
      try {
        const user = await getUserById(id)
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
      dateCreated: Date.now().toString(),
      isLoggedIn: (false)
    }
    try {
      const test = await fetch(db)
      const response = await test.json() 
      if (await response.filter(i => i.username === NEW_USER.username).length !== 0) return {
        __typename: 'UserAlreadyExistsErr',
        message: `A user w/ username ${NEW_USER.username} already exists` 
      }

      const newUser = await createUser(NEW_USER)
      return {
        __typename: 'User',
        ...newUser
      }
    } catch (err) {
      throw UNHANDLED_ACTION(err)
    }
  },
  toggleUserLogIn: async (root, {id, isLoggedIn}, { db }, info):Promise<LoginUserResult> => {
    try {
      const user = await getUserById(id)
      if (await !user) return {
        __typename: 'ErrorOnUserLogin',
        UserNotFoundErr: {
          __typename: 'UserNotFoundErr',
          message: `A user w/ id ${id} doesn't exists` 
        }
      } 
      else if (await user.isLoggedIn === isLoggedIn) return {
        __typename: 'ErrorOnUserLogin',
        UserLoginErr: {
          __typename: 'UserLoginErr',
          message: `The user w/ id ${id} could not be set to ${isLoggedIn} because their status is already ${isLoggedIn}}` 
        }
      }
      const toggledUser =  await toggleUserStatus(id, isLoggedIn)
      return {
        __typename: 'User',
        ...toggledUser
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