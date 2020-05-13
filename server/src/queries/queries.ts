import { gql } from 'apollo-server'

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