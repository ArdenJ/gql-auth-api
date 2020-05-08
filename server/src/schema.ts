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

  # ALL USERS 
  # This feels like a really long winded way of returning 
  # either a string or an array from a query but you can't 
  # define arrays directly on unions  
  # TODO: It might not be worth defining success as a field
  # as we infer status from the __typename on the response 
  type AllUsersSuccess {
    result: [User]!
  }

  type AllUsersFailure {
    message: String!
  }

  union AllUsersResult = AllUsersSuccess | AllUsersFailure

  # MUTATION TYPE RESULTS
  # TODO: Mutations should return a confirmation type that includes the user?
  union NewUserResult = User | UserAlreadyExistsErr 

  type ErrorOnUserLogin {
    UserLoginErr: UserLoginErr
    UserNotFoundErr: UserNotFoundErr
  }

  union LoginUserResult = User | ErrorOnUserLogin

  type Passcode {
    secret: String!
    TTL: Int!
  }

  type Query {
    me: User
    user(id: String!): UserResult!
    users: AllUsersResult!
    usersWithStatus(isLoggedIn: Boolean!): AllUsersResult!
    userCanLogIn(id: String!): UserResult!
  }

  type Mutation {
    # create returns a USER or an error the username 
    # is not unique 
    createNewUser(username: String!, email: String): NewUserResult!

    # toggle returns either a USER, an Err if a USER 
    # cannot be found, or an log in error if they try 
    # to log out while already out and vice versa 
    toggleUserLogIn(id: String! isLoggedIn: Boolean!): LoginUserResult!
  }
`