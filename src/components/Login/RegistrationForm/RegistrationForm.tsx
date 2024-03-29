import "./RegistrationForm.css";
import { register } from "../../../remote/user";

function RegistrationForm() {
  function closeDialog() {
    const registrationForm = document.getElementById(
      "registration-form"
    ) as HTMLDialogElement;
    registrationForm?.close();
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(formEl).entries()) as {
      username: string;
      email: string;
      password: string;
    };

    console.log(data);

    const result = await register(data.username, data.email, data.password);

    if (result.success) {
      closeDialog();
    } else {
    }
  }

  return (
    <dialog id="registration-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form_input">
          <input
            name="email"
            type="text"
            autoComplete="email"
            placeholder="email"
          />
        </div>
        <div className="form_input">
          <input
            name="password"
            autoComplete="new-password"
            type="password"
            placeholder="password"
          />
        </div>
        <div className="form_input">
          <input name="username" type="string" placeholder="username" />
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
export default RegistrationForm;
