import Router from 'next/router';
import React, { useState, Fragment, useEffect, useRef } from 'react';

export default function photo() {
  const [file, setFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState({
    src: null,
    crop: {},
    filter: null,
    filterName: '',
  });

  const fileInputRef = useRef();

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
      fileInputRef.current.value = '';
    }
    return () => {
      window.URL.revokeObjectURL(previewImage);
    };
  }, [file]);

  return (
    <>
      <label
        style={{ cursor: 'pointer' }}
        className="icon"
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
      <br />
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
    </>
  );
}
