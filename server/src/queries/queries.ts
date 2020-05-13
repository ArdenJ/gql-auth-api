import { gql } from 'apollo-server'

// This is a list of queries that can be run against the API 

// requires an authorization header to be passed to it 
// this can be obtained from logging in a User 
// { "authorization": "bearer TOKEN"}
export const CURRENT_USER = gql`
  query CURRENT_USER {
  currentUser {
    __typename
    ... on User {
      id
      username
      isLoggedIn
    }
    ... on ErrorOnUserAuth {
      UserNotFoundErr {
        message
      }
      UnableToAutheticateReq {
        message
      }
    }
  }
}
`
export const ALL_USERS = gql`
  query ALL_USERS {
    users {
      __typename
      ... on AllUsersSuccess {
        result {
          id
          username
          email
          isLoggedIn
        }
      }
      ... on AllUsersFailure {
        message
      }
    }
  }
`

export const USER = gql`
  query USER($ID: String!) {
    user(id: $ID) {
      __typename
      ... on User {
        id 
        username
        isLoggedIn
      }
      ... on UserNotFoundErr {
        message
      }
    }
  }
`

// return array of users with matching status
export const USERS_WITH_STATUS = gql`
  query USERS_WITH_STATUS($STATUS: Boolean!) {
    usersWithStatus(isLoggedIn: $STATUS) {
      __typename
      ... on AllUsersSuccess {
        result {
          id
          username
          isLoggedIn
        }
      }
      ... on AllUsersFailure {
        message
      }
    }
  }
` 

export const USER_CAN_LOG_IN = gql`
  query USER_CAN_LOGIN($ID: String!) {
    userCanLogIn(id: $ID) {
      __typename
      ... on User {
        id
        username
        isLoggedIn
      }
      ... on UserNotFoundErr {
        message
      }
    }
  }
`

// Mutations
export const REGISTER_USER = gql`
  mutation REGISTER_USER(
    $USERNAME: String!
    $EMAIL: String
    $PASSWORD: String!
    $PASSWORDCONF: String!
  ) {
    createNewUser(
      username: $USERNAME, 
      email: $EMAIL, 
      password: $PASSWORD, 
      passwordConfirmation: $PASSWORDCONF
    ) {
      __typename
      ... on User {
        id
        username
        email
        isLoggedIn
        dateCreated
      }
      ... on UserAlreadyExistsErr {
        message
      }
    }
  }
`

// This returns a token which can be used to authenticate 
// protected queries
export const LOGIN_USER = gql`
  mutation LOGIN_USER($USERNAME: String! $PASSWORD: String!){
    userLogin(username: $USERNAME, password: $PASSWORD) {
      __typename
      ... on SuccessOnUserLogin {
        token
        currentUser {
          username
          email
          isLoggedIn
        }
      }
      ... on ErrorOnUserLogin {
        UserLoginErr {
          message
        }
        UserNotFoundErr {
          message
        }
      }
    }
  }
`

// Protected: This requires a token to authenticate
export const DELETE_USER = gql`
  mutation DELETE_USER($USERNAME: String! $PASSWORD: String!){
    deleteUser(username: $USERNAME, password: $PASSWORD) {
      __typename
      ... on DeleteUserSuccess {
        message
      }
      ... on DeleteUserError {
        ErrorOnUserAuth {
          message
        }
        ErrorOnUserLookUp {
          message
        }
      }
    }
  }
`

// TODO: This should be protected by a the current Users role 
export const TOGGLE_USER_LOGIN = gql`
  mutation TOGGLE_USER_LOGIN($ID: String! $NEW_STATUS: Boolean!){
  toggleUserLogIn(id: $ID isLoggedIn: $$NEW_STATUS) {
			__typename
    ... on SuccessOnUserLogin {
      currentUser {
        username
      }
    }
    ... on ErrorOnUserLogin {
      UserLoginErr {
        message
      }
      UserNotFoundErr {
        message
      }
    }
  }
}
`