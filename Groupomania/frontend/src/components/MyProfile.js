import { UserContext } from "./UserContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import ChangeMyProfile from "./ChangeMyProfile";
import ManageUsersProfile from "./ManageUsersProfil";
import DeleteMyProfile from "./DeleteMyProfile";

function MyProfile() {
  const [manageUserProfile, setManageUserProfile] = useState(false);
  const [userProfileManagement, setUserProfileManagement] = useState(false);
  const [deleteMyProfile, setDeleteMyProfile] = useState("");
  const [profileForm, setProfileForm] = useState(false );
  const user = useContext(UserContext);
  if (deleteMyProfile) {
    DeleteMyProfile();
  }

  const handleProfile = (e) => {
    e.preventDefault();
    if (e.target.id === "changeProfile") {
      setProfileForm(true);
    }
    if (e.target.id === "abortChangeProfile") {
      setProfileForm(false);
    }

    if (e.target.id === "abortChanges") {
      setProfileForm(false);
    }
    if (e.target.id === "changeUserProfile") {
      setManageUserProfile(true);
    }
    if (e.target.id === "abortChangeUserProfile") {
      setManageUserProfile(false);
    }
    if (e.target.id === "abortUserManagement") {
      setManageUserProfile(false);
    }
    if (e.target.id === "userProfileManagement") {
      setUserProfileManagement(true);
    }
    if (e.target.id === "DeleteMyProfile") {
      setDeleteMyProfile(true);
    }
    if(e.target.id === "abortFindUser"){
      setManageUserProfile(false)
    }
  };
  const [data, setData] = useState([]);
  useEffect(async () => {
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
        if (res.data.error) {
          console.log("erreur lors du fetch get user");
        } else {
          console.log(res.data);
          setData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h2 className="sign_title">Mon Profil</h2>
      <div>
        <h2>Mes données actuelles</h2>
        <ul className="sign">
          <li>Nom d'utilisateur : {data.userName}</li>
          <li>Email : {data.email}</li>
        </ul>
        {profileForm === false && (
          <button onClick={handleProfile} className="btn" id="changeProfile">
            Changer mes données
          </button>
        )}
        {profileForm && (
          <button
            onClick={handleProfile}
            className="btn"
            id="abortChangeProfile"
          >
            Changer mes données
          </button>
        )}
        <button onClick={handleProfile} className="btn" id="DeleteMyProfile">
          Supprimer mon compte
        </button>
      </div>
      {user.isAdmin && manageUserProfile === false && (
        <button onClick={handleProfile} className="btn" id="changeUserProfile">
          "Utilisateur Admin"
        </button>
      )}
      {user.isAdmin && manageUserProfile && (
        <button
          onClick={handleProfile}
          className="btn"
          id="abortChangeUserProfile"
        >
          "Utilisateur Admin"
        </button>
      )}

      {profileForm && <ChangeMyProfile />}
        {profileForm && <button className="btn" id="abortChanges" onClick={handleProfile}>
        Annuler
      </button>}
      {manageUserProfile && <ManageUsersProfile />}
      {manageUserProfile && <button className="btn" id="abortFindUser"
      onClick={handleProfile}>
        Annuler
      </button>}
    </>
  );
}

export default MyProfile;
