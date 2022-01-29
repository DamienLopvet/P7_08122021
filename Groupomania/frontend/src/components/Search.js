import React from 'react';
import { useContext} from "react";
import "../styles/index.css";
import { UserContext } from "./UserContext";
import search from "../assets/search.png";


function Search({ userName, setUserName }) {
  const { user } = useContext(UserContext);
  const setWidth = e =>{
    e.preventDefault()
    e.target.style.width='40%';
    
  };

  return (
    <div className="search center">
      {user.isLogged && (
        <>
        <div className='userNameWelcome'>Bonjour <strong>{user.userName}</strong>,</div>
          <input
            id="search_input"
            className="search_input"
            placeholder='Filtrer par utilisateur'
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            onClick={setWidth}
          />
          <img src={search} alt="recherche" className="search_icon" />
        </>
      )}
    </div>
  );
}
export default Search;
