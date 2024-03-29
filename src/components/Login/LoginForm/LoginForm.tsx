import { useContext } from "react";
import LoadingContext from "../../../contexts/LoadingContext";
import UserContext from "../../../contexts/UserContext";
import { loginMessage } from "../../../types/Api";
import { defaultUser } from "../../../types/User";
import localFetch, { HttpMethod } from "../../../utility/LocalFetch";
import "./LoginForm.css";

function LoginForm() {
  const { setLoading: setGlobalLoading } = useContext(LoadingContext);
  const { setUser } = useContext(UserContext);
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    setGlobalLoading(true);
    e.preventDefault();

    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries()) as {
      username: string;
      password: string;
    };

    const result = (await localFetch({
      path: "user/?action=login",
      method: HttpMethod.POST,
      data,
    })) as loginMessage;

    if (result.success && result.user && result.session?.success) {
      const { user, session } = result;
      setUser({
        ...user,
        session: session.session,
        session_id: session.session_id,
      });
    } else {
      logOut();
    }

    setGlobalLoading(false);
  }

  function logOut() {
    setUser(defaultUser);
  }

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <div className="form_input">
        <input
          name="login_email"
          type="text"
          autoComplete="email"
          placeholder="email"
        />
      </div>
      <div className="form_input">
        <input
          name="login_password"
          autoComplete="current-password"
          type="password"
          placeholder="password"
        />
      </div>
      <div className="form_input">
        {/* <label htmlFor="create_session">Keep me logged in</label> */}
        <input
          name="create_session"
          type="hidden"
          value="true"
          defaultChecked
        />
      </div>
      <div className="form_actions">
        <button type="submit">Log In</button>
      </div>
    </form>
  );
}
export default LoginForm;
