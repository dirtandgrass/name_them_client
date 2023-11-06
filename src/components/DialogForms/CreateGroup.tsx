//import "./DialogForm.css";

import { useContext } from "react";
import { z } from "zod";
import GroupContext from "../../contexts/GroupContext";
import UserContext from "../../contexts/UserContext";
import { createGroupMessage } from "../../types/Api";
import { GroupMembershipType } from "../../types/Group";
import localFetch, { HttpMethod } from "../../utility/LocalFetch";

const GroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
});

function CreateGroup({
  groups,
  setGroups,
}: {
  groups: GroupMembershipType[];
  setGroups: React.Dispatch<React.SetStateAction<GroupMembershipType[]>>;
}) {
  const { setGroup } = useContext(GroupContext);
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
    const { name, description } = Object.fromEntries(
      new FormData(formEl).entries()
    ) as {
      name: string;
      description: string;
    };

    const validation = GroupSchema.safeParse({ name, description });
    if (!validation.success) {
      // TODO: show error to user
      console.log("create group parse error", validation.error);
      return;
    }

    const result = (await localFetch({
      path: "group/",
      method: HttpMethod.POST,
      user: user,
      data: {
        name,
        description,
      },
    })) as createGroupMessage;

    if (result.success && result.group && result.group_id) {
      const group = {
        description: result.group.description,
        group_id: result.group_id,
        name: result.group.name,
        role: result.group.role,
      };

      setGroups([...groups, group]);
      setGroup(group);

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
export default CreateGroup;
