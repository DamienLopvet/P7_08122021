import React from 'react';

import Comment from "./Comment";
import CommentForm from "./CommentForm";


const Comments = ({comments, postId, onDelete, onAdd }) => {
  return (
    <>
      {comments.length > 0 && (
        <ul className="messageList_comment" id="messageList_comment">
        {comments.map((e) => (
            <Comment
              key={e.id}
              commentaire={e.commentaire}
              id={e.id}
              userName={e.user.userName}
              createdAt={e.createdAt}
              postId={postId}
              onDelete={onDelete}
              
            />
          ))}
        </ul>
      )} {comments.length === 0 && <div className="messageList_comment" id="messageList_comment">Soyez le premier à laisser un commentaire !!  </div>
    }  
        <CommentForm 
        postId={postId} 
        onAdd={onAdd}
        
        />

    </>
  );
};
export default Comments;
