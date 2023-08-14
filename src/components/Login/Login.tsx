import { User, defaultUser } from "../../types/User";
import "./Login.css";

import { useEffect } from "react";
import LoginForm from "./LoginForm/LoginForm";
import { PageType } from "../../types/Menu";

function Login({
  user,
  setUser,
  setPage,
}: {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
}) {
  useEffect(() => {
    if (!user) {
      logOut();
      setPage(PageType.names);
      return;
    }
    // storage only stores data members, recreate User object if needed
    if (!user.isLoggedIn) {
      setUser(
        new User(
          user.user_id,
          user.username,
          user.email,
          user.session_id,
          user.session
        )
      );
    }
  }, []);

  let registrationForm = document.getElementById(
    "registration-form"
  ) as HTMLDialogElement;

  function logOut() {
    setUser(defaultUser);
    setPage(PageType.names);
  }

  function showRegister() {
    if (!registrationForm) {
      registrationForm = document.getElementById(
        "registration-form"
      ) as HTMLDialogElement;
    }
    registrationForm?.showModal();
  }

  if (user?.isLoggedIn && user?.isLoggedIn()) {
    return (
      <div>
        <p>
          {user.username} &lt;{user.email}&gt;
        </p>
        <button type="button" onClick={logOut}>
          Log Out
        </button>
      </div>
    );
  } else {
    let form: JSX.Element;

    form = <LoginForm setUser={setUser} />;

    return (
      <div>
        {form}
        <button type="button" onClick={showRegister}>
          Register
        </button>
      </div>
    );
  }
}
export default Login;
