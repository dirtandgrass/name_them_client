import { useContext } from "react";
import GroupContext from "../../../utility/GroupContext";
import UserContext from "../../../utility/UserContext";

function Village() {
  const { group } = useContext(GroupContext);
  const { user } = useContext(UserContext);

  if (group.role === "admin") {
  }

  let createForm = document.getElementById(
    "create-group-form"
  ) as HTMLDialogElement;

  let inviteForm = document.getElementById(
    "invite-to-group-form"
  ) as HTMLDialogElement;

  function showCreate() {
    if (!createForm) {
      createForm = document.getElementById(
        "create-group-form"
      ) as HTMLDialogElement;
    }
    createForm?.showModal();
  }

  function showInvite() {
    if (!inviteForm) {
      inviteForm = document.getElementById(
        "invite-to-group-form"
      ) as HTMLDialogElement;
    }
    inviteForm?.showModal();
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
      <div>
        <button onClick={showCreate}>Create New Village</button>
      </div>
      <div className="selected">
        <h2>
          Selected Village: <span>{group.name}</span>
        </h2>
        <div id="village-actions">
          {group.role === "admin" ? (
            <button onClick={showInvite}>Invite someone</button>
          ) : null}
        </div>
        <h3>Role:</h3>
        <span>{group.role}</span>
        <h3>Description:</h3>
        <p>{group.description}</p>
      </div>
    </section>
  );
}

export default Village;
