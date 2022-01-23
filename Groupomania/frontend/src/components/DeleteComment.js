import React from 'react';
import { useContext } from "react";
import deleteIcon from "../assets/deleteIcon.png";
import { UserContext } from "./UserContext";


const DeleteComment = ({ commentId, onDelete, postId }) => {
    const { user } = useContext(UserContext);




  return (
    <button className="delete_button" onClick={ () => onDelete(commentId, postId)}>
      <img src={deleteIcon} className="delete_icon"></img>
    </button>
  );
};
export default DeleteComment;
