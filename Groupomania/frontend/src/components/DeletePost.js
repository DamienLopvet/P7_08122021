import React from 'react';
import { useContext } from "react";
import deleteIcon from "../assets/deleteIcon.png";
import { UserContext } from "./UserContext";


const DeletePost = ({ id, onDelete }) => {
  const { user } = useContext(UserContext);

  return (
    <button className="delete_button" id="delete_post_button" onClick={() => onDelete(id)}>
      <img src={deleteIcon} className="delete_icon"></img>
    </button>
  );
};
export default DeletePost;
