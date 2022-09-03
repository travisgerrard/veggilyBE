import React from 'react';
import CommentList from '../../components/comments/commentList';

export default function Comments({ comments }) {
  return (
    <div>
      <CommentList comments={comments} />
    </div>
  );
}

Comments.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/comments');

  return { comments: data };
};
