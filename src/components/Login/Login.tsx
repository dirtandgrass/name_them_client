import { defaultUser, isLoggedIn } from "../../types/User";
import "./Login.css";

import { useContext, useEffect } from "react";
import GroupContext from "../../contexts/GroupContext";
import UserContext from "../../contexts/UserContext";
import { defaultGroup } from "../../types/Group";
import { PageType } from "../../types/Menu";
import LoginForm from "./LoginForm/LoginForm";

function Login({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
}) {
  const { user, setUser } = useContext(UserContext);
  const { setGroup } = useContext(GroupContext);
  useEffect(() => {
    if (!user || !isLoggedIn(user)) {
      logOut();
      setPage(PageType.names);
      return;
    }
  }, []);

  let registrationForm = document.getElementById(
    "registration-form"
  ) as HTMLDialogElement;

  function logOut() {
    setUser(defaultUser);
    setGroup(defaultGroup);
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

  if (isLoggedIn(user)) {
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

    form = <LoginForm />;

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
