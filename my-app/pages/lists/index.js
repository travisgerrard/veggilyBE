import React from 'react';
import GroceryIngredientList from '../../components/lists/groceryIngredientList';

export default function ListShow({ list }) {
  return (
    <div>
      <h1>Grocery List</h1>
      <GroceryIngredientList groceryList={list} />
    </div>
  );
}

ListShow.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/lists');
  return { list: data };
};
