import { gql } from 'apollo-server'

export const typeDefs = gql`
  type User {
    id: String
    username: String
    email: String
    dateCreated: String
    isLoggedIn: Boolean
  }

  type UserNotFoundErr {
    message: String!
  }

  type UserAlreadyExistsErr {
    message: String!
  }

  type UserLoginErr {
    message: String!
  }

  union UserResult = User | UserNotFoundErr

  union NewUserResult = User | UserAlreadyExistsErr

  union LoginUserResult = User | UserLoginErr

  type Passcode {
    secret: String!
    TTL: Int!
  }

  type Query {
    user(id: String!): UserResult!
    users: [User]!
    loggedInUsers(isLoggedIn: Boolean!): [UserResult]!
    userCanLogIn(id: String!): UserResult!
  }

  type Mutation {
    # create returns a USER or an error the username is not unique 
    createNewUSER(
      id: String!, 
      username: String!, 
      email: String, 
      dateCreated: String!, 
      isLoggedIn: Boolean!
    ): NewUserResult

    # toggle returns either a USER, an Err if a USER cannot be found, or an log in error if they try to log out while already out and vice versa 
    toggleUSERLogIn(secret: String!, TTL: Int!, id: String!): LoginUserResult!
  }
`