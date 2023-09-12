//import "./DialogForm.css";

import { useContext } from "react";
import { createGroupMessage } from "../../types/Api";
import { GroupMembershipType } from "../../types/Group";
import { user } from "../../types/User";
import GroupContext from "../../utility/GroupContext";
import localFetch, { HttpMethod } from "../../utility/LocalFetch";
import UserContext from "../../utility/UserContext";
import { z } from "zod";

const GroupInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

function InviteUserToGroup({}: {}) {
  const { group } = useContext(GroupContext);
  const { user } = useContext(UserContext);

  function closeDialog() {
    const dialogForm = document.getElementById(
      "create-group-form"
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
        action: "invite",
      },
    })) as createGroupMessage;

    if (result.success && result.group && result.group_id) {
      const group = {
        description: result.group.description,
        group_id: result.group_id,
        name: result.group.name,
        role: result.group.role,
      };

      closeDialog();
    } else {
      // TODO: show error to user
      console.log("create group error", result.message);
    }
  }

  return (
    <dialog id="create-group-form">
      <h2>Create Village</h2>
      <form onSubmit={handleCreate}>
        <div className="form_input"></div>
        <div className="form_input">
          <input
            name="name"
            autoComplete="name"
            type="text"
            placeholder="Name"
          />
        </div>
        <div className="form_input">
          <textarea name="description" placeholder="Description"></textarea>
        </div>
        <div className="form_actions">
          <button type="button" onClick={closeDialog}>
            Cancel
          </button>
          <button type="submit">Create</button>
        </div>
      </form>
    </dialog>
  );
}
export default InviteUserToGroup;
