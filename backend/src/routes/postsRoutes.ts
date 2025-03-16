import express from 'express';
import {
  createPost,
  getPostsByUsername,
} from '../controllers/postsController.js';
import { verifyUser } from '@/middleware/verifyUser';
const router = express.Router();

router.get('/user/:username', getPostsByUsername);
router.post('/', verifyUser, createPost);

export default router; 
