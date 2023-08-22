import { GroupMembershipType } from "../../../types/Group";
import { User } from "../../../types/User";
import NameLoader from "./NameLoader/NameLoader";
import RandomNameList from "./RandomNameList/RandomNameList";
import RateName from "./RateName/RateName";

function Names({
  user,
  group,
  loggedIn,
}: {
  user: User;
  group: GroupMembershipType | undefined;
  loggedIn: boolean;
}) {
  return (
    <>
      {loggedIn && group?.group_id && group.group_id > 0 ? (
        <div id="rate-name">
          <NameLoader />
          <RateName user={user} group={group} />
        </div>
      ) : (
        <>
          <NameLoader />
          <RandomNameList user={user} />
        </>
      )}
    </>
  );
}

export default Names;
