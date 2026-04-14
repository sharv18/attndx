import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    return
  }
  const existing = await User.findOne({ email })
  if (existing) {
    return
  }
  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({ email, passwordHash, role: 'admin' })
}
