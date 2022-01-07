import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from './SignUp';


function Sign() {
  const [signUp, setSignUp] = useState(false);
  const [signIn, setSignIn] = useState(true);

  const handleLog = (e) => {
    if (e.target.id === "signUpButton") {
      setSignIn(false);
      setSignUp(true);
    }
    else if (e.target.id === "signInButton") {
      setSignIn(true);
      setSignUp(false);
    }
  };
  return signIn ? (
    
    <div>
       
      {signUp && <SignUp />}
      {signIn && <SignIn />}
      <button className="button" id="signUpButton" onClick={handleLog}>
        Créer un compte
      </button>
     
    </div>
  ): (
    <div>
        {signUp && <SignUp />}
      {signIn && <SignIn />}
      <button className="button" id="signInButton" onClick={handleLog}>
J'ai déjà un compte      </button>
    
    </div>
  )
}

export default Sign;
