import React  from 'react';
import { useState, useContext } from "react";
import Comments from "./Comments";
import commentIcon from "../assets/commentIcon.png";
import { UserContext } from "./UserContext";
import DeletePost from "./DeletePost";
import editIcon from "../assets/editIcon.png";
import ModifyPost from "./ModifyPost";
import moment from 'moment';
import localization from 'moment/locale/fr';
moment.updateLocale('fr', localization);



const Post = ({
  post,
  onDelete,
  onModifyPost,
  onDeleteComment,
  onAddComment,
}) => {
  const { user } = useContext(UserContext);

  const [showComment, setShowComment] = useState(false);
  const [showModifyPost, setShowModifyPost] = useState(false);
  const resetShowModifyPost = () => {
    setShowModifyPost(false);
  };
moment.locale('fr')

  return (
    <li key={post.id} className="messageList_card">
      <div className="messagList_date">
        {moment(post.createdAt).format('dddd D MMMM YYYY à H:mm ')}
        {(post.user.userName === user.userName || user.isAdmin) && (
          <>
            <DeletePost key={post.id} id={post.id} onDelete={onDelete} />
            <img
              src={editIcon}
              alt="edit post"
              className="editIcon"
              onClick={(e) => setShowModifyPost(!showModifyPost)}
            ></img>
            {showModifyPost && (
              <ModifyPost
                key={post.id}
                postId={post.id}
                onModifyPost={onModifyPost}
                setShowModifyPost={resetShowModifyPost}
                
              />
            )}
          </>
        )}
      </div>

      <p className="messageList_userName">{post.user.userName}</p>
      {post.attachmentUrl ? (
        post.attachmentUrl.split(".", 3)[2] === "mp4" ? (
          <div>
            <video controls autoPlay muted className="messageList_attachment">
              <source src={post.attachmentUrl} type="video/mp4"></source>
            </video>
          </div>
        ) : (
          <div>
            <img
              src={post.attachmentUrl}
              alt="post"
              className="messageList_attachment"
            ></img>
          </div>
        )
      ) : (
        ""
      )}
      {post.message.length > 0 && (
        <p className="messageList_message">{post.message}</p>
      )}

      <div className="message_list_option">
        <img
          src={commentIcon}
          alt="commentaires"
          id="commentIcon"
          onClick={(e) => setShowComment(!showComment)}
        ></img>
        {showComment && (
          <Comments
            comments={post.comments}
            onAdd={onAddComment}
            postId={post.id}
            onDelete={onDeleteComment}
          />
        )}
      </div>
    </li>
  );
};
export default Post;
