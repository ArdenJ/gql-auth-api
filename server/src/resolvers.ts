import { ApolloError } from 'apollo-server'

import { createToken } from './auth/gen-token';
import { encrypt, validatePassword } from './utils/hash-secret';
import {sanitizeUserObj as sanitize}  from './utils/sanitize'
import { validate } from './validate/user-validation';

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

import {
  UserResult,
  UserAuth,
  AllUsersResult,
  NewUserResult,
  LoginUserResult,
  DeleteUserResult,
} from './generated/graphql'

const UNHANDLED_ACTION = (err: any) => new ApolloError(`APOLLO ERR -- UNHANDLED ACTION: ${err}`, err.stack)

export const resolvers = {
  // QUERIES
  Query: {
    currentUser: async (root, args, {req, authenticate}, info):Promise<UserAuth> => {
      try {
        const response = await authenticate(req)

        if (!response) return {
          __typename: 'ErrorOnUserAuth',
          UnableToAutheticateReq: {
            message: 'Unable to authenticate request'
          }
        }

        const user = await getUserById(response?.id)

        if (!user.id) return {
          __typename: 'ErrorOnUserAuth',
          UserNotFoundErr: {
            message: 'Unable to authenticate: user does not exist'
          },
        }

        return {
          __typename: 'User',
          ...sanitize(user)
        }
      } catch (e) {
        throw UNHANDLED_ACTION(e)
      }
    },

    user: async (root, { id }, ctx, info): Promise<UserResult> => {
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

    users: async (root, args, ctx, info): Promise<AllUsersResult> => {
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

    usersWithStatus: async (root, { isLoggedIn }, ctx, info): Promise<AllUsersResult> => {
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
    userCanLogIn: async (root, { id }, ctx, info): Promise<UserResult> => {
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
  createNewUser: async (
    root, { username, email, password, passwordConfirmation }, { id }, info
    ):Promise<NewUserResult> => {

    const NEW_USER = {
      id: id,
      username: username,
      email: email,
      dateCreated: Date.now().toString(),
      isLoggedIn: false
    }

    try {
      // TODO: this should be a mismatch err type
      // Do passwords match?
      if (password !== passwordConfirmation) return {
        __typename: 'UserAlreadyExistsErr',
        message: 'Passwords must match'
      } 
      
      // TODO: combine requests to db if you need to make multiple checks.
      // is the username taken?
      const usernameResponse = await getUserByAttr({ username: username })
      
      if (usernameResponse !== null ) return {
        __typename: 'UserAlreadyExistsErr',
        message: `A user w/ username ${NEW_USER.username} already exists` 
      }
      
      // are the username, email and password valid?
      const result = await validate({
        username, 
        email, 
        password, 
        passwordConfirmation
      }).catch(err => console.log(err))

      if (result?.message) return {
        __typename: 'UserAlreadyExistsErr',
        message: `There was an issue ${result?.message}`
      }

      // Does an account with this email address exist already?
      const emailResponse = await getUserByAttr({ email: email })

      if (emailResponse !== null ) return {
        __typename: 'UserAlreadyExistsErr',
        message: `A user w/ this email already exists` 
      }

      // If none of the above match -> hash the password and create a new user
      const hashedPassword = await encrypt(password)

      const newUser = await createUser({
        ...NEW_USER,
        password: hashedPassword
      })

      return {
        __typename: 'User',
        ...sanitize(newUser)
      }
    } catch (err) {
      throw UNHANDLED_ACTION(err)
    }
  },
  
  userLogin: async (root, {username, password}, ctx, info):Promise<LoginUserResult> => {
    try {
      const user = await getUserByAttr({username})

      if (!user) return {
        __typename: 'ErrorOnUserLogin',
        UserNotFoundErr: {
          __typename: 'UserNotFoundErr',
          message: `A user w/ id ${username} doesn't exists` 
        }
      } 

      if (user.isLoggedIn) return {
        __typename: 'ErrorOnUserLogin',
        UserLoginErr: {
          __typename: 'UserLoginErr',
          message: 'Error logging in'
        }
      }

      const isValid = await validatePassword(password, user)

      if (!isValid) return {
        __typename: 'ErrorOnUserLogin',
        UserLoginErr: {
          __typename: 'UserLoginErr',
          message: 'Incorrect password'
        }
      } 
      
      const loggedInUser = await toggleUserStatus(user.id, true)

      return {
        __typename: 'SuccessOnUserLogin',
        token: createToken(sanitize(loggedInUser)),
        currentUser: sanitize(loggedInUser)
      }

    } catch (e) {
      throw UNHANDLED_ACTION(e)
    }
  },

  toggleUserLogIn: async (root, {id, isLoggedIn}, ctx, info):Promise<LoginUserResult> => {
    try {
      const user = await getUserById(id)
      if (!user) return {
        __typename: 'ErrorOnUserLogin',
        UserNotFoundErr: {
          __typename: 'UserNotFoundErr',
          message: `A user w/ id ${id} doesn't exists` 
        }
      } 
      else if (user.isLoggedIn === isLoggedIn) return {
        __typename: 'ErrorOnUserLogin',
        UserLoginErr: {
          __typename: 'UserLoginErr',
          message: `The user w/ id ${id} could not be set to ${
            isLoggedIn
          } because their status is already ${isLoggedIn}}` 
        }
      }
      const toggledUser =  await toggleUserStatus(id, isLoggedIn)
      return {
        __typename: 'SuccessOnUserLogin',
        token: createToken(toggledUser),
        currentUser: toggledUser
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
  // TODO: This is wrong
  DeleteUserResult: {
    __resolveType(obj) {
      if(obj.token) {
        return 'SuccessOnUserLogin'
      }
      if(obj.UserLoginErr) {
        return 'ErrorOnUserLogin'
      }
      if(obj.UserNotFoundErr) {
        return 'ErrorOnUserLogin'
      }
    }
  },
  LoginUserResult: {
    __resolveType(obj) {
      if(obj.token) {
        return 'SuccessOnUserLogin'
      }
      if(obj.UserLoginErr) {
        return 'ErrorOnUserLogin'
      }
      if(obj.UserNotFoundErr) {
        return 'ErrorOnUserLogin'
      }
    }
  },
  UserAuth: {
    __resolveType(obj) {
      if(obj.id) {
        return 'User'
      }
      if(obj.UserNotFoundErr) {
        return 'ErrorOnUserAuth'
      }
      if(obj.UnableToAutheticateReq) {
        return 'ErrorOnUserAuth'
      }
    }
  }
}