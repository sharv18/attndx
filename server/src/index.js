import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import { ensureAdminUser } from './seed/ensureAdminUser.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/attendance', attendanceRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Server error' })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await ensureAdminUser()
    app.listen(port, () => {
      console.log(`AttendX API running on :${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed', error)
    process.exit(1)
  })
