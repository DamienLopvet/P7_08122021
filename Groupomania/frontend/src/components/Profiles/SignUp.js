import React from "react";

import "../../styles/index.css";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

function SignUp() {
  const [isLogged, setIsLogged] = useState();
const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [Error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
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
