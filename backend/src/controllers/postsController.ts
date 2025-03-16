import {
  Request,
  Response
} from 'express';
import mongoose from 'mongoose';
import { Post } from '@/models/Post';
import { User } from '@/models/User';
import { AuthenticatedRequest } from '@/interfaces/AuthenticatedRequest';

export const getPostsByUsername = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createDate: -1 })
      .populate('user', 'username');

    res.json(posts);
  } catch (error) {
    console.error('Error getting posts by username:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, userComment, imageId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid userId format' });
      return;
    }

    if (userId !== req.userId) {
      res.status(403).json({ error: 'Cannot create posts for other users' });
      return;
    }

    if (!imageId) {
      res.status(400).json({ error: 'imageId is required' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      res.status(400).json({ error: 'Invalid imageId format' });
      return;
    }

    if (userComment !== undefined && typeof userComment !== 'string') {
      res.status(400).json({ error: 'userComment must be a string' });
      return;
    }

    const post = await Post.create({
      user: req.userId, // Using the verified userId from middleware
      userComment: userComment,
      imageId,
      createDate: new Date()
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
