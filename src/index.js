import { app, init } from './app.js'

const PORT = process.env.PORT || 3000

await init()

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`GraphQL playground: http://localhost:${PORT}/graphql`)
})
