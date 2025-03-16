import mongoose from 'mongoose';
import {
  Document,
  Types
} from 'mongoose';

export interface IPost extends Document {
  user: Types.ObjectId;
  userComment: string | null;
  imageId: string;
  createDate: Date;
} 

const postSchema = new mongoose.Schema<IPost>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userComment: {
    type: String,
    required: true
  },
  imageId: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now
  }
});

export const Post = mongoose.model<IPost>('Post', postSchema); 
