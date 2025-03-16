import express from 'express';
import { upload } from '@/middleware/multer';
import {
  getImageById,
  uploadImage
} from '@/controllers/imageController';

const router = express.Router();

router.get('/:id', getImageById);
router.post('/', upload.single('image'), uploadImage);

export default router; 
