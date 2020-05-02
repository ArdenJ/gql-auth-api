import {ApolloServer} from 'apollo-server'

import {typeDefs} from './typedefs'
import {resolvers} from './resolvers'

const genServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  })
} 

export { genServer }