import React from 'react';
import Link from 'next/link';
import PlanShow from './plans/index';

const LandingPage = ({ currentUser, meals, plans }) => {
  const mealList = meals.map((meal) => {
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
                marginLeft: '40px',
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
                marginLeft: '40px',
                marginRight: '10px',
              }}
            />
          )}
        </td>
        <td>{meal.title}</td>
        <td>
          <Link href="/meals/[mealdId]" as={`/meals/${meal.id}`}>
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

  if (currentUser) {
    const { data: plans } = await client.get('/api/plans');
    return { meals: data, plans };
  }

  return { meals: data };
};

export default LandingPage;
