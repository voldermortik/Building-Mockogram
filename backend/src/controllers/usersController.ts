import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/interfaces/AuthenticatedRequest';
import { User } from '@/models/User';
import { env } from '@/config/env';

// could make this configurable, but for now only referenced in this file
const COOKIE_NAME = 'mgAccessToken';

const ARGONTWO_CONFIG: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: env.ARGON2_MEMORY_COST,
  timeCost: env.ARGON2_TIME_COST,
  parallelism: env.ARGON2_PARALLELISM
};

// Parse domain from CLIENT_URL
const clientDomain = new URL(env.CLIENT_URL).hostname;

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

    const user = await User.findOne({ 
      username: username.toLowerCase() 
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await argon2.verify(user.hashedPassword, password, ARGONTWO_CONFIG);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRATION }
    );
  
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: env.JWT_EXPIRATION,
      path: '/',
      domain: clientDomain
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    domain: clientDomain
  });

  res.json({ message: 'Successfully logged out' });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-hashedPassword');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({_id: user._id, username: user.username});
  } catch (error) {
    console.error('Error in /users/me:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 
