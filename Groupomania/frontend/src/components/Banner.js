import React from "react";
import { useState, useContext } from "react";
import logo from "../assets/logo.png";
import "../styles/index.css";
import { UserContext } from "./UserContext";
import MyProfile from "./Profiles/MyProfile";
import Search from "./Search";
import ManageUsersProfile from "./Profiles/ManageUsersProfile";



function Banner({ userName, setUserName }) {
  const { user } = useContext(UserContext);
  const [viewProfile, setViewProfile] = useState(false);
  const [manageUserProfile, setManageUserProfile] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    if (e.target.id === "voirMonProfile") {
      setViewProfile(!viewProfile);
      setManageUserProfile(false);
    } else if (e.target.id === "manage_user_profile") {
      setManageUserProfile(!manageUserProfile);
      setViewProfile(false);
    } else if (e.target.id === "signout") {
      user.token = "";
      user.isLogged = false;
      window.location.reload();
    }
  
  }
  function showManagerProfileForm(e){
    if (e.target.id === "ontopAdmin") {
      setManageUserProfile(!manageUserProfile)
      
    }
  }

  return (
    <div className="banner">
      <header className="header">
        <div className="header_brand" onClick={e => window.location.reload()}>
          <img src={logo} className="header_logo" alt="logo Groupomania" />
          <h1>Groupomania</h1>
        </div>
        {user.isLogged && (
          <div className="header_nav">
            <button
              className="header_nav_link"
              href=""
              onClick={handleClick}
              rel="noopener noreferrer"
              id="voirMonProfile"
            >
              Mon profil
            </button>
            <button
              className="header_nav_link"
              href=""
              target=""
              id="signout"
              onClick={handleClick}
            >
              Deconnexion
            </button>{" "}
            {user.isAdmin && (
              <button
                className="header_nav_link"
                href=""
                target=""
                id="manage_user_profile"
                onClick={handleClick}
              >
                Admin
              </button>
            )}
          </div>
        )}
      </header>
      {viewProfile && <MyProfile setViewProfile={setViewProfile}/>}
      {manageUserProfile && <div className="ontop" id="ontopAdmin"
      onClick={showManagerProfileForm}><ManageUsersProfile /></div>}
      <Search userName={userName} setUserName={setUserName} />
    </div>
  );
}

export default Banner;
