import React from 'react';
import { useState } from "react";
import sendMessage from "../assets/sendMessage.png";
import trombone from "../assets/trombone.png";

const ModifyPost = ({ postId, onModifyPost, setShowModifyPost, error, errorMessage }) => {
  const [message, setMessage] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState(null);
  const reset = () => {
    setMessage("");
    setNewAttachmentUrl(null);
  };

  return (
    <div className="sendPost">
      <form action="" className="sendPost_form">
        <label htmlFor="message" className="sendPost_message_label">
          <textarea
            className="sendPost_message"
            type="text"
            name="message"
            id="messageToModify"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </label>
        <label htmlFor="attachmentUrl" className="sendPost_attachment_label">
          <img
            src={trombone}
            className="sendPost_attachment_icon"
            alt="send file icon"
          />
          <input
            className="sendPost_attachment"
            type="file"
            name="attachmentUrlToModify"
            id="newAttachmentUrl"
            onChange={(e) => setNewAttachmentUrl(e.target.files[0])}
          />
        </label>
        <label htmlFor="submit">
          <img
            src={sendMessage}
            className="sendPost_message_icon"
            alt="send message icon"
            onClick={() =>
              onModifyPost(
                postId,
                newAttachmentUrl,
                message,
                reset,
                setShowModifyPost
              )
            }
          />
        </label>
      </form>

    </div>
  );
};
export default ModifyPost;
