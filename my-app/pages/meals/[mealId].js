import React, { useEffect, useState } from 'react';
import MealCommentList from '../../components/meals/mealCommentList';
import MealIngredientList from '../../components/meals/mealIngredientList';
import useRequest from '../../hooks/use-request';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InstructionListItem } from '../../components/meals/instructionListItem';

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

  const [tags, setTags] = useState(meal.tags);
  const [tagText, setTagText] = useState();
  const [tagToDelete, setTagToDelete] = useState('');

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

  const { doRequest: addTag, errors: addTagErrors } = useRequest({
    url: `/api/meals/${meal.id}/addTag`,
    method: 'put',
    body: {
      tag: tagText,
    },
    onSuccess: (event) => {
      setTags(event);
      setTagText('');
    },
  });

  const { doRequest: removeTag, errors: removeTagErrors } = useRequest({
    url: `/api/meals/${meal.id}/removeTag`,
    method: 'put',
    body: {
      tag: tagToDelete,
    },
    onSuccess: (event) => {
      setTags(event);
      setTagToDelete('');
    },
  });

  useEffect(() => {
    if (tagToDelete !== '') {
      removeTag();
    }
  }, [tagToDelete]);

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
            key={instruction.id}
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
      <h1>{meal.title}</h1>
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
      {createdMeal && (
        <>
          <div className="input-group">
            <button
              className={'btn btn-outline-secondary'}
              type="button"
              onClick={() => {
                addTag();
              }}
            >
              Add Tag
            </button>
            <input
              type="text"
              className="form-control"
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
            />
          </div>
          {addTagErrors}
          {spacer}
          <div className="d-flex w-100">
            {tags.map((tag) => (
              <h5 key={tag}>
                <span
                  className="badge bg-info"
                  style={{ color: 'white', marginRight: '5px' }}
                  key={tag}
                >
                  {tag}
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    aria-label="Close"
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      setTagToDelete(tag);
                    }}
                  >
                    x
                  </button>
                </span>
              </h5>
            ))}
          </div>
        </>
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
