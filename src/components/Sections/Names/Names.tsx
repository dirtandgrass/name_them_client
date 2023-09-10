import { useContext } from "react";
import { GroupMembershipType } from "../../../types/Group";
import { isLoggedIn, user } from "../../../types/User";
import UserContext from "../../../utility/UserContext";
import NameLoader from "./NameLoader/NameLoader";
import RandomNameList from "./RandomNameList/RandomNameList";
import RateName from "./RateName/RateName";
import GroupContext from "../../../utility/GroupContext";

function Names() {
  const { user } = useContext(UserContext);
  const { group } = useContext(GroupContext);

  return (
    <>
      <NameLoader />
      {isLoggedIn(user) && group?.group_id && group.group_id > 0 ? (
        <div id="rate-name">
          <RateName />
        </div>
      ) : (
        <>
          <RandomNameList />
        </>
      )}
    </>
  );
}

export default Names;
