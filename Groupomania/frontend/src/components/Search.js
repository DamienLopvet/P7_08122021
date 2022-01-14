import { useContext,useState } from "react";
import "../styles/Search.css";
import { UserContext } from "./UserContext";
import search from "../assets/search.png";
import axios from "axios";

function Search() {
  const user = useContext(UserContext);
  
  const [userName, setuserName] = useState("");

  const handleSearch = (e) => {
    axios({headers:{
        "Authorization": "Bearer "+ user.token
      },
        method: "get",
        url: `${process.env.REACT_APP_API_URL}api/messages/${userName}`,
        withCredentials: false,
        
      })
        .then((res) => {
          if (res.data.error) {
            
          } else {
              console.log(res.data);
              setuserName("")
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };
  return (
    <div className="search">{user.isLogged && <input
        className="search_input"
        onClick={handleSearch}
        onChange={(e) => setuserName(e.target.value)}
        value={userName}
        placeholder="Recherche"
      />}
      {user.isLogged && <img src={search} className="search_icon" /> }

    </div>
  );
}
export default Search;
