import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Comment } from '../../models/comment';
import { Meal } from '../../models/meal';

const router = express.Router();

router.post(
  '/api/comments',
  requireAuth,
  [
    body('comment').not().isEmpty().withMessage('Comment is required'),
    body('dateMade').not().isEmpty().withMessage('date is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { comment, imageUrl, mealId, dateMade } = req.body;
    if (!mealId) {
      throw new BadRequestError('Needs to be attahced to a meal');
    }

    // buld comment and save to the database
    const newComment = Comment.build({
      comment,
      imageUrl,
      creatorId: req.currentUser!.id,
      dateMade,
      meal: mealId,
    });
    await newComment.save();

    res.status(201).send(newComment);
  }
);

export { router as createCommentRouter };
