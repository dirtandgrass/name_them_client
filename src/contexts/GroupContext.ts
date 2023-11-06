import React from "react";
import { GroupMembershipType, defaultGroup } from "../types/Group";

export type GroupContextType = {
  group: GroupMembershipType;
  setGroup: React.Dispatch<React.SetStateAction<GroupMembershipType>>;
}

export const defaultGroupContext: GroupContextType = {
  group: defaultGroup,
  setGroup: () => { }
};

const GroupContext = React.createContext<GroupContextType>(defaultGroupContext);
export default GroupContext;