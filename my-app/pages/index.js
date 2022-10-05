import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import PlanShow from './plans/index';

const LandingPage = ({ currentUser, meals, plans, tags }) => {
  const [mealsToList, setMealsToList] = useState(meals);
  const [isShowingFilteredList, setisShowingFilteredList] = useState(undefined);
  const [suggestions, setSuggestions] = useState('');

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = (value) => {
    console.log(value);
    setMealsToList(
      meals.filter(function (el) {
        return el.title.toLowerCase().includes(value.toLowerCase());
      })
    );
    console.log(mealsToList);
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  const mealList = mealsToList.map((meal) => {
    return (
      <Link key={meal.id} href={`/meals/${meal.id}`}>
        <tr>
          <td>
            {meal.thumbnail ? (
              <img
                src={meal.thumbnail}
                alt="Preview"
                style={{
                  width: '9rem',
                  height: '6rem',
                  objectFit: 'cover',
                  // marginLeft: '40px',
                  marginRight: '10px',
                }}
              />
            ) : (
              <img
                alt="No image"
                style={{
                  width: '9rem',
                  height: '6rem',
                  objectFit: 'cover',
                  // marginLeft: '40px',
                  marginRight: '10px',
                }}
              />
            )}
          </td>
          <td>
            <div className="d-flex align-items-start flex-column mb-2">
              <div className="mb-auto p-2">{meal.title}</div>
              {meal.tags && (
                <div className="d-flex w-100 p-2">
                  {meal.tags.map((tag) => (
                    <h5 key={tag}>
                      <span
                        className="badge bg-info"
                        style={{ color: 'white', marginRight: '5px' }}
                        key={tag}
                      >
                        {tag}
                      </span>
                    </h5>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      </Link>
    );
  });

  return (
    <div>
      {currentUser && <PlanShow plans={plans} />}
      <br />
      <h2>Meals</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Search by title"
        onChange={(e) => optimizedFn(e.target.value)}
      />
      {tags && (
        <div className="d-flex w-100">
          {tags.map((tag) => (
            <h5 key={tag}>
              <button
                className={
                  tag === isShowingFilteredList
                    ? 'badge bg-secondary'
                    : 'badge bg-info'
                }
                style={{ color: 'white', marginRight: '5px' }}
                key={tag}
                onClick={(e) => {
                  if (isShowingFilteredList === tag) {
                    setisShowingFilteredList(undefined);
                    setMealsToList(meals);
                  } else {
                    const filteredMeals = meals.filter((meal) => {
                      return meal.tags.includes(tag);
                    });
                    setMealsToList(filteredMeals);
                    setisShowingFilteredList(tag);
                  }
                }}
              >
                {tag}
              </button>
            </h5>
          ))}
        </div>
      )}
      <table className="table table-hover">
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Image</th>
            <th style={{ width: '75%' }}>Title</th>
            {/* <th scope="col">Link</th> */}
          </tr>
        </thead>
        <tbody>{mealList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/meals');
  const { data: tags } = await client.get('/api/tags');

  if (currentUser) {
    const { data: plans } = await client.get('/api/plans');
    return { meals: data, plans, tags };
  }

  return { meals: data, tags };
};

export default LandingPage;
