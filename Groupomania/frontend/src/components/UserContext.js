import React from "react";

export const user = {
  userName: null,
  id: null,
  isAdmin: false,
  token: null,
  isLogged: false,
};
export const UserContext = React.createContext(user);
