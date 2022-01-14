import axios from "axios";
import React, { useState } from "react";
import "../styles/sendPost.css";
import sendMessage from "../assets/sendMessage.png";
import trombone from "../assets/trombone.png";
import { UserContext } from "./UserContext";
import { useContext } from "react";


function SendPost() {
  const [message, setMessage] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const user = useContext(UserContext);
 
const fetchPost =(e)=> {
    e.preventDefault();
    
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/messages`,
      withCredentials: false,
      data: {
        message,
        attachmentUrl,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          // messageError.innerHTML = res.data.error.message;
          // attachmentUrlError.innerHTML = res.data.error.attachmentUrl;
        } else {
          console.log("post sended");
          setMessage("");
          setAttachmentUrl("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return user.isLogged ? (<div className="sendPost">
      <form action="" onSubmit={fetchPost} className="sendPost_form">
        <label htmlFor="message" className="sendPost_message_label">
          <textarea
            className="sendPost_message"
            type="text"
            name="message"
            id="message"
            onChange={(e) => setMessage(e.target.value) }
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
            onChange={(e) => setAttachmentUrl(e.target.value)}
            value={attachmentUrl}
          />
        </label>
        <label htmlFor="submit">
          <img
            src={sendMessage}
            className="sendPost_message_icon"
            alt="send message icon"
            onClick={fetchPost}
          />
          <input
            type="submit"
            id="submit"
            value="envoyé un message"
            className="sendPost_button"
          />
        </label>
      </form>
    </div>
  ):("")
}

export default SendPost;
