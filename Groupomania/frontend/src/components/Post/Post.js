import React from "react";
import { useState, useContext } from "react";
import Comments from "../Comments/Comments";
import commentIcon from "../../assets/commentIcon.png";
import { UserContext } from "../UserContext";
import DeletePost from "./DeletePost";
import editIcon from "../../assets/editIcon.png";
import ModifyPost from "./ModifyPost";
import moment from "moment";
import localization from "moment/locale/fr";
moment.updateLocale("fr", localization);

const Post = ({
  post,
  onDelete,
  onModifyPost,
  onDeleteComment,
  onAddComment,
  modifyPostError,
  setModifyPostError,
  modifyPostErrorMessage,
  setCommentError,
  commentError,
  commentErrorMessage,
}) => {
  const { user } = useContext(UserContext);

  const [showComment, setShowComment] = useState(false);
  const [showModifyPost, setShowModifyPost] = useState(false);
 
  const resetShowModifyPost = () => {
    setShowModifyPost(false);
  };
  moment.locale("fr");

  return (
    <li key={"singlePost_" + post.id} className="messageList_card">
      <div className="messagList_date">
        {moment(post.createdAt).format("dddd D MMMM YYYY à H:mm ")}
        {(post.user.userName === user.userName || user.isAdmin) && (
          <>
            <DeletePost
              key={"delete_" + post.id}
              id={post.id}
              onDelete={onDelete}
            />
            <input
            type="image"
              src={editIcon}
              alt="edit post"
              className="editIcon"
              onClick={(e) => setShowModifyPost(!showModifyPost)}
              tabIndex="0"
            ></input>
            {showModifyPost && (
              <ModifyPost
                key={"modify_" + post.id}
                postId={post.id}
                onModifyPost={onModifyPost}
                setShowModifyPost={resetShowModifyPost}
                modifyPostError={modifyPostError}
                modifyPostErrorMessage={modifyPostErrorMessage}
                setModifyPostError={setModifyPostError}
              />
            )}
            {post.moderated && <p className="moderated"><i>Message moderé par l'admin</i></p>}
          </>
        )}
      </div>

      <p className="messageList_userName">{post.user.userName}</p>
      {post.attachmentUrl ? (<>
        {post.attachmentUrl.split(".").pop() === "mp4" &&
        <div>
            <video controls autoPlay muted className="messageList_attachment">
              <source src={post.attachmentUrl} type="video/mp4"></source>
            </video>
          </div>}
          {post.attachmentUrl.split(".").pop() === "jpg" &&        
          <div>
            <img
              src={post.attachmentUrl}
              alt="post"
              className="messageList_attachment"
            ></img>
          </div>}
          {post.attachmentUrl.split(".").pop() === "png" &&        
          <div>
            <img
              src={post.attachmentUrl}
              alt="post"
              className="messageList_attachment"
            ></img>
          </div>}
          {post.attachmentUrl.split(".").pop() === "gif" &&        
          <div>
            <img
              src={post.attachmentUrl}
              alt="post"
              className="messageList_attachment"
            ></img>
          </div>}
          {post.attachmentUrl.split(".").pop() === "mp3" &&
          <figure>
          <figcaption>Audio</figcaption>
          <audio
              controls
              src={post.attachmentUrl}>
                  Your browser does not support the
                  <code>audio</code> element.
          </audio>
      </figure>

          }
          {post.attachmentUrl.split(".").pop() === "m4a" &&
          <figure>
          <figcaption>Audio</figcaption>
          <audio
              controls
              src={post.attachmentUrl}>
                  Your browser does not support the
                  <code>audio</code> element.
          </audio>
      </figure>

          }
        
      </>
      ) : (
        ""
      )}
      {post.message.length > 0 && (
        <p className="messageList_message">{post.message}</p>
      )}

      <div className="message_list_option">
        <input
        type="image"
          src={commentIcon}
          alt="commentaires"
          id="commentIcon"
          onClick={(e) => setShowComment(!showComment)}
          tabIndex="0"
        ></input>{!showComment && <p className="success" id="commentsLenght">{post.comments.length}</p>}
        {showComment && (
          <Comments
            comments={post.comments}
            onAdd={onAddComment}
            postId={post.id}
            onDelete={onDeleteComment}
            setCommentError={setCommentError}
            commentError={commentError}
            commentErrorMessage={commentErrorMessage}
          />
        )}
      </div>
    </li>
  );
};
export default Post;
