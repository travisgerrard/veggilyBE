import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
// import { IngredientCreatedPublisher } from '../events/publishers/ingredient-created-publisher';
import { Ingredient } from '../../models/ingredient';
import { Meal } from '../../models/meal';
// import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/ingredients',
  requireAuth,
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, ingredientType, imageUrl, mealId } = req.body;

    // If meal is associated with an ingredient, find the meal it is associated with
    let meal: any;
    let orderNumber = 0;
    if (mealId) {
      meal = await Meal.findById(mealId);

      orderNumber = (await Ingredient.find({ meal: mealId })).length;

      // if (!meal) {
      //   throw new NotFoundError();
      // }
    }

    // buld ingrednet and save to the database
    const ingredient = Ingredient.build({
      title,
      ingredientType,
      imageUrl,
      creatorId: req.currentUser!.id,
      orderNumber,
      meal,
    });
    await ingredient.save();

    // new IngredientCreatedPublisher(natsWrapper.client).publish({
    //   id: ingredient.id,
    //   version: ingredient.version,
    //   title: ingredient.title,
    //   meal: ingredient.meal?.id,
    //   ingredientType: ingredient.ingredientType,
    // });

    res.status(201).send(ingredient);
  }
);

export { router as createIngredientRouter };
