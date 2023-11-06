import { useContext } from "react";
import GroupContext from "../../../contexts/GroupContext";
import UserContext from "../../../contexts/UserContext";
import { isLoggedIn } from "../../../types/User";
import NameLoader from "./NameLoader/NameLoader";
import RandomNameList from "./RandomNameList/RandomNameList";
import RateName from "./RateName/RateName";

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
