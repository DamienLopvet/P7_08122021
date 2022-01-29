import React from 'react';
import deleteIcon from "../../assets/deleteIcon.png";


const DeletePost = ({ id, onDelete }) => {

  return (
    <button className="delete_button" id="delete_post_button" onClick={() => onDelete(id)}>
      <img src={deleteIcon} className="delete_icon" alt='delete'></img>
    </button>
  );
};
export default DeletePost;
