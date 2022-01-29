import React from 'react';
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";



function DeleteUserProfile({userIdToManage, setInfo, setSuccessMessage }){
    const {user} = useContext(UserContext);
        const handleDeleteUserProfile = (e) => {
          const confirm = window.confirm(
            "etes vous sûr de vouloir supprimer ce compte?"
          );
          if (confirm) {
            axios({
              headers: {
                Authorization: "Bearer " + user.token,
              },
              method: "delete",
              url: `${process.env.REACT_APP_API_URL}api/auth/${userIdToManage}`,
              withCredentials: false,
            })
              .then((res) => {
                if (res.data.error) {
                  console.log(res.data.error);
                } else {
                  console.log("USer deleted");
                  setInfo(false)
                  setSuccessMessage("L'utilisateur à bien été supprimé de la base de donnée !")  
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } 
        };
        return (
          <button onClick={handleDeleteUserProfile} className="btn" id="DeleteUserProfile">
            Supprimer le compte
          </button>
        );
      
}

export default DeleteUserProfile