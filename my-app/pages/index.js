import React, { useState } from 'react';
import Link from 'next/link';
import PlanShow from './plans/index';

const LandingPage = ({ currentUser, meals, plans, tags }) => {
  const [mealsToList, setMealsToList] = useState(meals);
  const [isShowingFilteredList, setisShowingFilteredList] = useState(undefined);

  const mealList = mealsToList.map((meal) => {
    return (
      <tr key={meal.id}>
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
        <td>
          <Link href={`/meals/${meal.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      {currentUser && <PlanShow plans={plans} />}
      <br />
      <h2>Meals</h2>
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
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Link</th>
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
