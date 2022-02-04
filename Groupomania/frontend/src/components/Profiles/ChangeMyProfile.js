import React from "react";
import "../../styles/index.css";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";

function ChangeMyProfile({ setSuccessMessage, setUserInfo, setViewProfile }) {
  const { user } = useContext(UserContext);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modifyMyProfilError, setModifyMyProfilError] = useState(false);
  const [modifyMyProfilErrorMessage, setModifyMyProfilErrorMessage] =
    useState("");

  const handleProfileForm = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setModifyMyProfilError(false);

    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/auth/${user.userName}/userModify`,
      withCredentials: false,
      data: {
        userName,
        email,
        password,
      },
    })
      .then((res) => {
        console.log(res.data[0].userName);
        setUserInfo(res.data);
        setSuccessMessage("Vos données ont été modifiées !");
        user.userName = res.data[0].userName;
        console.log(user);
      })
      .catch((err) => {
        console.log(err.response.data);

        if (err.response.data.error) {
          console.log(err.response.data.error.errors[0].message);
          setModifyMyProfilError(true);
          setModifyMyProfilErrorMessage(
            err.response.data.error.errors[0].message
          );
        } else if (err.response.data.message) {
          console.log(err.response.data.message);
          setModifyMyProfilError(true);
          setModifyMyProfilErrorMessage(err.response.data.message);
        }
      });
  };

  return (
    <div className="hero">
      <h3>Changer mes données :</h3>
      <form
        className="sign"
        action=""
        onSubmit={handleProfileForm}
        id="sign_up_form"
      >
        <label htmlFor="userName">
          <input
            className="sign_field"
            type="text"
            name="userName"
            id="userName"
            placeholder="Nouveau nom d'utlisateur"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <div className="userName error"></div>
        </label>
        <label htmlFor="email">
          <input
            className="sign_field"
            type="email"
            name="email"
            id="email"
            placeholder="nouvel Email"
            pattern="^(.*)@(groupomania.org)$"
            title="un email groupomania est obligatoire"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="email error"></div>
        </label>
        <label htmlFor="password">
          <input
            className="sign_field"
            type="password"
            name="password"
            id="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,12}"
            title="Le mot de passe devrait contenir entre 8 et 12 charactères, un symbole et au moins une majuscule, une minuscule et un chiffre."
            placeholder="Nouveau mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        {modifyMyProfilError && (
          <div
            className="alert_box alert"
            onClick={() => setModifyMyProfilError(false)}
          >
            <p>{modifyMyProfilErrorMessage}</p>
          </div>
        )}
        <input
          type="submit"
          value="Confirmer les nouvelles données"
          className="btn  "
        />
      </form>
      <button
        className="btn"
        id="abortChanges"
        onClick={() => setViewProfile(false)}
      >
        Annuler
      </button>
    </div>
  );
}

export default ChangeMyProfile;
