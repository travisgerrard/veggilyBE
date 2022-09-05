import React, { useEffect, useState, useRef } from 'react';
import useRequest from '../../hooks/use-request';
import axios from 'axios';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function CommentList({ comments }) {
  const [commentsArray, setCommentsArray] = useState(comments);

  const commentList = comments.map((commentItem) => {
    return (
      <CommentListItem
        comment={commentItem}
        key={commentItem.id}
        comments={commentsArray}
      />
    );
  });

  return <div className="list-group">{commentList}</div>;
}

export function CommentListItem({ comment: commentItem, comments }) {
  const [commentTime, setCommentTime] = useState(commentItem.dateMade);

  const [commentText, setCommentText] = useState(commentItem.comment);

  console.log(commentItem);

  return (
    <div
      className="list-group-item list-group-item-action"
      key={commentItem.id}
    >
      <div className="d-flex w-100 justify-content-between">
        <div>
          <p className="mb-1">{new Date(commentTime).toLocaleString()}</p>
        </div>
        <small
        // className="bg-primary rounded-pill btn"
        // style={{ color: 'white' }}
        >
          {commentItem.meal && (
            <Link href="/meals/[mealdId]" as={`/meals/${commentItem.meal.id}`}>
              {commentItem.meal.title}
            </Link>
          )}
        </small>
      </div>

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
          <ReactMarkdown>{commentText}</ReactMarkdown>
        </h5>
      </div>
    </div>
  );
}
