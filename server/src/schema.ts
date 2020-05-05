import { NewUserResult, UserAlreadyExistsErr, LoginUserResult, UserLoginErr, AllUsersResult, AltAllUsersResult } from './generated/graphql';
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
  type AllUsersResult { 
    status: Boolean!
    success: [User] 
    failure: ActionYieldsNoResult
  }

  # ALL USERS 
  # This feels like a really long winded way of returning 
  # either a string or an array from a query but you can't 
  # define arrays directly on unions  
  type AllUsersSuccess {
    status: Boolean!
    result: [User]
  }

  type AllUsersFailure {
    status: Boolean!
    result: String
  }

  union AltAllUsersResult = AllUsersSuccess | AllUsersFailure
# END EXPERIMENT

  type NewUserResult {
    status: Boolean!
    success: User
    failure: UserAlreadyExistsErr
  }

  type LoginUserResult {
    status: Boolean!
    success: User
    failure: UserLoginErr
  }

  type Passcode {
    secret: String!
    TTL: Int!
  }

  type Query {
    user(id: String!): UserResult!
    users: AllUsersResult!
    altusers: AltAllUsersResult!
    usersWithStatus(isLoggedIn: Boolean!): AllUsersResult!
    userCanLogIn(id: String!): UserResult!
  }

  type Mutation {
    # create returns a USER or an error the username 
    # is not unique 
    createNewUSER(
      username: String!, 
      email: String
    ): NewUserResult

    # toggle returns either a USER, an Err if a USER 
    # cannot be found, or an log in error if they try 
    # to log out while already out and vice versa 
    toggleUSERLogIn(secret: String!, TTL: Int!, id: String!): LoginUserResult!
  }
`