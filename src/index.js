import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers.js'
import { getUser } from './middleware/jwt.js'

const PORT = process.env.PORT || 3000

async function start() {
  // 1. Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // 2. Create Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers })

  // 3. Start server with auth context
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ user: getUser(req) }),
    listen: { port: PORT }
  })

  console.log(`Server running at ${url}`)
  console.log(`GraphQL: ${url}`)
}

start()
