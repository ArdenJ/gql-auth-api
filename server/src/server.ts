import { ApolloServer } from 'apollo-server'

import crypto from 'crypto'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { tradeTokenForUser } from './utils/auth-helpers'

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
      db: `http://localhost:5555/users`,
      serverTime: () => new Date(),
      authenticate: async (req) => {
      let authToken = null
      let currentUser = null

      try {
        authToken = req.headers[HEADER_NAME]

        if (authToken) {
          currentUser = await tradeTokenForUser(authToken)
        }

      } catch (err) {
        console.warn(`Unable to authenticate w/ token ${authToken}`)
      }

      return {
        authToken,
        currentUser
      }
    }
  })
  })
} 

export { genServer }