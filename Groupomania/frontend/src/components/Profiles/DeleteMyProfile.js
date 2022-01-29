import React from 'react';
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";

function DeleteMyProfile() {
  const { user } = useContext(UserContext);
  const handleProfile = (e) => {
    const confirm = window.confirm(
      "etes vous sûr de vouloir supprimer ce compte?"
    );
    if (confirm) {
      axios({
        headers: {
          Authorization: "Bearer " + user.token,
        },
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}api/auth/${user.id}`,
        withCredentials: false,
      })
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            console.log("delete ok");
            window.alert("votre profil a bien été supprimé");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } 
  };
  return (
    <button onClick={handleProfile} className="btn" id="DeleteMyProfile">
      Supprimer mon compte
    </button>
  );
}
export default DeleteMyProfile;
