import { GroupMembershipType } from "../../../types/Group";
import { User } from "../../../types/User";
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
      {loggedIn ? (
        <div id="rate-name">
          <RateName user={user} group={group} />
        </div>
      ) : (
        <RandomNameList user={user} />
      )}
    </>
  );
}

export default Names;
