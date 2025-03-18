import express from 'express';
import {
  createPost,
  getPostsByUsername,
} from '../controllers/postsController.js';
const router = express.Router();

router.get('/user/:username', getPostsByUsername);
router.post('/', createPost);

export default router; 
