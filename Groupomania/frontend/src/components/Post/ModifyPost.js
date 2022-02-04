import React from 'react';
import { useState } from "react";
import sendMessage from "../../assets/sendMessage.png";
import trombone from "../../assets/trombone.png";
import deleteIcon from "../../assets/deleteIcon.png"

const ModifyPost = ({ 
  postUserId,
  postId, 
  onModifyPost, 
  setShowModifyPost, 
  modifyPostError,
  setModifyPostError,
  modifyPostErrorMessage }) => {
  const [message, setMessage] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState(null);
  const reset = () => {
    setMessage("");
    setNewAttachmentUrl(null);
    setModifyPostError(false)
  };


  return (
    <div className="sendPost white">
      <form action="" className="sendPost_form" id='modifyPostForm'>
        <label htmlFor="message" className="sendPost_message_label">
          <textarea
          placeholder='modifier le texte du Post'
            className="sendPost_message"
            type="text"
            name="message"
            id="messageToModify"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </label>
        <label htmlFor="newAttachmentUrl" className="sendPost_attachment_label">
          <img
            src={trombone}
            className="sendPost_attachment_icon"
            alt="send file icon"
          />
          <input
            className="sendPost_attachment"
            type="file"
            name="newAttachmentUrl"
            id="newAttachmentUrl"
            onChange={(e) => setNewAttachmentUrl(e.target.files[0])}
          />
        </label>
        <label htmlFor="submit">
          <input
          type="image"
            src={sendMessage}
            className="sendPost_message_icon"
            alt="send message icon"
            id='messageToModifyIcon'
            onClick={(e) =>
              {e.preventDefault(); onModifyPost(
                postId,
                newAttachmentUrl,
                message,
                reset,
                setShowModifyPost,
                
              )}
            }
          />
        </label>
      </form>
      {modifyPostError && (
        <div
          className="alert_box alert"
          onClick={() => setModifyPostError(false)}
        >
          <p>{modifyPostErrorMessage}</p>
        </div>
      )}
      {newAttachmentUrl && (
        <div className="attachment">
          <span>Pièce jointe</span>
          <img src={deleteIcon} alt="icon de suppression" className="delete_icon" onClick={() => setNewAttachmentUrl(null)} />
        </div>
      )}
    </div>
  );
};
export default ModifyPost;
