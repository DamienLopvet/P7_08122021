import React from 'react';
import deleteIcon from "../../assets/deleteIcon.png";


const DeleteComment = ({ commentId, onDelete, postId }) => {
return (
    <button className="delete_button" onClick={ () => onDelete(commentId, postId)}>
      <img src={deleteIcon} className="delete_icon" alt='delete'></img>
    </button>
  );
};
export default DeleteComment;
