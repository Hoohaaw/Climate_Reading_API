import 'dotenv/config'
import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import mongoose from 'mongoose'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers.js'
import { getUser } from './middleware/jwt.js'

export const app = express()

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
})

let initialized = false

export async function init() {
  if (initialized) return
  initialized = true

  await server.start()

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  }

  app.use('/graphql', express.json(), expressMiddleware(server, {
    context: async ({ req }) => ({ user: getUser(req) })
  }))

  // Redirect root to playground
  app.get('/', (req, res) => res.redirect('/graphql'))
}
