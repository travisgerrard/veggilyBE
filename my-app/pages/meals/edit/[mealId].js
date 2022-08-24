import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import useRequest from '../../../hooks/use-request';
import axios from 'axios';

export default function EditMeal({ meal }) {
  const [title, setTitle] = useState(meal.title);
  const [whereToFind, setWhereToFind] = useState(meal.whereToFind);
  const [file, setFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState({
    src: meal.thumbnail,
    crop: {},
    filter: null,
    filterName: '',
  });

  const fileInputRef = useRef();

  const { doRequest, errors } = useRequest({
    url: `/api/meals/${meal.id}`,
    method: 'put',
    body: {
      title,
    },
    onSuccess: () => Router.push(`/meals/${meal.id}`),
  });

  useEffect(() => {
    if (file) {
      // push to new page with file
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          setPreviewImage((previous) => ({
            ...previous,
            src: event.target.result,
          }));
        };
      } else {
        // Display error
        console.log('error');
      }
      // fileInputRef.current.value = '';
    }
    return () => {
      window.URL.revokeObjectURL(previewImage);
    };
  }, [file]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      const formData = new FormData();
      // formData.append('image', file);
      formData.set('title', title);
      formData.set('whereToFind', whereToFind);
      const post = await axios.put(`/api/meals/${meal.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return post.data;
    } else {
      doRequest();
    }
  };

  return (
    <div>
      <h2>Edit "{meal.title}"</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <label>Where to find</label>
          <input
            className="form-control"
            value={whereToFind}
            onChange={(e) => setWhereToFind(e.target.value)}
          />
          <br />
          {/* <>
            <label
              style={{ cursor: 'pointer' }}
              className="btn btn-outline-primary"
              htmlFor="file-upload"
            >
              AddPhoto
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              // Get the first selected file
              onChange={(event) => setFile(event.target.files[0])}
              ref={fileInputRef}
            />
          </> */}
        </div>
        <div>
          {previewImage.src && (
            <img
              src={previewImage.src}
              alt="Preview"
              style={{
                filter: previewImage.filter,
                width: '9rem',
                height: '6rem',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
        <br />
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

EditMeal.getInitialProps = async (context, client) => {
  let { mealId } = context.query;
  if (mealId === undefined) {
    mealId = "62df673f60fb315ff0bbc75e"
  }
  console.log('mealId = ', mealId);
  const { data: mealData } = await client.get(`/api/meals/${mealId}`);

  return {
    meal: mealData,
  };
};
