import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';
import ReactMarkdown from 'react-markdown';

export default function MealIngredientList({
  ingredients,
  mealId,
  createdMeal,
  isLoggedIn,
}) {
  const [ingredientArray, setIngredientArray] = useState(ingredients);
  const [title, setTitle] = useState('');
  const [editIngredients, setEditIngredients] = useState(false);

  const { doRequest: addIngredient, errors } = useRequest({
    url: '/api/ingredients',
    method: 'post',
    body: {
      title,
      mealId,
    },
    onSuccess: (event) => {
      ingredients.push(event);
      setIngredientArray(ingredients);
      setTitle('');
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();

    addIngredient();
  };

  const updateIngredients = (updatedIngredients) => {
    setIngredientArray([...updatedIngredients]);
  };

  const ingredientList = ingredientArray.map((ingredient) => {
    return (
      <MealIngredientListItem
        ingredient={ingredient}
        ingredients={ingredientArray}
        updateIngredients={updateIngredients}
        editIngredients={editIngredients}
        key={ingredient.id}
        createdMeal={createdMeal}
        isLoggedIn={isLoggedIn}
      />
    );
  });

  return (
    <>
      {createdMeal && (
        <a href="#" onClick={() => setEditIngredients(!editIngredients)}>
          {editIngredients ? 'Stop Editing Ingredients' : 'Edit Ingredients'}
        </a>
      )}
      <ul className="list-group">{ingredientList}</ul>
      {createdMeal && (
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Add Ingredient</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {errors}
          <button className="btn btn-primary">Submit</button>
        </form>
      )}
      <br />
    </>
  );
}

export function MealIngredientListItem({
  ingredient,
  ingredients,
  updateIngredients,
  editIngredients,
  isLoggedIn,
  createdMeal,
}) {
  const [addText, setAddText] = useState('add');

  const { doRequest: deleteIngredient, errors: deleteIngredientError } =
    useRequest({
      url: `/api/ingredients/${ingredient.id}`,
      method: 'delete',
      body: {},
      onSuccess: (event) => {
        var removeIndex = ingredients
          .map((ingredient) => ingredient.id)
          .indexOf(ingredient.id);
        ~removeIndex && ingredients.splice(removeIndex, 1);

        updateIngredients(ingredients);
      },
    });

  const { doRequest: decreaseIngredient, errors: decreaseIngredientError } =
    useRequest({
      url: `/api/ingredients/decrease/${ingredient.id}`,
      method: 'put',
      body: {},

      onSuccess: (event) => {
        var itemIndex = ingredients
          .map((ingredient) => ingredient.id)
          .indexOf(ingredient.id);

        var element = ingredients[itemIndex];
        ingredients.splice(itemIndex, 1);
        ingredients.splice(itemIndex - 1, 0, element);

        updateIngredients(ingredients);
      },
    });

  const { doRequest: increaseIngredient, errors: increaseIngredientError } =
    useRequest({
      url: `/api/ingredients/increase/${ingredient.id}`,
      method: 'put',
      body: {},
      onSuccess: (event) => {
        var itemIndex = ingredients
          .map((ingredient) => ingredient.id)
          .indexOf(ingredient.id);

        var element = ingredients[itemIndex];
        ingredients.splice(itemIndex, 1);
        ingredients.splice(itemIndex + 1, 0, element);

        updateIngredients(ingredients);
      },
    });

  const {
    doRequest: addIngredientToGroceryList,
    errors: addIngredientToGroceryListError,
  } = useRequest({
    url: `/api/ingredients/addIngredientToList/${ingredient.id}`,
    method: 'post',
    body: {},
    onSuccess: (event) => {
      setAddText('✓');
    },
  });

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <ReactMarkdown
        components={{
          p: React.Fragment,
        }}
      >
        {ingredient.title}
      </ReactMarkdown>
      <span>
        {createdMeal && editIngredients && (
          <>
            <span
              className="badge bg-primary rounded-pill btn"
              onClick={() => {
                decreaseIngredient();
              }}
            >
              ↑
            </span>{' '}
            <span
              className="badge bg-primary rounded-pill btn"
              onClick={() => {
                increaseIngredient();
              }}
            >
              ↓
            </span>
          </>
        )}
        {'  '}
        {isLoggedIn && (
          <span
            className="badge bg-success rounded-pill btn"
            onClick={() => {
              addIngredientToGroceryList();
            }}
          >
            {addText}
          </span>
        )}
        {'  '}
        {createdMeal && editIngredients && (
          <span
            className="badge bg-danger rounded-pill btn"
            onClick={() => {
              deleteIngredient(ingredient.id);
            }}
          >
            Delete
          </span>
        )}
      </span>
    </li>
  );
}
