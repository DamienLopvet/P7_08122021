import { useContext, useEffect, useState } from "react";
import Banner from "./components/Banner";
import PostsList from "./components/PostsList";
import SendPost from "./components/SendPost";
import Sign from "./components/Sign";
import { UserContext } from "./components/UserContext";

function App() {
    const user = useContext(UserContext);

  
  return (
    <div>
      <UserContext.Provider value={user}>
        
          <Banner />
          <Sign />
          <PostsList />
          <SendPost />

      </UserContext.Provider>
    </div>
  );
}

export default App;
