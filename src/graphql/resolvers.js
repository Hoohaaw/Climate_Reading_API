import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import Reading from '../models/reading.js'
import City from '../models/city.js'
import Country from '../models/country.js'
import User from '../models/user.js'
import { requireAuth } from '../middleware/jwt.js'

const resolvers = {
  // ─── Queries ────────────────────────────────────────────────────────────────

  Query: {
    // Get all readings with optional filters and pagination
    readings: async (parent, { city, country, limit = 100, offset = 0 }) => {
      const filter = {}

      if (city) {
        const cityDoc = await City.findOne({ name: city })
        if (!cityDoc) throw new GraphQLError('City not found', { extensions: { code: 'NOT_FOUND', status: 404 } })
        filter.city = cityDoc._id
      }

      if (country) {
        const countryDoc = await Country.findOne({ name: country })
        if (!countryDoc) throw new GraphQLError('Country not found', { extensions: { code: 'NOT_FOUND', status: 404 } })
        const cities = await City.find({ country: countryDoc._id })
        filter.city = { $in: cities.map(c => c._id) }
      }

      return await Reading.find(filter)
        .limit(limit)
        .skip(offset)
        .sort({ date: -1 })
    },

    // Get a single reading by ID
    reading: async (parent, { id }) => {
      const reading = await Reading.findById(id)
      if (!reading) {
        throw new GraphQLError('Reading not found', {
          extensions: { code: 'NOT_FOUND', status: 404 }
        })
      }
      return reading
    },

    // Get all cities, optionally filtered by country name
    cities: async (parent, { country }) => {
      if (country) {
        const countryDoc = await Country.findOne({ name: country })
        if (!countryDoc) throw new GraphQLError('Country not found', { extensions: { code: 'NOT_FOUND', status: 404 } })
        return await City.find({ country: countryDoc._id })
      }
      return await City.find()
    },

    // Get a single city by name
    city: async (parent, { name }) => {
      const city = await City.findOne({ name })
      if (!city) {
        throw new GraphQLError('City not found', {
          extensions: { code: 'NOT_FOUND', status: 404 }
        })
      }
      return city
    },

    // Get all countries
    countries: async () => {
      return await Country.find()
    },

    // Get a single country by name
    country: async (parent, { name }) => {
      const country = await Country.findOne({ name })
      if (!country) {
        throw new GraphQLError('Country not found', {
          extensions: { code: 'NOT_FOUND', status: 404 }
        })
      }
      return country
    }
  },

  // ─── Mutations ───────────────────────────────────────────────────────────────

  Mutation: {
    // Register a new user
    register: async (parent, { email, username, password }) => {
      const existing = await User.findOne({ email })
      if (existing) {
        throw new GraphQLError('Email already in use', {
          extensions: { code: 'BAD_REQUEST', status: 400 }
        })
      }

      const hashed = await bcrypt.hash(password, 10)
      const user = await User.create({ email, username, password: hashed })

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return { token }
    },

    // Login with email and password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email })
      if (!user) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHORIZED', status: 401 }
        })
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHORIZED', status: 401 }
        })
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return { token }
    },

    // Create a new reading (requires authentication)
    createReading: async (parent, { input }, context) => {
      requireAuth(context)

      const city = await City.findById(input.cityId)
      if (!city) {
        throw new GraphQLError('City not found', {
          extensions: { code: 'NOT_FOUND', status: 404 }
        })
      }

      return await Reading.create({
        date: new Date(input.date),
        averageTemperature: input.averageTemperature ?? null,
        averageTemperatureUncertainty: input.averageTemperatureUncertainty ?? null,
        city: input.cityId
      })
    },

    // Update an existing reading (requires authentication)
    updateReading: async (parent, { id, input }, context) => {
      requireAuth(context)

      const city = await City.findById(input.cityId)
      if (!city) {
        throw new GraphQLError('City not found', {
          extensions: { code: 'NOT_FOUND', status: 404 }
        })
      }

      const reading = await Reading.findByIdAndUpdate(
        id,
        {
          date: new Date(input.date),
          averageTemperature: input.averageTemperature ?? null,
          averageTemperatureUncertainty: input.averageTemperatureUncertainty ?? null,
          city: input.cityId
        },
        { new: true } // Return the updated document
      )

      if (!reading) {
        throw new GraphQLError('Reading not found', {
          extensions: { code: 'NOT_FOUND', status: 404 }
        })
      }

      return reading
    },

    // Delete a reading (requires authentication)
    deleteReading: async (parent, { id }, context) => {
      requireAuth(context)

      const reading = await Reading.findByIdAndDelete(id)
      if (!reading) {
        throw new GraphQLError('Reading not found', {
          extensions: { code: 'NOT_FOUND', status: 404 }
        })
      }

      return true
    }
  },

  // ─── Nested Resolvers ────────────────────────────────────────────────────────
  // These run when a query asks for nested data (e.g. country { cities { ... } })

  Country: {
    cities: async (parent) => {
      return await City.find({ country: parent._id })
    }
  },

  City: {
    country: async (parent) => {
      return await Country.findById(parent.country)
    },
    readings: async (parent) => {
      return await Reading.find({ city: parent._id })
    }
  },

  Reading: {
    city: async (parent) => {
      // If city was already populated (e.g. via .populate()), return it directly
      if (parent.city && parent.city.name) return parent.city
      return await City.findById(parent.city)
    }
  }
}

export default resolvers
