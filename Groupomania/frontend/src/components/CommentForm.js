import React from 'react';

import { useState, useContext } from "react";
import sendCommentIcon from "../assets/sendCommentIcon.png";
import { UserContext } from "./UserContext";

const CommentForm = ({ postId, onAdd }) => {
  const { user } = useContext(UserContext);
  const [comment, setComment] = useState("");
  

  return (
    <>
      <form
        action=""
        className="send_comment"
        id="send_comment_form"
      >
        <label htmlFor="comment">
          <textarea
            type="text"
            className="send_comment_message"
            type="text"
            name="comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
        </label>{" "}
        <label htmlFor="submit" className="send_comment_submit">
          <img
            src={sendCommentIcon}
            alt="send comment icon"
            className="send_comment_submit_icon"
            onClick={()=> onAdd(postId, comment, setComment)}
          />
        </label>
      </form>{" "}

    </>
  );
};

export default CommentForm;
