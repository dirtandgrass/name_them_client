//import "./DialogForm.css";

import { useContext } from "react";
import { z } from "zod";
import GroupContext from "../../contexts/GroupContext";
import UserContext from "../../contexts/UserContext";
import { message } from "../../types/Api";
import localFetch, { HttpMethod } from "../../utility/LocalFetch";

const GroupInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "participant"]),
});

function InviteUserToGroup({}: {}) {
  const { group } = useContext(GroupContext);
  const { user } = useContext(UserContext);

  function closeDialog() {
    const dialogForm = document.getElementById(
      "invite-to-group-form"
    ) as HTMLDialogElement;
    dialogForm?.close();
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const { email, role } = Object.fromEntries(
      new FormData(formEl).entries()
    ) as z.infer<typeof GroupInviteSchema>;

    const validation = GroupInviteSchema.safeParse({ email, role });
    if (!validation.success) {
      // TODO: show error to user
      console.log("invite to group parse error", validation.error);
      return;
    }

    const result = (await localFetch({
      path: "group/",
      method: HttpMethod.POST,
      user: user,
      data: {
        email,
        role,
        group_id: group.group_id,
        action: "invite",
      },
    })) as message;

    if (result.success) {
      closeDialog();
    } else {
      // TODO: show error to user
      console.log("invite to group error", result.message);
    }
  }

  return (
    <dialog id="invite-to-group-form">
      <h2>Invite to {group.name}</h2>
      <form onSubmit={handleCreate}>
        <div className="form_input"></div>
        <div className="form_input">
          <input
            name="email"
            autoComplete="email"
            type="text"
            placeholder="email address"
          />
        </div>
        <div className="form_input">
          <select name="role" defaultValue={"participant"}>
            <option value="admin">Administrator</option>
            <option value="participant">Participant</option>
          </select>
        </div>
        <div className="form_actions">
          <button type="button" onClick={closeDialog}>
            Cancel
          </button>
          <button type="submit">Invite</button>
        </div>
      </form>
    </dialog>
  );
}
export default InviteUserToGroup;
