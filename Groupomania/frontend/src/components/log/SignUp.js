import React, { useState } from "react";
import "../../styles/Sign.css";
import axios from "axios";
import PostsList from "../PostsList";
  

const SignUp = () => {
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailError = document.querySelector('.email.error');
  const passwordError = document.querySelector('.password.error')
  const userNameError = document.querySelector('.userName.error');


const handleSignUp = (e)=>{
e.preventDefault()
axios({
  method:'post',
  url: `${process.env.REACT_APP_API_URL}api/auth/signup`,
  withCredentials:false,
  data:{
    userName,
    email,
    password,
  }
}).then((res)=>{
  if(res.data.error){
    userNameError.innerHTML = res.data.errors.userName;
    emailError.innerHTML = res.data.errors.email;
    passwordError.innerHTML = res.data.errors.password;
  }
  else{
    console.log('signup réussit')
    axios({
      method:'post',
      url: `${process.env.REACT_APP_API_URL}api/auth/signin`,
      withCredentials:false,
      data:{
        email,
        password,
      }
    }).then((res)=>{
      if(res.data.error){
        emailError.innerHTML = res.data.errors.email;
        passwordError.innerHTML = res.data.errors.password;
      }
      else{
        console.log('login réussit')
        PostsList()
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
}).catch((err)=>{
  console.log(err)
})
}
  return (
    <div>
      <h1 className="sign_title">
        Créez un compte pour commencer à échanger avec vos collègues
      </h1>
      <form className="sign" action="" onSubmit={handleSignUp} id="sign_up_form">
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
          <div className="userName error"></div>
          
          <div className="userName error"></div>  
        </label>
        <label htmlFor="email">
          <input
            className="sign_field"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
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
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
          />
          <div className="password error"></div>
        </label>

        <input type="submit" value="Créer un compte" className="button  " />
      </form>
    </div>
  );
};

export default SignUp;
