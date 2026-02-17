import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

// Parse JSON bodies
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Climate API is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
