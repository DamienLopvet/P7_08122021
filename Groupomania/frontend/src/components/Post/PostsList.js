import "../../styles/index.css";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import Post from "./Post";
import PostForm from "./PostForm";

function PostsList({ userName }) {
  const [data, setData] = useState([]);
  const { user } = useContext(UserContext);
  const [noPost, setNoPost] = useState(false);
  const [searchAndAddPostError, setSearchAndAddPostError] = useState(false);
  const [searchAndAddPostErrorMessage, setSearchAndAddPostErrorMessage] =
    useState("");
  const [modifyPostError, setModifyPostError] = useState("");
  const [modifyPostErrorMessage, setModifyPostErrorMessage] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentErrorMessage, setCommentErrorMessage] = useState("");

  useEffect(() => {
    if (user.isLogged) {
    async function fetchData() {
        axios({
          headers: {
            Authorization: "Bearer " + user.token,
          },
          method: "get",
          url: `${process.env.REACT_APP_API_URL}api/messages/${userName}`,
          withCredentials: false,
          data: {},
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.length === 0) {
              setNoPost(true);
            } else {
              setNoPost(false);
              setSearchAndAddPostError("");
            }
            setData(res.data);
           
          })
          .catch((err) => {
            console.log(err.response.status);
            console.log(err.response.data); // 401
            if (err.response.status === 401) {
              setSearchAndAddPostError(true);
              setSearchAndAddPostErrorMessage(err.response.data.message);
            } else if (err.response.status === 400) {
              setSearchAndAddPostError(true);
              setSearchAndAddPostErrorMessage(err.response.data.message);
            } else if (err.response.status === 429) {
              setSearchAndAddPostError(true);
              setSearchAndAddPostErrorMessage(err.response.data.message);
            }
          });
      };
      fetchData();
      if (userName.length === 0) {
        setSearchAndAddPostError(false);
      }
      //et id = setInterval(() => {
      //  fetchData();
      //}, 2000);
      //fetchData();
      //
      //if(userName){
      // clearInterval(id)
      //
      //}
    }
  }, [user, userName]);

  const handleAddPost = ( attachmentUrl, message, reset) => {
    
    const formData = new FormData();
    formData.append("attachmentUrl", attachmentUrl);
    formData.append("message", message);
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/messages`,
      withCredentials: false,
      data: formData,
    })
      .then((res) => {
        console.log(res);
        console.log("post sended");
        let data_ = [...data];
        data_.unshift({
          ...res.data.post,
          user: { id: user.id, userName: user.userName },
          comments: [],
        });
        setData(data_);
        reset();
        setSearchAndAddPostError(false);
      })
      .catch((err) => {
        console.log(err.response.status);
        console.log(err.response.data.message);

        if (err.response.status === 401) {
          setSearchAndAddPostError(true);
          setSearchAndAddPostErrorMessage(err.response.data.message);
        } else if (err.response.status === 400) {
          setSearchAndAddPostError(true);
          setSearchAndAddPostErrorMessage(err.response.data.message);
        } else if (err.response.status === 429) {
          setSearchAndAddPostError(true);
          setSearchAndAddPostErrorMessage(err.response.data.message);
        } else if (err.response.status === 500) {
          setSearchAndAddPostError(true);
          setSearchAndAddPostErrorMessage("Une erreure serveur est survenue");
        }
      });
  };
  const handleDeletePost = (id) => {
    //const confirm = window.confirm(
    //  "etes vous sûr de vouloir supprimer ce Post?"
    //);
    // if (confirm) {
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/messages/${id}`,
      withCredentials: false,
    })
      .then((res) => {
        console.log(res);
        let data_ = [...data].filter((e) => e.id !== id);
        setData(data_);
        console.log("post Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };
  const handleModifyPost = (
    postId,
    newAttachmentUrl,
    message,
    reset,
    resetShowModifyPost
  ) => {
    const formData = new FormData();
    formData.append("attachmentUrl", newAttachmentUrl);
    formData.append("message", message);
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/messages/${postId}`,
      withCredentials: false,
      data: formData,
    })
      .then((res) => {
        console.log(res);
        console.log("post modified");
        let data_ = [...data];
        let post = data_.find((e) => e.id === postId);
        post.attachmentUrl = res.data.post.attachmentUrl;
        post.message = res.data.post.message;
        reset();
        resetShowModifyPost();
      })
      .catch((err) => {
        console.log(err.response.status);
        console.log(err.response.data);
        if (err.response.status === 500) {
          setModifyPostError(true);
          setModifyPostErrorMessage("Une erreur est survenue");
        } else {
          setModifyPostError(true);
          setModifyPostErrorMessage(err.response.data.message);
        }
      });
  };
  const handleDeleteComment = (id, postId) => {
    // const confirm = window.confirm(
    //   "etes vous sûr de vouloir supprimer ce commentaire?"
    // );
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/messages/comment/${id}`,
      withCredentials: false,
    })
      .then((res) => {
        console.log(res);

        console.log("comment Deleted");
        let data_ = [...data];
        let post = data_.find((e) => e.id === postId);
        post.comments = post.comments.filter((k) => k.id !== id);
        setData(data_);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAddComment = (postId, comment, reset) => {
     
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/messages/${postId}/comment`,
      withCredentials: false,
      data: { comment },
    })
      .then((res) => {
        console.log("comment sended");
        let data_ = [...data];
        let post = data_.find((e) => e.id === postId);
        post.comments.push({
          ...res.data.comment,
          user: { id: user.id, userName: user.userName },
        });
        setData(data_);
        reset();
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.status);
        console.log(err.response.data.message);
        if (err.response.status === 500) {
          setCommentError(true);
          setCommentErrorMessage("Une erreure serveur est survenue");
        } else if (err.response.status === 429) {
          setCommentError(true);
          setCommentErrorMessage(err.response.data.message);
        } 
        else {
          setCommentError(  true);
          setCommentErrorMessage(err.response.data.message);
        }
      });
  };

  return (
    <div className="center">
      {searchAndAddPostError && (
        <div
          className="alert_box alert"
          onClick={() => setSearchAndAddPostError(false)}
        >
          <p>{searchAndAddPostErrorMessage}</p>
        </div>
      )}
      <PostForm key="postForm" onAdd={handleAddPost} />
      {noPost && (
        <div>
          <h3>&nbsp; :-( Cet utilisateur n'a rien posté )-:</h3>
        </div>
      )}

      <ul className="messageList">
        {data.map((e) => (
          <Post
            key={"post_" + e.id}
            post={e}
            onDelete={handleDeletePost}
            onDeleteComment={handleDeleteComment}
            onAddComment={handleAddComment}
            onModifyPost={handleModifyPost}
            modifyPostError={modifyPostError}
            setModifyPostError={setModifyPostError}
            modifyPostErrorMessage={modifyPostErrorMessage}
            setCommentError={setCommentError}
            commentError={commentError}
            commentErrorMessage={commentErrorMessage}
          />
        ))}
      </ul>
    </div>
  );
}

export default PostsList;
