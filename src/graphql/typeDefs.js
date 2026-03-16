const typeDefs = `#graphql
  """A temperature reading for a specific city on a specific date"""
  type Reading {
    "Unique identifier"
    id: ID!
    "Date of the reading (ISO 8601 format)"
    date: String!
    "Average temperature in Celsius (can be null if data is missing)"
    averageTemperature: Float
    "Uncertainty value for the temperature measurement"
    averageTemperatureUncertainty: Float
    "The city this reading belongs to"
    city: City!
  }

  """A city with geographic coordinates"""
  type City {
    "Unique identifier"
    id: ID!
    "City name"
    name: String!
    "Latitude coordinate"
    latitude: Float!
    "Longitude coordinate"
    longitude: Float!
    "The country this city belongs to"
    country: Country!
    "All temperature readings for this city"
    readings: [Reading]
  }

  """A country"""
  type Country {
    "Unique identifier"
    id: ID!
    "Country name"
    name: String!
    "All cities in this country"
    cities: [City]
  }

  """Returned after a successful register or login"""
  type AuthPayload {
    "JWT token to use in the Authorization header for protected mutations"
    token: String!
  }

  """Input for creating or updating a reading"""
  input ReadingInput {
    "Date of the reading (ISO 8601 format, e.g. 2024-01-01)"
    date: String!
    "Average temperature in Celsius"
    averageTemperature: Float
    "Uncertainty value for the temperature measurement"
    averageTemperatureUncertainty: Float
    "ID of the city this reading belongs to"
    cityId: ID!
  }

  type Query {
    """Get temperature readings with optional filters and pagination"""
    readings(
      "Filter by city name"
      city: String
      "Filter by country name"
      country: String
      "Maximum number of results to return (default: 100)"
      limit: Int
      "Number of results to skip for pagination (default: 0)"
      offset: Int
    ): [Reading]

    """Get a single reading by ID"""
    reading(id: ID!): Reading

    """Get all cities, optionally filtered by country name"""
    cities(country: String): [City]

    """Get a single city by name"""
    city(name: String!): City

    """Get all countries"""
    countries: [Country]

    """Get a single country by name"""
    country(name: String!): Country
  }

  type Mutation {
    """Register a new user account"""
    register(email: String!, username: String!, password: String!): AuthPayload

    """Login with existing credentials"""
    login(email: String!, password: String!): AuthPayload

    """Create a new temperature reading (requires authentication)"""
    createReading(input: ReadingInput!): Reading

    """Update an existing temperature reading (requires authentication)"""
    updateReading(id: ID!, input: ReadingInput!): Reading

    """Delete a temperature reading (requires authentication)"""
    deleteReading(id: ID!): Boolean
  }
`

export default typeDefs
