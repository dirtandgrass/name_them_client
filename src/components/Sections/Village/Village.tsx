import { GroupMembershipType } from "../../../types/Group";
import { User } from "../../../types/User";

function Village({ user, group }: { user: User; group: GroupMembershipType }) {
  if (group.role === "admin") {
  }

  let createForm = document.getElementById(
    "create-group-form"
  ) as HTMLDialogElement;

  function showCreate() {
    if (!createForm) {
      createForm = document.getElementById(
        "create-group-form"
      ) as HTMLDialogElement;
    }
    createForm?.showModal();
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
        <h2>
          Selected Village: <span>{group.name}</span>
        </h2>

        <div>{group.description}</div>
        <div>{group.role}</div>
      </div>
      <div>
        <button onClick={showCreate}>Create Village</button>
      </div>
    </section>
  );
}

export default Village;
