import React from "react";
import "../../styles/index.css";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import eye from "../../assets/eye.png";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [signInError, setSignInError] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = (e)=>{
    e.preventDefault()
    setShowPassword(true)
  }
  const handleHidePassword = (e)=>{
    e.preventDefault()
    setShowPassword(false)
  }
  const handleSignIn = (e) => {
    e.preventDefault();

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/auth/signin`,
      withCredentials: false,
      data: {
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

        setUser(user_);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.status);

        console.log(err.response.data);

        setSignInError(true);
        setSignInErrorMessage(err.response.data.message);
      });
  };

  return !user.isLogged ? (
    <>
      <div className="sign">
        <h1 className="sign_title">
          Connectez-vous pour échanger avec vos collègues
        </h1>
        <form
          className="hero"
          action=""
          onSubmit={handleSignIn}
          id="sign_in_form"
        >
          <label htmlFor="signInEmail">Email :
            <input
              className="sign_field"
              type="email"
              name="signInEmail"
              id="signInEmail"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label htmlFor="signInPassword">Password :
          <div className="signInPassword">
            <input
              className="sign_field"
              type={showPassword ? "text" : "password"}
              name="signInPassword"
              id="signInPassword"
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              value={password}/>
            <img
              src={eye}
              alt="show password"
              className="showPassword"
              onMouseDown={handleShowPassword}
              onMouseUp={handleHidePassword}
            /></div>
          </label>
          
          {signInError && <div className="alert">{signInErrorMessage}</div>}

          <input type="submit" value="Se connecter" className="btn" />
        </form>
      </div>
    </>
  ) : (
    ""
  );
}

export default SignIn;
