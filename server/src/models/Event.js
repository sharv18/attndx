import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    time: { type: String },
    location: { type: String, required: true },
    attendees: { type: Number, default: 0 },
    status: { type: String, enum: ['Upcoming', 'Past'], default: 'Upcoming' },
    qrToken: { type: String, required: true, unique: true },
  },
  { timestamps: true },
)

export default mongoose.model('Event', eventSchema)
