import Router from 'next/router';
import React, { useState } from 'react';
import useRequest from '../hooks/use-request';

export default function Import() {
  const [title, setTitle] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/import',
    method: 'post',
    body: {
      url: title,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h2>Import a meal</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>URL</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
        </div>

        <br />

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
