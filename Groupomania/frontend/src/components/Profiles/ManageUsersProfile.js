import React from "react";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import "../../styles/index.css";
import DeleteUserProfile from "./DeleteUserProfile";

function ManageUsersProfile({ manageUserProfile, setManageUserProfile }) {
  const { user } = useContext(UserContext);
  const [userProfileManagement, setUserProfileManagement] = useState(false);
  const [userName, setUserName] = useState("");
  const [userToManage, setUserToManage] = useState("");
  const [userIdToManage, setUserIdToManage] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [info, setInfo] = useState(false);
  const [findUserError, setFindUserError] = useState(false);
  const [findUserErrorMessage, setFindUserErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleManagement = (e) => {
    e.preventDefault();
    if (e.target.id === "userProfileManagement") {
      setUserProfileManagement(!userProfileManagement);
    }
    if (e.target.id === "annulerUserProfileManagement") {
      setManageUserProfile(!manageUserProfile);
    }
    if (e.target.id === "abortManagementChanges") {
      setManageUserProfile(!manageUserProfile);
    }
  };

  useEffect(() => {
    setSuccessMessage("");
    if(userName){
    async function FindUser() {
      axios({
        headers: {
          Authorization: "Bearer " + user.token,
        },
        method: "get",
        url: `${process.env.REACT_APP_API_URL}api/auth/${userName}`,
        withCredentials: false,
      })
        .then((res) => {
          setUserInfo(res.data);
          setInfo(true);
          setFindUserError(false);
          setUserToManage(res.data[0].userName);
          setUserIdToManage(res.data[0].userId);
        })
        .catch((err) => {
          setFindUserError(true);
          if (err.response.data) {
            setFindUserErrorMessage(err.response.data.message);
            setInfo(false);
          }
        });
    }
    FindUser();}
  }, [userName, user.token]);

  return (
    <div className="center mg-top">
      <h2>Administration des utilisateurs</h2>
      <div className="hero">
      <label htmlFor="ManageSearchUser">  <h3>Trouver un utilisateur :</h3>
        <input
          autoComplete="off"
          className="sign_field"
          type="text"
          name="ManageSearchUser"
          id="ManageSearchUser"
          placeholder="UserName de l'utlisateur"
          onChange={(e) => setUserName(e.target.value)}
        /></label>
        {findUserError && (
          <div
            className="alert_box alert"
            onClick={() => setFindUserError(false)}
          >
            <p>{findUserErrorMessage}</p>
          </div>
        )}
        {info && (
          <>
            <ul className="userInfo white">
              <h4>{userInfo[0].userName}</h4>
              <h4>Données actuelles de l'utilisateur :</h4>

              {userInfo.map((e) => (
                <li key={"userInfo" + e.userId}>
                  <p id="user_userName">userName : {e.userName}</p>
                  <p id="user_email">email : {e.email}</p>
                  <p id="user_isAdmin">
                    Administrateur : {e.isAdmin.toString()}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          className="btn"
          id="userProfileManagement"
          onClick={handleManagement}
        >
          Changer les données utilisateur
        </button>
        {!userProfileManagement && <button
          className="btn"
          id="annulerUserProfileManagement"
          onClick={handleManagement}
        >
          annuler
        </button>}
        {userProfileManagement && <ProfileManagementForm />}
      </div>
    </div>
  );

  function ProfileManagementForm() {
    const [userName, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [userManagementError, setUserManagementError] = useState("");
    const handleUserProfile = (e) => {
      e.preventDefault();
      setUserManagementError("");
      setSuccessMessage("");
      axios({
        headers: {
          Authorization: "Bearer " + user.token,
        },
        method: "put",
        url: `${process.env.REACT_APP_API_URL}api/auth/${userToManage}/userModify`,
        withCredentials: false,
        data: {
          userName,
          email,
          password,
          isAdmin,
        },
      })
        .then((res) => {
          console.log(res.data);
          setUserInfo(res.data);
          setUserManagementError("");
          setSuccessMessage("Les données ont été modifiées !");
          setUserToManage(res.data[0].userName);
          setUserIdToManage(res.data[0].userId);
        })
        .catch((err) => {
          setSuccessMessage("");
          if (err.response.status === 404) {
            setUserManagementError(
              "vous devez d'abord selectionner un utilisateur"
            );
          }
          console.log(err);
          if (err.response.data.message) {
            setUserManagementError(err.response.data.message);
          } else if (err.response.data.error) {
            console.log(err.response.data.error.errors[0].message);
            setUserManagementError(err.response.data.error.errors[0].message);
          }
        });
    };

    return (
      <>
        {userManagementError && (
          <div
            className="alert_box alert"
            onClick={() => setUserManagementError(false)}
          >
            <p>{userManagementError}</p>
          </div>
        )}
        {successMessage && <p className="success center">{successMessage}</p>}
        <form
          action=""
          onSubmit={handleUserProfile}
          id="profileManagement_form"
          autoComplete="off"
        >
          <div>
            <input
              aria-label="Surnom"
              autoComplete="off"
              className="sign_field"
              type="text"
              name="userName"
              id="profileManagement_userName"
              placeholder="Nouveau nom d'utlisateur"
              onChange={(e) => setuserName(e.target.value)}
              value={userName}
            />
            <div className="userName error"></div>
          </div>
          <div>
            <input
            aria-label="email"
              autoComplete="off"
              className="sign_field"
              type="email"
              name="email"
              id="profileManagement_email"
              pattern="^(.*)@(groupomania.org)$"
              title="un email groupomania est obligatoire"
              placeholder="nouvel Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="email error"></div>
          </div>
          <div>
            <input
            aria-label="password"
              autoComplete="off"
              className="sign_field"
              type="password"
              name="password"
              id="profileManagement_password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,12}"
              title="Le mot de passe devrait contenir entre 8 et 12 charactères, un symbole et au moins une majuscule, une minuscule et un chiffre."
              placeholder="Nouveau mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="password error"></div>
          </div>
          <div className="check_box">
            <input
            aria-label="est un admin?"
              type="checkbox"
              name="isAdmin"
              id="profileManagement_isAdmin"
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            Est un Admin ?<div className="password error"></div>
          </div>
          <div>
            <input
              type="submit"
              name="manageSubmit"
              id="manageSubmit"
              value="Confirmer les nouvelles données"
              className="btn  "
            />
          </div>
        </form>
        <DeleteUserProfile
          userIdToManage={userIdToManage}
          setInfo={setInfo}
          setSuccessMessage={setSuccessMessage}
        />
        <button
          className="btn"
          id="abortManagementChanges"
          onClick={handleManagement}
        >
          Annuler
        </button>
      </>
    );
  }
}
export default ManageUsersProfile;
