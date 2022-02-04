import React from "react";
import "../../styles/index.css";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import eye from "../../assets/eye.png";

function SignUp() {
  const [isLogged, setIsLogged] = useState();
const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [Error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e)=>{
    e.preventDefault()
    setShowPassword(true)
  }
  const handleHidePassword = (e)=>{
    e.preventDefault()
    setShowPassword(false)
  }
  const handleSignUp = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/auth/signup`,
      withCredentials: false,
      data: {
        userName,
        email,
        password,
      },
    })
      .then((res) => {
        let user_ = {};
        user_.userName = res.data.userName;
        user_.id = res.data.userId;
        user_.isAdmin = res.data.isAdmin;
        user_.token = res.data.token;
        user_.isLogged = true;
        setIsLogged(true);
        setUser(user_);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.status);

        console.log(err.response.data);

        setError(true);
        setErrorMessage(err.response.data.message);
      });
  };

  return !isLogged ? (
    <>
      <div className="sign">
        <h1 className="sign_title">
          Créez un compte pour commencer à échanger avec vos collègues
        </h1>
        <form
          className="hero"
          action=""
          onSubmit={handleSignUp}
          id="Profile_form"
        >
          <label htmlFor="userName">
            <input
              className="sign_field"
              type="text"
              name="userName"
              id="userName"
              placeholder="Surnom"
              required
              onChange={(e) => setuserName(e.target.value)}
              value={userName}
            />
          </label>
          <label htmlFor="email">
            <input
              className="sign_field"
              type="email"
              name="email"
              id="email"
              placeholder="Email@groupomania.org"
              pattern="^(.*)@(groupomania.org)$"
              title="un email groupomania est obligatoire"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label htmlFor="password">
          <div className="signInPassword">

            <input
              className="sign_field"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,12}"
              title="Le mot de passe devrait contenir entre 8 et 12 charactères, un symbole et au moins une majuscule, une minuscule et un chiffre."
              placeholder="Mot de passe"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <img
              src={eye}
              alt="show password"
              className="showPassword"
              onMouseDown={handleShowPassword}
              onMouseUp={handleHidePassword}

            /></div>
          </label>
          {Error && <div className="alert">{errorMessage}</div>}
          <input type="submit" value="Créer un compte" className="btn  " />
        </form>
      </div>
    </>
  ) : (
    ""
  );
}

export default SignUp;
