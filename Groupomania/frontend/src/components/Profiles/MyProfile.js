import React from "react";

import { UserContext } from "../UserContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import ChangeMyProfile from "./ChangeMyProfile";
import DeleteMyProfile from "./DeleteMyProfile";

function MyProfile({ setViewProfile }) {
  const [profileForm, setProfileForm] = useState(false);
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState([]);
  const [info, setInfo] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleProfile = (e) => {
    e.preventDefault();
    if (e.target.id === "changeProfile") {
      setProfileForm(!profileForm);
    }
  };
  const handleShowProfile = (e) => {
    if (e.target.id === "ontopProfile") {
      setViewProfile(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      axios({
        headers: {
          Authorization: "Bearer " + user.token,
        },
        method: "get",
        url: `${process.env.REACT_APP_API_URL}api/auth/${user.userName}`,
        withCredentials: false,
        data: {},
      })
        .then((res) => {
          console.log(res.data);
          setInfo(true);
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData()
  }, [user.token, user.userName]);

  return (
    <div className="ontop" id="ontopProfile" onClick={handleShowProfile}>
      <div className="center">
        <h2 className="sign_title">Mon Profil</h2>
        <div>
          {info && (
            <>
              <ul className="userInfo">
                <h3>Mes données actuelles :</h3>
                {userInfo.map((e) => (
                  <li key={"userInfo" + e.userId}>
                    <p id="my_userName">userName : {e.userName}</p>
                    <p id="my_email">email : {e.email}</p>
                    {user.isAdmin && (
                      <p className="success">
                        vous avez un profil Administrateur
                      </p>
                    )}
                    <p className="success">{successMessage}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!user.isAdmin && (
            <button onClick={handleProfile} className="btn" id="changeProfile">
              Changer mes données
            </button>
          )}

          {!user.isAdmin && <DeleteMyProfile />}
        </div>

        {profileForm && (
          <ChangeMyProfile
            setSuccessMessage={setSuccessMessage}
            setUserInfo={setUserInfo}
            setProfileForm={setProfileForm}
          />
        )}
      </div>
    </div>
  );
}

export default MyProfile;
