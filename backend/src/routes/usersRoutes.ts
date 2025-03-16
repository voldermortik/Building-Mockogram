import express from 'express';
import {
  loginUser,
  logoutUser,
  getCurrentUser
} from '../controllers/usersController.js';
import { verifyUser } from '@/middleware/verifyUser';
const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', verifyUser, getCurrentUser);

export default router; 
