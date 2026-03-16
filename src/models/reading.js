import mongoose from 'mongoose'

const readingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  averageTemperature: { type: Number, default: null },
  averageTemperatureUncertainty: { type: Number, default: null },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }
})

const Reading = mongoose.model('Reading', readingSchema)

export default Reading
