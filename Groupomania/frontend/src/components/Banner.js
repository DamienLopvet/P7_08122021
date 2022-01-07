import { useState } from "react";
import logo from "../assets/logo.png";
import '../styles/Banner.css'

function Nav(){
  const [isLogged, setIsLogged] = useState(false)

  return isLogged ? (<div className="header_nav">
  <a
    className="header_nav_link"
    href=""
    target="_blank"
    rel="noopener noreferrer"
  >
    Mon profil
  </a>
  
  </div>) : ('')
}

function Banner() {
  return <div className="Banner">
      <header className="header">
        <div className="header_brand">
        <img src={logo} className="header_logo" alt="logo Groupomania" />
        <h1>Groupomania</h1>
        </div>
        <Nav />
      </header>
    </div>;

}

export default Banner;
