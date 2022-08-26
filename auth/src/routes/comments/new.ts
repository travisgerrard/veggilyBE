import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@tgticketing/common';
import express, { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
const multer = require('multer');
const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');
const fs = require('fs');

import { check } from 'express-validator';
import { Comment } from '../../models/comment';
import { formatCloudinaryUrl } from '../meals/new';

const router = express.Router();

interface MulterRequest extends Request {
  file: any;
}

router.post(
  '/api/comments',
  requireAuth,
  upload,
  [
    check('comment').not().isEmpty().withMessage('Comment is required'),
    check('dateMade').not().isEmpty().withMessage('date is required'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { comment, imageUrl, thumbnail, mealId, dateMade } = req.body;

    if (!mealId) {
      throw new BadRequestError('Needs to be attahced to a meal');
    }

    if (!(req as MulterRequest).file) {
      // buld comment and save to the database
      const newComment = Comment.build({
        comment,
        imageUrl,
        thumbnail,
        creatorId: req.currentUser!.id,
        dateMade,
        meal: mealId,
      });
      await newComment.save();

      return res.status(201).send(newComment);
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      const response = await cloudinary.uploader.upload(
        (req as MulterRequest).file.path
      );
      console.log(response);
      const thumbnailUrl = formatCloudinaryUrl(
        response.secure_url,
        {
          width: 400,
          height: 400,
        },
        true
      );
      console.log(thumbnailUrl);
      fs.unlinkSync((req as MulterRequest).file.path);

      // buld comment and save to the database
      const newComment = Comment.build({
        comment,
        imageUrl: response.secure_url,
        thumbnail: thumbnailUrl,
        creatorId: req.currentUser!.id,
        dateMade,
        meal: mealId,
      });
      await newComment.save();

      return res.status(201).send(newComment);
    } catch (error) {
      return next({
        message: 'Error uploading image, please try again later.',
      });
    }
  }
);

export { router as createCommentRouter };
