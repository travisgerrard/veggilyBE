import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError } from '@tgticketing/common';
import { Instruction } from '../../models/instruction';

const router = express.Router();

router.get(
  '/api/instructions/meal/:id',
  async (req: Request, res: Response) => {
    const instructions = await Instruction.find({ meal: req.params.id }).sort(
      'orderNumber'
    );

    if (!instructions) {
      throw new NotFoundError();
    }

    res.send(instructions);
  }
);

export { router as showInstructionsForMealRouter };
