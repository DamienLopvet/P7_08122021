import React from 'react';
import { useState, useContext } from "react";
import logo from "../assets/logo.png";
import "../styles/Banner.css";
import { UserContext } from "./UserContext";
import MyProfile from "./MyProfile";
import Search from "./Search";

function Nav() {
  const { user } = useContext(UserContext);
  const [viewProfile, setViewProfile] = useState(false);

  function Signout(e) {
    e.preventDefault();
    user.token = "";
    user.isLogged = false;
    window.location.reload();
  }

  function handleClick(e) {
    e.preventDefault();
    if (e.target.id === "voirMonProfile") {
      setViewProfile(true);
    }
    if (e.target.id === "cacherMonProfile") {
      setViewProfile(false);
    }
  }
  return user.isLogged ? (
    <div className="header_nav">
      {viewProfile === false && (
        <a
          className="header_nav_link"
          href=""
          onClick={handleClick}
          rel="noopener noreferrer"
          id="voirMonProfile"
        >
          Mon profil
        </a>
      )}
      {viewProfile && (
        <a
          className="header_nav_link"
          href=""
          onClick={handleClick}
          rel="noopener noreferrer"
          id="cacherMonProfile"
        >
          Mon profil
        </a>
      )}
      <a
        className="header_nav_link"
        href=""
        target=""
        id="signout"
        onClick={Signout}
      >
        Signout
      </a>
      {viewProfile && <MyProfile />}
    </div>
  ) : (
    ""
  );
}

function Banner({userName, setUserName}) {
  return (
    <div className="banner">
      <header className="header">
        <div className="header_brand">
          <img src={logo} className="header_logo" alt="logo Groupomania" />
          <h1>Groupomania</h1>
        </div>
        <Nav />
      </header>
      <Search userName={userName} setUserName={setUserName} />
    </div>
  );
}

export default Banner;
