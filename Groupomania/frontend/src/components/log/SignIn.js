import React, { useState } from "react";
import "../../styles/Sign.css";
import PostsList from "../PostsList";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailError = document.querySelector(".email.error");
  const passwordError = document.querySelector(".password.error");
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
    }).then((res) => {
        console.log(res);
        if (res.data.error) {
          emailError.innerHTML = res.data.error.email;
          passwordError.innerHTML = res.data.error.password;
        } else {
          console.log("login réussit");
         
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="sign_title">
        Connectez-vous pour échanger avec vos collègues
      </h1>
      <form
        className="sign"
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
          <div className="password error"></div>
        </label>

        <input type="submit" value="Se connecter" className="button" />
      </form>
    </div>
  );
};

export default SignIn;
