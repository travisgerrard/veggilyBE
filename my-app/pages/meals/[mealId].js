import React, { useState } from 'react';
import MealCommentList from '../../components/meals/mealCommentList';
import MealIngredientList from '../../components/meals/mealIngredientList';
import useRequest from '../../hooks/use-request';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MealShow({
  meal,
  ingredients,
  comments,
  instructions,
  currentUser,
}) {
  const isLoggedIn = currentUser?.id;
  const createdMeal = meal.creatorId === currentUser?.id;
  const [addMealText, setAddMealText] = useState('Add to plan');
  const [addMealStyle, setAddMealStyle] = useState('btn btn-primary');
  const [addInstruction, setAddInstruction] = useState(false);
  const [instructionToAdd, setInstructionToAdd] = useState('');

  const [instructionArray, setInstructionArray] = useState(instructions);
  const [editInstructions, setEditInstructions] = useState(false);

  const { doRequest: addMealToPlan, errors } = useRequest({
    url: `/api/meals/addMealToPlan/${meal.id}`,
    method: 'post',
    body: {},
    onSuccess: () => {
      setAddMealStyle('btn btn-success');
      setAddMealText('Meal added to plan');
    },
  });

  const {
    doRequest: addInstructionToMeal,
    errors: addInstructionToMealErrors,
  } = useRequest({
    url: `/api/instructions/`,
    method: 'post',
    body: {
      text: instructionToAdd,
      mealId: meal.id,
    },
    onSuccess: (event) => {
      instructionArray.push(event);
      setAddInstruction(false);
      setInstructionToAdd('');
    },
  });

  const spacer = (
    <div>
      <p></p>
    </div>
  );

  const updateInstructions = (updatedInstructions) => {
    setInstructionArray([...updatedInstructions]);
  };

  const instructionSection = () => (
    <>
      <span>
        <h2>Instructions</h2>
        {createdMeal && (
          <a href="#" onClick={() => setEditInstructions(!editInstructions)}>
            {editInstructions ? 'Stop Editing Instruction' : 'Edit Instruction'}
          </a>
        )}
      </span>

      {instructionArray.map((instruction, index) => {
        return (
          <InstructionListItem
            instruction={instruction}
            instructions={instructions}
            editInstructions={editInstructions}
            index={index}
            createdMeal={createdMeal}
            updateInstructions={updateInstructions}
          />
        );
      })}
      {spacer}
      {createdMeal && !addInstruction && (
        <button
          className={'btn btn-primary'}
          onClick={() => setAddInstruction(true)}
        >
          Add Instructions
        </button>
      )}
      {spacer}
      {addInstruction && (
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={instructionToAdd}
            onChange={(e) => setInstructionToAdd(e.target.value)}
          />
          <button
            className={'btn btn-outline-secondary'}
            type="button"
            onClick={() => {
              addInstructionToMeal();
            }}
          >
            Add
          </button>
          <button
            className={'btn btn-outline-secondary'}
            type="button"
            onClick={() => setAddInstruction(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {spacer}
    </>
  );

  return (
    <div>
      <h1>{meal.title} </h1>
      {spacer}

      <ReactMarkdown
        components={{
          p: React.Fragment,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {meal.whereToFind}
      </ReactMarkdown>
      {spacer}
      {createdMeal && (
        <Link href="/meals/edit/[mealdId]" as={`/meals/edit/${meal.id}`}>
          <a>Edit meal information</a>
        </Link>
      )}
      {spacer}

      {meal.thumbnail && (
        <img
          src={meal.thumbnail}
          alt="Preview"
          style={{
            width: '9rem',
            height: '6rem',
            objectFit: 'cover',
          }}
        />
      )}
      {spacer}
      {isLoggedIn && (
        <button className={addMealStyle} onClick={() => addMealToPlan()}>
          {addMealText}
        </button>
      )}
      {spacer}

      {instructionSection()}
      <h2>Ingredients</h2>
      <MealIngredientList
        ingredients={ingredients}
        mealId={meal.id}
        createdMeal={createdMeal}
        isLoggedIn={isLoggedIn}
      />
      {isLoggedIn && (
        <>
          <MealCommentList comments={comments} mealId={meal.id} />
        </>
      )}
    </div>
  );
}

MealShow.getInitialProps = async (context, client) => {
  let { mealId } = context.query;
  if (mealId === undefined) {
    mealId = '62df673f60fb315ff0bbc75e';
  }

  const { data: mealData } = await client.get(`/api/meals/${mealId}`);
  const { data: ingredientData } = await client.get(
    `/api/ingredients/meal/${mealId}`
  );
  const { data: commentData } = await client.get(
    `/api/comments/meal/${mealId}`
  );
  const { data: instructionData } = await client.get(
    `/api/instructions/meal/${mealId}`
  );
  // Make a route so we can get ingredients for a specific meal

  return {
    meal: mealData,
    ingredients: ingredientData,
    comments: commentData,
    instructions: instructionData,
  };
};

export function InstructionListItem({
  instruction,
  instructions,
  updateInstructions,
  index,
  editInstructions,
  createdMeal,
}) {
  const { doRequest: increaseInstruction, errors: increaseInstructionError } =
    useRequest({
      url: `/api/instructions/increase/${instruction.id}`,
      method: 'put',
      body: {},
      onSuccess: (event) => {
        var itemIndex = instructions
          .map((instruction) => instruction.id)
          .indexOf(instruction.id);

        var element = instructions[itemIndex];
        instructions.splice(itemIndex, 1);
        instructions.splice(itemIndex + 1, 0, element);

        updateInstructions(instructions);
      },
    });

  const { doRequest: decreaseInstruction, errors: decreaseInstructionError } =
    useRequest({
      url: `/api/instructions/decrease/${instruction.id}`,
      method: 'put',
      body: {},
      onSuccess: (event) => {
        var itemIndex = instructions
          .map((instruction) => instruction.id)
          .indexOf(instruction.id);

        var element = instructions[itemIndex];
        instructions.splice(itemIndex, 1);
        instructions.splice(itemIndex - 1, 0, element);

        updateInstructions(instructions);
      },
    });

  const { doRequest: deleteInstruction, errors: deleteInstructionError } =
    useRequest({
      url: `/api/instructions/${instruction.id}`,
      method: 'delete',
      body: {},
      onSuccess: (event) => {
        var removeIndex = instructions
          .map((instruction) => instruction.id)
          .indexOf(instruction.id);
        ~removeIndex && instructions.splice(removeIndex, 1);

        updateInstructions(instructions);
      },
    });

  return (
    <div className="d-flex w-100 justify-content-between">
      <p key={instruction.text}>
        {index + 1}. {instruction.text}
      </p>
      {createdMeal && editInstructions && (
        <div>
          <span
            className="badge bg-primary rounded-pill btn"
            onClick={() => {
              decreaseInstruction();
            }}
          >
            ↑
          </span>{' '}
          <span
            className="badge bg-primary rounded-pill btn"
            onClick={() => {
              increaseInstruction();
            }}
          >
            ↓
          </span>
          <span
            className="badge bg-danger rounded-pill btn"
            onClick={() => {
              deleteInstruction(instruction.id);
            }}
          >
            Delete
          </span>
        </div>
      )}
    </div>
  );
}
