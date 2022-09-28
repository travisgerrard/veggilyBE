import React, { useState } from 'react';
import Router, { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

export default function signin({ prevPath }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(prevPath);

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push(prevPath),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-group"
      >
        <label>Password</label>
        <input type="password" className="form-control" />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
}
