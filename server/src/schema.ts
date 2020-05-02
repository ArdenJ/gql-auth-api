import { gql } from 'apollo-server'

export const typeDefs = gql`
  type USER {
    id: String!
    username: String!
    email: String
    dateCreated: String!
    isLoggedIn: Boolean!
  }

  type USER_NOT_FOUND_ERR {
    message: String!
  }

  type USER_NOT_LOGGED_IN_ERR {
    message: String!
  }

  type USER_ALREADY_EXISTS_ERR {
    message: String!
  }

  type USER_LOG_IN_ERR {
    message: String!
  }

  union USER_RESULT = USER | USER_NOT_FOUND_ERR

  type PASSCODE {
    secret: String!
    TTL: Int!
  }

  type Query {
    user(id: String!): USER_RESULT
    users: [USER_RESULT!]!
    loggedInUsers(isLoggedIn: Boolean!): [USER_RESULT]!
    userCanLogIn(id: String!): USER_RESULT!
  }

  type Mutation {
    # create returns a USER or an error the username is not unique 
    createNewUSER(
      id: String!, 
      username: String!, 
      email: String, 
      dateCreated: String!, 
      isLoggedIn: Boolean!
    ): USER # | USER_ALREADY_EXISTS_ERR

    # toggle returns either a USER, an Err if a USER cannot be found, or an log in error if they try to log out while already out and vice versa 
    toggleUSERLogIn(secret: String!, TTL: Int!, id: String!): USER_RESULT #| USER_LOG_IN_ERR
  }
`