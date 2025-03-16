import mongoose from 'mongoose';
import {
  Document,
  Types
} from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  hashedPassword: string;
} 

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // not best practice, should store original casing, but keeping things simple
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  hashedPassword: {
    type: String,
    required: true,
    match: [
      /^\$argon2(id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/,
      'Invalid Argon2 hash format'
    ]
  }
});

export const User = mongoose.model<IUser>('User', userSchema); 
