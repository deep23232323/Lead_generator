import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.route'
import leadRoutes from './routes/lead.route'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)

app.get('/', (_, res) => {
  res.send('API Running')
})

export default app