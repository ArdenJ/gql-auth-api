import { ApolloServer } from 'apollo-server'

import crypto from 'crypto'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { tradeTokenForUser } from './auth/auth-helpers'
import { User } from './generated/graphql'

const HEADER_NAME = 'authorization'

const genServer = () => {
  console.log('generating...')
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: async ({ req }) => ({
      req: req,
      id: crypto.randomBytes(10).toString('hex'), 

      authenticate: async (req):Promise<User | string | null> => {
        let authToken = null
        let currentUser = null
        try {
          authToken = req.headers[HEADER_NAME]

          if (authToken) {
            currentUser = await tradeTokenForUser(authToken)
          }

        } catch (err) {
          console.log(err)
          console.warn(`Unable to authenticate w/ token ${authToken}`)
        }

        return currentUser
      }
    })
  })
} 

export { genServer }