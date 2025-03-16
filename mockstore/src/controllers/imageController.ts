import { Request, Response } from 'express';
// inside VS Code editor, there is a complaint about Express not being used -
//   but the linter doesn't show it and it works fine
import type { Express } from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Image } from '@/models/Image';

import { env } from '@/config/env';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getImageById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    res.json(image);
  } catch (error) {
    console.error('Error getting image by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const uploadImage = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const image = await Image.create({ filename: req.file.filename });
    
    const newFilename = `${image._id}.jpg`;
    
    fs.renameSync(
      path.join(process.cwd(), env.INTERNAL_FILE_DIR_NAME, req.file.filename),
      path.join(process.cwd(), env.INTERNAL_FILE_DIR_NAME, newFilename)
    );
    
    
    image.filename = newFilename;
    await image.save();

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageId: image._id,
      filename: image.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    if (req.file) {
      fs.unlinkSync(path.join(process.cwd(), env.INTERNAL_FILE_DIR_NAME, req.file.filename));
    }
    res.status(500).json({ error: 'Server error during upload' });
  }
}; 
