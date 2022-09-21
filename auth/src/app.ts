import express from 'express';
import 'express-async-errors';
import path from 'path';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tgticketing/common';

import { currentUserRouter } from './routes/users/current-user';
import { signinRouter } from './routes/users/signin';
import { signoutRouter } from './routes/users/signout';
import { signupRouter } from './routes/users/signup';
import { createMealRouter } from './routes/meals/new';
import { indexMealRouter } from './routes/meals';
import { updateMealRouter } from './routes/meals/update';
import { showMealRouter } from './routes/meals/show';
import { addMealToPlanRouter } from './routes/meals/addMealToPlan';
import { createIngredientRouter } from './routes/ingredients/new';
import { indexIngredientRouter } from './routes/ingredients';
import { updateIngredientRouter } from './routes/ingredients/update';
import { showIngredientRouter } from './routes/ingredients/show';
import { showIngredientsForMealRouter } from './routes/ingredients/showForMeal';
import { deleteIngredientRouter } from './routes/ingredients/delete';
import { decreaseIngredientOrderRouter } from './routes/ingredients/decreaseOrderForMeal';
import { increaseIngredientOrderRouter } from './routes/ingredients/increaseOrderForMeal';
import { addIngredientToListRouter } from './routes/ingredients/addIngredientToList';
import { indexListRouter } from './routes/lists';
import { toggleListRouter } from './routes/lists/toggle';
import { deleteListRouter } from './routes/lists/delete';
import { indexPlanRouter } from './routes/plans';
import { togglePlanRouter } from './routes/plans/toggle';
import { deletePlanRouter } from './routes/plans/delete';
import { updatePlanRouter } from './routes/plans/update';
import { createCommentRouter } from './routes/comments/new';
import { indexCommentsRouter } from './routes/comments/';
import { updateCommentRouter } from './routes/comments/update';
import { deleteCommentRouter } from './routes/comments/delete';
import { importMealRouter } from './routes/import/new';
import { generalMealRouter } from './routes/import/general';
import { showInstructionsForMealRouter } from './routes/instructions/instructionsForMeal';
import { increaseInstructionOrderRouter } from './routes/instructions/increaseInstructionForMeal';
import { decreaseInstructionOrderRouter } from './routes/instructions/decreaseInstructionForMeal';
import { createInstructionRouter } from './routes/instructions/new';
import { deleteInstructionRouter } from './routes/instructions/delete';
import { indexInstructionRouter } from './routes/instructions/';
import { addTagToMealRouter } from './routes/meals/addTagToMeal';
import { removeTagFromMealRouter } from './routes/meals/removeTagFromMeal';
import { getAllTagsRouter } from './routes/meals/getAllTags';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, //process.env.NODE_ENV !== 'test',
  })
);
app.use(express.static(path.join(__dirname, '../../my-app/out')));

app.use(currentUser);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(indexMealRouter);
app.use(createMealRouter);
app.use(updateMealRouter);
app.use(showMealRouter);
app.use(addMealToPlanRouter);
app.use(addTagToMealRouter);
app.use(removeTagFromMealRouter);
app.use(getAllTagsRouter);

app.use(addIngredientToListRouter);
app.use(indexIngredientRouter);
app.use(createIngredientRouter);
app.use(updateIngredientRouter);
app.use(showIngredientRouter);
app.use(showIngredientsForMealRouter);
app.use(deleteIngredientRouter);
app.use(decreaseIngredientOrderRouter);
app.use(increaseIngredientOrderRouter);

app.use(indexListRouter);
app.use(toggleListRouter);
app.use(deleteListRouter);

app.use(indexPlanRouter);
app.use(togglePlanRouter);
app.use(deletePlanRouter);
app.use(updatePlanRouter);

app.use(deleteCommentRouter);
app.use(createCommentRouter);
app.use(updateCommentRouter);
app.use(indexCommentsRouter);

app.use(importMealRouter);
app.use(generalMealRouter);

app.use(showInstructionsForMealRouter);
app.use(increaseInstructionOrderRouter);
app.use(decreaseInstructionOrderRouter);
app.use(createInstructionRouter);
app.use(deleteInstructionRouter);
app.use(indexInstructionRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../my-app/out/index.html'));
});

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
