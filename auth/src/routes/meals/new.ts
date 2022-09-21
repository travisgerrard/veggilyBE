import { requireAuth, validateRequest } from '@tgticketing/common';
import express, { Request, Response, NextFunction } from 'express';
// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
const multer = require('multer');
const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');
const fs = require('fs');

import { check } from 'express-validator';
import { Meal } from '../../models/meal';

const router = express.Router();

export const formatCloudinaryUrl = (
  url: string,
  size: { width: number; height: number },
  thumb: Boolean
) => {
  const splitUrl = url.split('upload/');
  splitUrl[0] += `upload/w_${size.width},h_${size.height}${
    thumb && ',c_thumb'
  }/`;
  const formattedUrl = splitUrl[0] + splitUrl[1];
  return formattedUrl;
};

interface MulterRequest extends Request {
  file: any;
}

router.post(
  '/api/meals',
  requireAuth,
  upload,

  [check('title').notEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, whereToFind, imageUrl, thumbnail, mealType, tags } =
      req.body;

    if (!(req as MulterRequest).file) {
      const meal = Meal.build({
        title,
        whereToFind,
        imageUrl,
        thumbnail,
        mealType,
        creatorId: req.currentUser!.id,
        tags,
      });
      await meal.save();
      return res.status(201).send(meal);
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

      const meal = Meal.build({
        title,
        whereToFind,
        imageUrl: response.secure_url,
        thumbnail: thumbnailUrl,
        mealType,
        creatorId: req.currentUser!.id,
        tags,
      });
      await meal.save();
      console.log(meal);
      return res.status(201).send(meal);
    } catch {
      return next({
        message: 'Error uploading image, please try again later.',
      });
    }
  }
);

export { router as createMealRouter };
