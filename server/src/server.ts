import { ApolloServer } from 'apollo-server'

import crypto from 'crypto'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'

const genServer = () => {
  console.log('generatign....')
  return new ApolloServer({
    typeDefs,
    // resolvers,
    introspection: true,
    playground: true,
    context: () => ({
      id: crypto.randomBytes(10).toString('hex'),
      db: `http://localhost:5555/users`, // TODO: until WSL2 is released 😫
      auth: () => {
        return 'boop' 
      }
    })
  })
} 

export { genServer }