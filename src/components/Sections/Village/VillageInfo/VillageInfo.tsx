import { useContext } from "react";
import GroupContext from "../../../../utility/GroupContext";
import UserContext from "../../../../utility/UserContext";

function VillageInfo() {
  const { group } = useContext(GroupContext);
  const { user } = useContext(UserContext);

  if (group.role === "admin") {
  }

  let inviteForm = document.getElementById(
    "invite-to-group-form"
  ) as HTMLDialogElement;

  function showInvite() {
    if (!inviteForm) {
      inviteForm = document.getElementById(
        "invite-to-group-form"
      ) as HTMLDialogElement;
    }
    inviteForm?.showModal();
  }

  return (
    <section className="village-info">
      {/* <ul>
        <li>Villages are formed to name a new family member.</li>
        <li>Each village has settings to decide what genders can be named.</li>
        <li>
          Villages are private, (except the <em>Global Village</em>), only
          people you invite can participate and see results.
        </li>
      </ul> */}

      <div className="selected">
        <h2>{group.name}</h2>
        <em>{group.role}</em>
        <p>{group.description}</p>
        <div id="village-actions">
          {group.role === "admin" ? (
            <button onClick={showInvite}>Invite someone</button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default VillageInfo;
