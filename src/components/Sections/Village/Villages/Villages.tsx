import { useContext } from "react";
import GroupContext from "../../../../utility/GroupContext";
import UserContext from "../../../../utility/UserContext";

function Villages() {
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

  return (
    <section className="village-section">
      {/* <ul>
        <li>Villages are formed to name a new family member.</li>
        <li>Each village has settings to decide what genders can be named.</li>
        <li>
          Villages are private, (except the <em>Global Village</em>), only
          people you invite can participate and see results.
        </li>
      </ul> */}
      <div>
        <button onClick={showCreate}>Create New Village</button>
      </div>
    </section>
  );
}

export default Villages;
