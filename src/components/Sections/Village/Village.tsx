import { GroupMembershipType } from "../../../types/Group";
import { User } from "../../../types/User";

function Village({ user, group }: { user: User; group: GroupMembershipType }) {
  return (
    <div className="village">
      <div>{group.name}</div>
      <div>{group.description}</div>
      <div>{group.role}</div>
    </div>
  );
}

export default Village;
