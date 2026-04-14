import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    rollNumber: { type: String, required: true },
    name: { type: String, required: true },
    markedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Present' },
  },
  { timestamps: true },
)

attendanceSchema.index({ event: 1, rollNumber: 1 }, { unique: true })

export default mongoose.model('Attendance', attendanceSchema)
