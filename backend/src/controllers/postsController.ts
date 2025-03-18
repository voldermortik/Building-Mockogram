import {
  Request,
  Response
} from 'express';
import { Post } from '@/models/Post';
import { User } from '@/models/User';

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

  export const createPost = async (req: Request, res: Response) => {
    res.status(500).json({ error: 'Not yet implemented' });
};
