import React from "react";

import { useState } from "react";
import sendCommentIcon from "../../assets/sendCommentIcon.png";

const CommentForm = ({
  postId,
  onAdd,
  commentError,
  setCommentError,
  commentErrorMessage,
}) => {
  const [comment, setComment] = useState("");
  const reset = () => {
    setComment("");
  };
  return (
    <>
      <form action="" className="send_comment" id="send_comment_form">
        <label htmlFor="comment">
          <textarea
            className="send_comment_message"
            type="text"
            name="comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
        </label>
        <label htmlFor="submit" className="send_comment_submit">
          <input
            type="image"
            src={sendCommentIcon}
            alt="send comment icon"
            className="send_comment_submit_icon"
            onClick={(e) => {
              e.preventDefault();
              onAdd(postId, comment, reset);
            }}
          />
        </label>
      </form>
      {commentError && (
        <div className="alert_box alert" onClick={() => setCommentError(false)}>
          <p>{commentErrorMessage}</p>
        </div>
      )}
    </>
  );
};

export default CommentForm;
