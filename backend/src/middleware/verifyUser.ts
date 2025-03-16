import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { NextFunction, Response } from 'express';
import { User } from '@/models/User';
import { env } from '@/config/env';
import { AuthenticatedRequest } from '@/interfaces/AuthenticatedRequest';

export const verifyUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.mgAccessToken;

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // not specifically checking for expired token; this will get caught in the decoding process
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET as string
    ) as JwtPayload;

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      res.status(401).json({ message: 'Invalid user ID format' });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'User does not exist' });
      return;
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}; 
