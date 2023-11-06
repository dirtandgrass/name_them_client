import React from "react";
import { defaultUser, user } from "../types/User";

export type UserContextType = {
  user: user;
  setUser: React.Dispatch<React.SetStateAction<user>>;
}

export const defaultUserContext: UserContextType = {
  user: defaultUser,
  setUser: () => { }
};

const UserContext = React.createContext<UserContextType>(defaultUserContext);
export default UserContext;