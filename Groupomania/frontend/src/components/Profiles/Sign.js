import React from "react";
import { useState, useContext } from "react";
import "../../styles/index.css";
import { UserContext } from "../UserContext";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function Sign() {
  const { user } = useContext(UserContext);
  const [signUp, setSignUp] = useState(false);
  const [signIn, setSignIn] = useState(true);

  const handleLog = (e) => {
    if (e.target.id === "signUpButton") {
      setSignIn(false);
      setSignUp(true);
    } else if (e.target.id === "signInButton") {
      setSignIn(true);
      setSignUp(false);
    }
  };
  return !user.isLogged ? (
    signIn ? (
      <div className="alternate_sign">
        {signUp && <SignUp />}
        {signIn && <SignIn />}
        <button
          className="alternate_sign_button"
          id="signUpButton"
          onClick={handleLog}
        >
          Créer un compte
        </button>
      </div>
    ) : (
      <div className="alternate_sign">
        {signUp && <SignUp />}
        {signIn && <SignIn />}
        <button
          className="alternate_sign_button"
          id="signInButton"
          onClick={handleLog}
        >
          J'ai déjà un compte
        </button>
      </div>
    )
  ) : (
    ""
  );
}

export default Sign;
