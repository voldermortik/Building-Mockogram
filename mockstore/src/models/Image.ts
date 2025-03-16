import mongoose, { Schema } from 'mongoose';

export interface IImage {
  filename: string;
  _id: mongoose.Types.ObjectId;
}

const imageSchema = new Schema<IImage>({
  filename: {
    type: String,
    required: true
  }
});

export const Image = mongoose.model<IImage>('Image', imageSchema); 
