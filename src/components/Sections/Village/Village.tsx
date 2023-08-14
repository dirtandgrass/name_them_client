import { GroupMembershipType } from "../../../types/Group";
import { User } from "../../../types/User";

function Village({
  user,
  group,
}: {
  user: User;
  group: GroupMembershipType | undefined;
}) {
  return <div className="village">Coming soon</div>;
}

export default Village;
