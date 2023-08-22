//import "./DialogForm.css";

function CreateGroup() {
  function closeDialog() {
    const dialogForm = document.getElementById(
      "create-group-form"
    ) as HTMLDialogElement;
    dialogForm?.close();
  }

  return (
    <dialog id="create-group-form">
      <h2>Create Group</h2>
      <form>
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
          <textarea name="description" placeholder="description"></textarea>
        </div>
        <div className="form_actions">
          <button type="button" onClick={closeDialog}>
            Cancel
          </button>
          <button type="submit">Register</button>
        </div>
      </form>
    </dialog>
  );
}
export default CreateGroup;
