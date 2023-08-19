import "./App.css";
import { useEffect, useMemo, useState } from "react";
import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import Logo from "./components/Logo/Logo";
import RegistrationForm from "./components/Login/RegistrationForm/RegistrationForm";
import GroupInfo from "./components/GroupInfo/GroupInfo";
import Sections from "./components/Sections/Sections";

import { User, defaultUser } from "./types/User";
import { PageType } from "./types/Menu";
import { GroupMembershipType, defaultGroup } from "./types/Group";

import useStorage from "./hooks/useStorage";

import { validate } from "./remote/user";
import GlobalLoadingContext from "./utility/GlobalLoadingContext";
//import UserContext from "./utility/UserContext";

function App() {
  const [user, setUser] = useStorage<User>("user", defaultUser, "local");
  const [group, setGroup] = useStorage<GroupMembershipType>(
    "group",
    defaultGroup,
    "local"
  );
  const [page, setPage] = useStorage<PageType>("page", PageType.names, "local");

  const [loggedIn, setLoggedIn] = useState<boolean>(
    (user?.isLoggedIn && user?.isLoggedIn()) ?? false
  );

  const [globalLoading, setGlobalLoading] = useState<boolean>(false); // state for glocal loading context
  const loadingValue = useMemo(
    () => ({ globalLoading, setGlobalLoading }),
    [globalLoading]
  ); // sets the default loading context value (esp setLoading)

  useEffect(() => {
    setLoggedIn((user?.isLoggedIn && user?.isLoggedIn()) ?? false);
  }, [user]);

  useEffect(() => {
    const query = Object.fromEntries(new URLSearchParams(location.search));

    if (query.code && query.user_id) {
      // validate user
      validateUser(parseInt(query.user_id), query.code);
    }
  }, []);

  const validateUser = async (
    user_id: number,
    code: string
  ): Promise<boolean> => {
    const validated = await validate(user_id, code);

    if (validated.success) {
      window.history.replaceState(null, document.title, "/");
    }

    // TODO: OTHERWISE SHOW ERROR

    return validated.success;
  };

  return (
    <GlobalLoadingContext.Provider value={loadingValue}>
      <div
        className={
          loadingValue.globalLoading
            ? "global-loading gl-active"
            : "global-loading gl-stopped"
        }
      >
        Loading...
      </div>

      <header className="App-header">
        <Logo />

        <div className="login">
          <Login
            user={user}
            setUser={setUser}
            setPage={setPage}
            setGroup={setGroup}
          />
          {loggedIn ? (
            <GroupInfo user={user} group={group} setGroup={setGroup} />
          ) : (
            <></>
          )}
        </div>
        <Menu setPage={setPage} page={page} user={user} />
      </header>
      <main>
        <Sections page={page} user={user} group={group} loggedIn={loggedIn} />
      </main>
      <RegistrationForm />
      <footer></footer>
    </GlobalLoadingContext.Provider>
  );
}

export default App;
