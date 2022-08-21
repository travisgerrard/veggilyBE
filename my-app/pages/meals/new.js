import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import axios from 'axios';

export default function NewMeal() {
  const [title, setTitle] = useState('');
  const [whereToFind, setWhereToFind] = useState('');
  const [file, setFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState({
    src: null,
    crop: {},
    filter: null,
    filterName: '',
  });

  const fileInputRef = useRef();

  const { doRequest, errors } = useRequest({
    url: '/api/meals',
    method: 'post',
    body: {
      title,
    },
    onSuccess: () => Router.push('/'),
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
      formData.append('image', file);
      formData.set('title', title);
      formData.set('whereToFind', whereToFind);
      const post = await axios.post('/api/meals', formData, {
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
      <h2>Create a Meal</h2>
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
          <>
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
          </>
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
