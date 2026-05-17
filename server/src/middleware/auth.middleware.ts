import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import User, { IUser } from '../models/user.model'

interface AuthRequest extends Request {
  user?: IUser
}

interface JwtPayload {
  id: string
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized',
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    })
  }
}