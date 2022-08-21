import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Instruction } from '../../models/instruction';
import { Meal } from '../../models/meal';

const router = express.Router();

router.post(
  '/api/instructions',
  requireAuth,
  [body('text').not().isEmpty().withMessage('Cannot be blank')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { text, bold, mealId } = req.body;

    // If meal is associated with an ingredient, find the meal it is associated with
    let meal: any;
    let orderNumber = 0;
    if (mealId) {
      meal = await Meal.findById(mealId);

      orderNumber = (await Instruction.find({ meal: mealId })).length;

      // if (!meal) {
      //   throw new NotFoundError();
      // }
    }

    // buld ingrednet and save to the database
    const instruction = Instruction.build({
      text,
      bold,
      creatorId: req.currentUser!.id,
      orderNumber,
      meal,
    });
    await instruction.save();

    res.status(201).send(instruction);
  }
);

export { router as createInstructionRouter };
