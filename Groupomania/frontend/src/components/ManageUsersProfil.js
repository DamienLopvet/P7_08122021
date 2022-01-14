import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "./UserContext";

function ManageUsersProfile() {
  const user = useContext(UserContext);
  const [userProfileManagement, setUserProfileManagement] = useState(false);

  const [userName, setUserName] = useState("");
  const userInfo = document.querySelector(".userInfo");
  const handleManagement = (e) => {
    e.preventDefault();
    if (e.target.id === "userProfileManagement") {
      setUserProfileManagement(true);
    }
    if (e.target.id === "abortUserProfileManagement") {
      setUserProfileManagement(false);
    }
    if(e.target.id === "abortManagementChanges")
    setUserProfileManagement(false)
  };

  function FindUser() {
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/auth/${userName}`,
      withCredentials: false,
    })
      .then((res) => {
        if (res.data.error) {
        } else {
          console.log(res);
          userInfo.innerHTML =
            "Email: " +
            res.data.email +
            " <br/> Username: " +
            res.data.userName + "<br/>Profile Admin : " + res.data.isAdmin + "<br/>Id utlisateur : " +res.data.userId;
          setUserName("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return (
      <div>
        <p>salut</p>
      </div>
    );
  }

  return (
    <div className="hero">
      <h3>Trouver un utilisateur</h3>
      <input
        className="sign_field"
        type="text"
        name="userName"
        placeholder="UserName de l'utlisateur"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
        onClick={FindUser}
        
      />
      <div className="userInfo"></div>
      
      {userProfileManagement === false &&<button
        className="btn"
        id="userProfileManagement"
        onClick={handleManagement}
      >
        Changer les données utilisateur
      </button>}
      {userProfileManagement && <button
        className="btn"
        id="abortUserProfileManagement"
        onClick={handleManagement}
      >
        Changer les données utilisateur
      </button>}
      {userProfileManagement && <ProfileManagementForm />}
    </div>
  );

  function ProfileManagementForm() {
    function handleUserProfile() {}
    const [userName, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
      <form
        action=""
        onSubmit={handleUserProfile}
        id="profileManagement_form"
      >
        <label htmlFor="profileManagement_userName">
          <input
            className="sign_field"
            type="text"
            name="userName"
            id="profileManagement_userName"
            placeholder="Nouveau nom d'utlisateur"
            onChange={(e) => setuserName(e.target.value)}
            value={userName}
          />
          <div className="userName error"></div>
        </label>
        <label htmlFor="profileManagement_email">
          <input
            className="sign_field"
            type="email"
            name="email"
            id="profileManagement_email"
            placeholder="nouvel Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="email error"></div>
        </label>
        <label htmlFor="profileManagement_password">
          <input
            className="sign_field"
            type="password"
            name="password"
            id="profileManagement_password"
            placeholder="Nouveau mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div className="password error"></div>
        </label>
        <input
          type="submit"
          value="Confirmer les nouvelles données"
          className="btn  "
        />
        <button className="btn" id="abortManagementChanges" onClick={handleManagement}>
          Annuler
        </button>
      </form>
    );
  }
}
export default ManageUsersProfile;
