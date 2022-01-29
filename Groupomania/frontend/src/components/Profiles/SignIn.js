import React from 'react';

import "../../styles/index.css";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [signInError, setSignInError] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState("");
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
         console.log(res.data);
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
          <label htmlFor="email">
            <input
              className="sign_field"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
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
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
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
