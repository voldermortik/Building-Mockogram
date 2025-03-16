import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Image } from '@/models/Image';

export const seedDatabase = async (): Promise<void> => {
  const imageDir = path.join(process.cwd(), 'filestore');
  const files = fs.readdirSync(imageDir)
    .filter(file => file.toLowerCase().endsWith('.jpg') && !file.startsWith('.'));

  for (const filename of files) {
    try {
      const baseFilename = filename.replace(/\.jpg$/i, '');
      let image;
      
      if (mongoose.Types.ObjectId.isValid(baseFilename)) {
        image = await Image.create({
          _id: mongoose.Types.ObjectId.createFromHexString(baseFilename),
          filename: filename
        });
      } else {
        image = await Image.create({ filename: filename });
        
        const newFilename = `${image._id}.jpg`;
        fs.renameSync(
          path.join(imageDir, filename),
          path.join(imageDir, newFilename)
        );
        
        image.filename = newFilename;
        await image.save();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to process image ${filename}:`, error.message);
      }
    }
  }
  
  console.log('Image initialization complete');
};
