import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';
import ReactMarkdown from 'react-markdown';

export default function GroceryIngredientList({ groceryList }) {
  const [listIdToToggle, setListIdToToggle] = useState('');
  const [listIdToDelete, setListIdToDelete] = useState('');

  const { doRequest: deleteList, errors: deleteListError } = useRequest({
    url: `/api/lists/${listIdToDelete}`,
    method: 'delete',
    body: {},
    onSuccess: (event) => {
      var removeIndex = groceryList
        .map((ingredient) => ingredient.id)
        .indexOf(listIdToDelete);
      ~removeIndex && groceryList.splice(removeIndex, 1);

      setListIdToDelete('');
    },
  });

  const { doRequest: toggleList, errors: toggleListError } = useRequest({
    url: `/api/lists/${listIdToToggle}`,
    method: 'put',
    body: {},
    onSuccess: (event) => {
      groceryList
        .map((ingredient) => {
          if (ingredient.id == listIdToToggle) {
            ingredient.isCompleted = !ingredient.isCompleted;
          }
        })
        .indexOf(listIdToToggle);

      setListIdToToggle('');
    },
  });

  useEffect(() => {
    if (listIdToToggle !== '') {
      toggleList();
    }
  }, [listIdToToggle]);

  useEffect(() => {
    if (listIdToDelete !== '') {
      deleteList();
    }
  }, [listIdToDelete]);

  const list = groceryList.map((ingredient) => {
    return (
      <li
        key={ingredient.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>
          <input
            className="form-check-input me-1"
            type="checkbox"
            style={{
              transform: 'scale(2)',
              marginLeft: '1px',
              marginRight: '10px',
            }}
            checked={ingredient.isCompleted}
            onChange={() => {
              setListIdToToggle(ingredient.id);
            }}
          />
          <span
            style={{
              marginLeft: '40px',
              marginRight: '10px',
            }}
          >
            <ReactMarkdown>{ingredient.title}</ReactMarkdown>
          </span>
        </span>

        <span
          className="badge btn-outline-danger btn"
          style={{
            transform: 'scale(1.5)',
          }}
          onClick={() => {
            setListIdToDelete(ingredient.id);
          }}
        >
          Delete
        </span>
      </li>
    );
  });

  return (
    <>
      {list.length ? (
        <ul className="list-group">{list}</ul>
      ) : (
        <p>No groceries are on this grocery list currently</p>
      )}
    </>
  );
}
