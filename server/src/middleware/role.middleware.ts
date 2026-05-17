import { Request, Response, NextFunction } from 'express'
import { IUser } from '../models/user.model'

interface AuthRequest extends Request {
  user?: IUser
}

export const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied',
      })
    }

    next()
  }
}