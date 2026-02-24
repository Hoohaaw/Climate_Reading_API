import 'dotenv/config'
import fs from 'fs'
import csv from 'csv-parser'
import mongoose from 'mongoose'
import Country from '../models/country.js'
import City from '../models/city.js'
import Reading from '../models/reading.js'

// The 17 countries you picked
const ALLOWED_COUNTRIES = [
  'Sweden', 'Norway', 'Finland', 'Denmark', 'Iceland',
  'Mexico', 'Puerto Rico', 'Spain', 'Italy', 'Japan',
  'China', 'Australia', 'Greece', 'Canada', 'Vietnam',
  'Portugal', 'Brazil'
]

// Parse "57.05N" → 57.05, "10.33W" → -10.33
function parseCoordinate(coord) {
  const value = parseFloat(coord)
  const direction = coord.slice(-1)
  return (direction === 'S' || direction === 'W') ? -value : value
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clear existing data
  await Country.deleteMany({})
  await City.deleteMany({})
  await Reading.deleteMany({})
  console.log('Cleared existing data')

  // We'll collect unique countries and cities first
  const countryMap = new Map()  // "Sweden" → ObjectId
  const cityMap = new Map()     // "Stockholm|Sweden" → ObjectId
  const readings = []

  const rows = []

  // Read all rows from CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream('src/seeds/GlobalLandTemperaturesByCity.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Only keep our selected countries
        if (!ALLOWED_COUNTRIES.includes(row.Country)) return

        // Skip rows with no temperature
        if (!row.AverageTemperature || row.AverageTemperature === '') return

        rows.push(row)
      })
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`Read ${rows.length} rows from CSV`)

  // Step 1: Create countries
  const uniqueCountries = [...new Set(rows.map(r => r.Country))]
  for (const name of uniqueCountries) {
    const country = await Country.create({ name })
    countryMap.set(name, country._id)
  }
  console.log(`Created ${uniqueCountries.length} countries`)

  // Step 2: Create cities
  const uniqueCities = new Map()
  for (const row of rows) {
    const key = `${row.City}|${row.Country}`
    if (!uniqueCities.has(key)) {
      uniqueCities.set(key, {
        name: row.City,
        latitude: parseCoordinate(row.Latitude),
        longitude: parseCoordinate(row.Longitude),
        country: countryMap.get(row.Country)
      })
    }
  }

  for (const [key, cityData] of uniqueCities) {
    const city = await City.create(cityData)
    cityMap.set(key, city._id)
  }
  console.log(`Created ${uniqueCities.size} cities`)

  // Step 3: Create readings in batches of 5000
  const BATCH_SIZE = 5000
  let batch = []
  let totalInserted = 0

  for (const row of rows) {
    const key = `${row.City}|${row.Country}`
    batch.push({
      date: new Date(row.dt),
      averageTemperature: parseFloat(row.AverageTemperature),
      averageTemperatureUncertainty: row.AverageTemperatureUncertainty
        ? parseFloat(row.AverageTemperatureUncertainty)
        : null,
      city: cityMap.get(key)
    })

    if (batch.length >= BATCH_SIZE) {
      await Reading.insertMany(batch)
      totalInserted += batch.length
      console.log(`Inserted ${totalInserted} readings...`)
      batch = []
    }
  }

  // Insert remaining
  if (batch.length > 0) {
    await Reading.insertMany(batch)
    totalInserted += batch.length
  }

  console.log(`\nDone! Seeded:`)
  console.log(`  ${uniqueCountries.length} countries`)
  console.log(`  ${uniqueCities.size} cities`)
  console.log(`  ${totalInserted} readings`)

  await mongoose.disconnect()
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})