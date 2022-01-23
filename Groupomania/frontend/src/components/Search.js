import React from 'react';
import { useContext} from "react";
import "../styles/Search.css";
import { UserContext } from "./UserContext";
import search from "../assets/search.png";


function Search({ userName, setUserName }) {
  const { user } = useContext(UserContext);

  return (
    <div className="search">
      {user.isLogged && (
        <>
          <input
            id="search_input"
            className="search_input"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
           
          />
          <img src={search} className="search_icon" />
        </>
      )}
    </div>
  );
}
export default Search;
