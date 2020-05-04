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

  type ActionYieldsNoResult {
    # This is a generic result that can be return the client
    # when the action is accepted but there is nothing to show
    message: String
  }

  # Searching for a user by ID must return an user 
  # Therefore, no user must be an error
  union UserResult = User | UserNotFoundErr 

  # Searching for all users or logged in users returns 
  # a no results type Because it is reasonable that 
  # there are no results matching the query
  union AllUsersResult = User | ActionYieldsNoResult

  union NewUserResult = User | UserAlreadyExistsErr

  union LoginUserResult = User | UserLoginErr

  type Passcode {
    secret: String!
    TTL: Int!
  }

  type Query {
    user(id: String!): UserResult!
    users: [AllUsersResult]!
    usersWithStatus(isLoggedIn: Boolean!): [AllUsersResult]!
    userCanLogIn(id: String!): UserResult!
  }

  type Mutation {
    # create returns a USER or an error the username 
    # is not unique 
    createNewUSER(
      id: String!, 
      username: String!, 
      email: String, 
      dateCreated: String!, 
      isLoggedIn: Boolean!
    ): NewUserResult

    # toggle returns either a USER, an Err if a USER 
    # cannot be found, or an log in error if they try 
    # to log out while already out and vice versa 
    toggleUSERLogIn(secret: String!, TTL: Int!, id: String!): LoginUserResult!
  }
`