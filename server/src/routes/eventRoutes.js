import { Router } from 'express'
import crypto from 'crypto'
import Event from '../models/Event.js'
import Attendance from '../models/Attendance.js'
import auth from '../middleware/auth.js'

const router = Router()

router.get('/', auth, async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    return res.json(events)
  } catch (error) {
    return next(error)
  }
})

router.post('/', auth, async (req, res, next) => {
  try {
    const { title, description, date, time, location } = req.body
    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const qrToken = crypto.randomBytes(8).toString('hex')
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      qrToken,
    })
    return res.status(201).json({ event })
  } catch (error) {
    return next(error)
  }
})

router.get('/by-token/:token', async (req, res, next) => {
  try {
    const event = await Event.findOne({ qrToken: req.params.token })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.json({
      title: event.title,
      date: event.date,
      location: event.location,
    })
  } catch (error) {
    return next(error)
  }
})

router.get('/:id/attendance', auth, async (req, res, next) => {
  try {
    const records = await Attendance.find({ event: req.params.id }).sort({
      createdAt: -1,
    })
    return res.json(records)
  } catch (error) {
    return next(error)
  }
})

export default router
