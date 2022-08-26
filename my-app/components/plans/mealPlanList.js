import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';
import GroceryIngredientList from '../lists/groceryIngredientList';

export default function MealPlanList({ planList }) {
  const [planIdToToggle, setListIdToToggle] = useState('');
  const [planIdToDelete, setListIdToDelete] = useState('');

  const { doRequest: deleteList, errors: deleteListError } = useRequest({
    url: `/api/plans/${planIdToDelete}`,
    method: 'delete',
    body: {},
    onSuccess: (event) => {
      var removeIndex = planList.map((meal) => meal.id).indexOf(planIdToDelete);
      ~removeIndex && planList.splice(removeIndex, 1);

      setListIdToDelete('');
    },
  });

  const { doRequest: toggleList, errors: toggleListError } = useRequest({
    url: `/api/plans/toggle/${planIdToToggle}`,
    method: 'put',
    body: {},
    onSuccess: (event) => {
      planList
        .map((meal) => {
          if (meal.id == planIdToToggle) {
            meal.isCompleted = !meal.isCompleted;
          }
        })
        .indexOf(planIdToToggle);

      setListIdToToggle('');
    },
  });

  useEffect(() => {
    if (planIdToToggle !== '') {
      toggleList();
    }
  }, [planIdToToggle]);

  useEffect(() => {
    if (planIdToDelete !== '') {
      deleteList();
    }
  }, [planIdToDelete]);

  const plan = planList.map((meal) => {
    return (
      <div key={meal.id}>
        {meal.meal && (
          <li
            key={meal.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <input
                className="form-check-input me-1"
                style={{
                  transform: 'scale(2)',
                  marginLeft: '10px',
                  marginRight: '10px',
                }}
                type="checkbox"
                checked={meal.isCompleted}
                onChange={() => {
                  setListIdToToggle(meal.id);
                }}
              />
              {meal.meal.thumbnail && (
                <img
                  src={meal.meal.thumbnail}
                  alt="Preview"
                  style={{
                    width: '9rem',
                    height: '6rem',
                    objectFit: 'cover',
                    marginLeft: '40px',
                    marginRight: '10px',
                  }}
                />
              )}
              <Link
                href="/meals/[mealdId]"
                as={`/meals/${meal.meal.id}`}
                style={{ marginLeft: '50px' }}
              >
                {meal.meal.title}
              </Link>
            </span>

            <span
              className="badge bg-danger btn"
              style={{
                transform: 'scale(1.5)',
                color: 'white',
              }}
              onClick={() => {
                setListIdToDelete(meal.id);
              }}
            >
              Delete
            </span>
          </li>
        )}
        {meal.ingredients?.length > 0 && (
          <div style={{ paddingLeft: '25px' }}>
            <GroceryIngredientList groceryList={meal.ingredients} />
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <ul className="list-group">{plan}</ul>
    </>
  );
}
