import React, { useState } from "react";
import "../styles/sendPost.css";
import sendMessage from "../assets/sendMessage.png";
import trombone from "../assets/trombone.png";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import deleteIcon from "../assets/deleteIcon.png";

function PostForm({ onAdd }) {
  const [message, setMessage] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const { user } = useContext(UserContext);
  const reset = () => {
    setMessage("");
    setAttachmentUrl(null);
  };
  
  return user.isLogged ? (
    <div className="sendPost">
      
      <form action="" className="sendPost_form">
        <label htmlFor="message" className="sendPost_message_label">
          <textarea
            className="sendPost_message"
            type="text"
            name="message"
            id="message"
            placeholder="Que voulez-vous dire ?"
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
            name="attachmentUrl"
            id="attachmentUrl"
            onChange={(e) => setAttachmentUrl(e.target.files[0])}
          />
        </label>
        <label htmlFor="submit">
          <img
            src={sendMessage}
            className="sendPost_message_icon"
            alt="send message icon"
            onClick={() => onAdd(attachmentUrl, message, reset)}
          />
        </label>
      </form>
      {attachmentUrl && (
        <div className="attachment">
          <img src={attachmentUrl.name} alt="attachment" />
          <img src={deleteIcon} alt="icon de suppression" className="delete_icon" onClick={() => setAttachmentUrl(null)} />
        </div>
      )}
    </div>
  ) : (
    ""
  );
}

export default PostForm;
