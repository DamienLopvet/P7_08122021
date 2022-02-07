import "../../styles/index.css";
import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import Post from "./Post";
import PostForm from "./PostForm";

//Construir l'interval qui rafraichit la liste des posts

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

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

//Établir l'interval qui rafraichit la liste des posts

  useInterval(() => {
    if (userName === "") fetchData(userName);
  }, 60000);

  useEffect(() => {
    if (userName.length === 0) {
      setSearchAndAddPostError(false);
    }
    fetchData(userName);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  // Gerer l'affichage des posts et les resultats de la reherche de post par UserName
  const fetchData = async (research) => {
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/messages/${research}`,
      withCredentials: false,
      data: {},
    })
      .then((res) => {
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

  //Ajouter un post
  const handleAddPost = (attachmentUrl, message, reset) => {
    const formData = new FormData();
    formData.append("attachmentUrl", attachmentUrl);
    formData.append("message", message);
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/messages/send`,
      withCredentials: false,
      data: formData,
    })
      .then((res) => {
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

  //Supprimer un post
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
      url: `${process.env.REACT_APP_API_URL}api/messages/delete/${id}`,
      withCredentials: false,
    })
      .then((res) => {
        let data_ = [...data].filter((e) => e.id !== id);
        setData(data_);
        console.log("post Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  //mofifier un post
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
        console.log("post modified");
        let data_ = [...data];
        let post = data_.find((e) => e.id === postId);
        post.message = res.data.post.message;
        if (post.userId !== user.id) {
          post.moderated = true;
        }
        reset();
        resetShowModifyPost();
      })
      .catch((err) => {
        if (err.response.status === 500) {
          setModifyPostError(true);
          setModifyPostErrorMessage("Une erreur est survenue");
        } else {
          setModifyPostError(true);
          setModifyPostErrorMessage(err.response.data.message);
        }
      });
  };

 //Ajouter un commentaire
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
        } else {
          setCommentError(true);
          setCommentErrorMessage(err.response.data.message);
        }
      });
  };

   //Supprimer un commentaire
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
