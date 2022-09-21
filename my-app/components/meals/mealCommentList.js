import React, { useEffect, useState, useRef } from 'react';
import useRequest from '../../hooks/use-request';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function MealCommentList({ comments, mealId }) {
  const [comment, setComment] = useState('');
  const [commentsArray, setCommentsArray] = useState(comments);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddCommentPrompt, setShowAddCommentPrompt] = useState(false);

  const [file, setFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState({
    src: null,
    crop: {},
    filter: null,
    filterName: '',
  });

  const fileInputRef = useRef();

  const { doRequest: addComment, errors } = useRequest({
    url: '/api/comments',
    method: 'post',
    body: {
      comment,
      mealId,
      dateMade: new Date(),
    },
    onSuccess: (event) => {
      comments.unshift(event);
      setCommentsArray(comments);
      setComment('');
      setIsUploading(false);
    },
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
    } else {
      fileInputRef.current.value = '';
    }
    return () => {
      window.URL.revokeObjectURL(previewImage);
    };
  }, [file]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      formData.set('comment', comment);
      formData.set('mealId', mealId);
      formData.set('dateMade', new Date());

      try {
        const post = await axios.post('/api/comments', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        comments.unshift(post.data);
        setCommentsArray(comments);
        setComment('');
        fileInputRef.current.value = '';
        setFile(undefined);
        setPreviewImage({
          src: null,
          crop: {},
          filter: null,
          filterName: '',
        });
        setIsUploading(false);
      } catch (error) {
        console.log(error);
        setIsUploading(false);
      }
    } else {
      addComment();
      setIsUploading(false);
    }
  };

  const updateComments = (updatedComments) => {
    setCommentsArray([...updatedComments]);
  };

  const commentList = comments.map((commentItem) => {
    return (
      <CommentListItem
        comment={commentItem}
        key={commentItem.id}
        comments={commentsArray}
        updateComments={updateComments}
      />
    );
  });

  const addComentForm = (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Add Comment</label>
        <input
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
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
      {isUploading ? (
        <button
          className="btn btn-primary"
          type="button"
          disabled
          style={{ marginBottom: '25px' }}
        >
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Uploading...</span>
        </button>
      ) : (
        <div className="d-flex w-100 justify-content-between">
          <button className="btn btn-primary" style={{ marginBottom: '25px' }}>
            Submit
          </button>
          <button
            className="btn btn-danger"
            style={{ marginBottom: '25px' }}
            onClick={() => {
              setShowAddCommentPrompt(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );

  const addCommentButton = (
    <>
      <button
        className="btn btn-primary"
        onClick={() => {
          setShowAddCommentPrompt(true);
        }}
      >
        Add Comment
      </button>
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
  );

  return (
    <>
      <div className="d-flex w-100 justify-content-between">
        <h2>Comments</h2>
        {!showAddCommentPrompt && addCommentButton}
      </div>
      <hr />
      {showAddCommentPrompt && addComentForm}
      <div className="list-group">{commentList}</div>
    </>
  );
}

export function CommentListItem({
  comment: commentItem,
  comments,
  updateComments,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentTime, setCommentTime] = useState(commentItem.dateMade);
  const [editedCommentTime, setEditedCommentTime] = useState(
    commentItem.dateMade
  );
  const [commentText, setCommentText] = useState(commentItem.comment);
  const [editedCommentText, setEditedCommentText] = useState(
    commentItem.comment
  );

  const { doRequest: deleteComment, errors: deleteCommentError } = useRequest({
    url: `/api/comments/${commentItem.id}`,
    method: 'delete',
    body: {},
    onSuccess: (event) => {
      var removeIndex = comments
        .map((commentItem) => commentItem.id)
        .indexOf(commentItem.id);
      ~removeIndex && comments.splice(removeIndex, 1);

      updateComments(comments);
    },
  });

  const { doRequest: updateComment, errors: updateCommentError } = useRequest({
    url: `/api/comments/${commentItem.id}`,
    method: 'put',
    body: {
      comment: editedCommentText,
      dateMade: editedCommentTime,
    },
    onSuccess: (event) => {
      console.log(event);
      setIsEditing(false);
    },
  });

  return (
    <div
      className="list-group-item list-group-item-action"
      key={commentItem.id}
    >
      <div className="d-flex w-100 justify-content-between">
        {isEditing ? (
          <input
            type="datetime-local"
            id="datetime-local"
            value={editedCommentTime}
            onChange={(e) => setEditedCommentTime(e.target.value)}
          />
        ) : (
          <>
            <p className="mb-1">{new Date(commentTime).toLocaleString()}</p>
          </>
        )}
        {isEditing ? (
          <span>
            <small
              className="bg-success rounded-pill btn"
              style={{ color: 'white' }}
              onClick={() => {
                // save editing variables
                setCommentText(editedCommentText);
                setCommentTime(editedCommentTime);
                updateComment(commentItem.id);
              }}
            >
              Save
            </small>{' '}
            <small
              className="bg-danger rounded-pill btn"
              style={{ color: 'white' }}
              onClick={() => {
                deleteComment(commentItem.id);
              }}
            >
              Delete
            </small>{' '}
            <small
              className="bg-primary rounded-pill btn"
              style={{ color: 'white' }}
              onClick={() => {
                // Reset editing variables
                setEditedCommentText(commentText);
                setEditedCommentTime(commentTime);
                setIsEditing(false);
              }}
            >
              Cancel
            </small>
          </span>
        ) : (
          <small
            className="bg-primary rounded-pill btn"
            style={{ color: 'white' }}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </small>
        )}
        {/* <small>3 days ago</small> */}
      </div>
      {isEditing ? (
        <div className="input-group" style={{ marginTop: '15px' }}>
          <input
            className="form-control"
            type="text"
            name=""
            id=""
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
          />
        </div>
      ) : (
        <div className="d-flex w-100">
          {commentItem.thumbnail && (
            <img
              src={commentItem.thumbnail}
              alt="Preview"
              style={{
                width: '9rem',
                height: '6rem',
                objectFit: 'cover',
                marginRight: '10px',
              }}
            />
          )}
          <h5 className="mb-1 align-self-center">
            <ReactMarkdown
              components={{
                p: React.Fragment,
              }}
            >
              {commentText}
            </ReactMarkdown>
          </h5>
        </div>
      )}
    </div>
  );
}
