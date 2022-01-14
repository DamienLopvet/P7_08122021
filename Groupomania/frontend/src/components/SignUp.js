import "../styles/Sign.css";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from './UserContext';
import Home from "./Home";
import Banner from "./Banner";


function SignUp() {
  const [isLogged, setIsLogged]= useState()

    const [userName, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const user = useContext(UserContext);
  
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
      user.userName= res.data.userName
      user.id = res.data.userId;
      user.isAdmin = res.data.isAdmin;
      user.token = res.data.token
      user.isLogged = true
      setIsLogged(true)
        }
      }).catch((err)=>{
        console.log(err)
      })
    }
    
    return !isLogged?(
      <>
      
      <div className="sign">
        <h1 className="sign_title">
          Créez un compte pour commencer à échanger avec vos collègues
        </h1>
        <form className="hero" action="" onSubmit={handleSignUp} id="Profile_form">
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
  
          <input type="submit" value="Créer un compte" className="btn  " />
        </form>
      </div></>
    ):("");
  }
  

  export default SignUp