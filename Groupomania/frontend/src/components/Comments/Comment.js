import React from 'react';
import { useContext } from "react";
import DeleteComment from "./DeleteComment";
import { UserContext } from "../UserContext";
import moment from 'moment';
import localization from 'moment/locale/fr';
moment.updateLocale('fr', localization);


const Comment = ({ commentaire, id, userName, createdAt, postId , onDelete}) => {
const { user } = useContext(UserContext);


  return (
    <li key={"singleComment_"+id}>
      <div className="commentaire_user">
        {commentaire}
        <div className="comment_info">
            <div className="comment_userName">{userName}</div>
            <div className="comment_date">
        {moment(createdAt).format('dddd D MMMM YYYY à H:mm ')}</div>
            <div className="delete_comment">{(user.userName === userName || user.isAdmin)
            && <DeleteComment commentId={id} onDelete={onDelete} postId={postId} />}</div>
        
        </div> 
      </div>
    </li>
  );
};
export default Comment;
