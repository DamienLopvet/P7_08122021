import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";


function DeleteMyProfile(){
    const user = useContext(UserContext);

    const confirm = window.confirm(
      "etes vous sûr de vouloir supprimer votre compte?"
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
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  };
  export default DeleteMyProfile