import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@tgticketing/common';
import { Ingredient } from '../../models/ingredient';
import { List } from '../../models/list';
// import { natsWrapper } from '../nats-wrapper';
// import { IngredientAddedToListPublisher } from '../events/publishers/ingredient-addto-list-publisher';

const router = express.Router();

router.post(
  '/api/ingredients/addIngredientToList/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const ingredient = await Ingredient.findById(req.params.id).populate(
      'meal'
    );

    if (!ingredient) {
      throw new NotFoundError();
    }

    const list = List.build({
      title: ingredient.title,
      ingredientType: ingredient.ingredientType,
      meal: ingredient.meal?.id,
      creatorId: req.currentUser!.id,
      isCompleted: false,
    });
    await list.save();

    res.send(ingredient);
  }
);

export { router as addIngredientToListRouter };
