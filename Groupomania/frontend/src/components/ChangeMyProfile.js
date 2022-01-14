import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

function ChangeMyProfile() {

  const user = useContext(UserContext);
  const [profileForm, setProfileForm] = useState(true );

  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailError = document.querySelector(".email.error");
  const passwordError = document.querySelector(".password.error");
  const userNameError = document.querySelector(".userName.error");



 

const handleProfileForm = (e) => {
    e.preventDefault();
    axios({
      headers: {
        Authorization: "Bearer " + user.token,
      },
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/auth/${user.id}/userModify`,
      withCredentials: false,
      data: {
        userName,
        email,
        password,
      },
    })
      .then((res) => {
        if (res.data.error) {
          userNameError.innerHTML = res.data.errors.userName;
          emailError.innerHTML = res.data.errors.email;
          passwordError.innerHTML = res.data.errors.password;
        } else {
          console.log(res.data.user.userName);
          alert("utilisateur modifié!");
          user.userName = res.data.user.userName
          
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="hero">
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
            onChange={(e) => setuserName(e.target.value)}
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
      </form>
      
      
    </div>
  )
}

export default ChangeMyProfile;
