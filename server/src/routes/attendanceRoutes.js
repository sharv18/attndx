import { Router } from 'express'
import Attendance from '../models/Attendance.js'
import Event from '../models/Event.js'

const router = Router()

router.post('/mark', async (req, res, next) => {
  try {
    const { token, rollNumber, name } = req.body
    if (!token || !rollNumber || !name) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const event = await Event.findOne({ qrToken: token })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    const normalizedRoll = rollNumber.toUpperCase()
    const record = await Attendance.findOne({
      event: event._id,
      rollNumber: normalizedRoll,
    })
    if (record) {
      return res.status(409).json({ message: 'Already marked' })
    }
    const attendance = await Attendance.create({
      event: event._id,
      rollNumber: normalizedRoll,
      name,
    })
    await Event.updateOne({ _id: event._id }, { $inc: { attendees: 1 } })
    return res.status(201).json(attendance)
  } catch (error) {
    return next(error)
  }
})

export default router
