import { UserNotFoundErr, UserResult, ErrorOnUserAuth, UnableToAutheticateReq } from './generated/graphql';
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

  # Searching for a user by ID must return an user 
  # Therefore, no user must be an error
  union UserResult = User | UserNotFoundErr 

  type UnableToAutheticateReq {
    message: String!
  }

  type ErrorOnUserAuth {
    UserNotFoundErr: UserNotFoundErr
    UnableToAutheticateReq: UnableToAutheticateReq
  }

  union UserAuth = User | ErrorOnUserAuth

  # ALL USERS 
  # This feels like a really long winded way of returning 
  # either a string or an array from a query but you can't 
  # define arrays directly on unions  
  type AllUsersSuccess {
    result: [User]!
  }

  type AllUsersFailure {
    message: String!
  }

  union AllUsersResult = AllUsersSuccess | AllUsersFailure

  # MUTATION TYPE RESULTS
  union NewUserResult = User | UserAlreadyExistsErr 

  type ErrorOnUserLogin {
    UserLoginErr: UserLoginErr
    UserNotFoundErr: UserNotFoundErr
  }

  type SuccessOnUserLogin {
    token: String
    currentUser: User 
  }

  union LoginUserResult = SuccessOnUserLogin | ErrorOnUserLogin

  type DeleteUserSuccess {
    message: String
  }

  type DeleteUserError {
    ErrorOnUserAuth: UnableToAutheticateReq
    ErrorOnUserLookUp: UserNotFoundErr
  }

  union DeleteUserResult = DeleteUserSuccess | DeleteUserError

  type Query {
    currentUser: UserAuth!
    user(id: String!): UserResult!
    users: AllUsersResult!
    usersWithStatus(isLoggedIn: Boolean!): AllUsersResult!
    userCanLogIn(id: String!): UserResult!
  }

  type Mutation {
    # create returns a USER or an error the username 
    # is not unique 
    createNewUser(username: String!, email: String password: String! passwordConfirmation: String!): NewUserResult!

    # toggle returns either a USER, an Err if a USER 
    # cannot be found, or an log in error if they try 
    # to log out while already out and vice versa 
    toggleUserLogIn(id: String! isLoggedIn: Boolean!): LoginUserResult!

    userLogin(username: String! password: String!): LoginUserResult!

    deleteUser(username: String! password: String!): DeleteUserResult!
  }
`