import { GroupMembershipType } from "../../../types/Group";
import { User } from "../../../types/User";

function Village({ user, group }: { user: User; group: GroupMembershipType }) {
  if (group.role === "admin") {
  }

  return (
    <section className="village-section">
      <ul>
        <li>Villages are formed to name a new family member.</li>
        <li>Each village has settings to decide what genders can be named.</li>
        <li>
          Villages are private, (except the <em>Global Village</em>), only
          people you invite can participate and see results.
        </li>
      </ul>
      <div className="selected">
        <h2>Selected Village:</h2>
        <div>{group.name}</div>
        <div>{group.description}</div>
        <div>{group.role}</div>
      </div>
      <div>
        <button>Create Village</button>
      </div>
    </section>
  );
}

export default Village;
