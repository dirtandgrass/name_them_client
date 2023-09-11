import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import Logo from "./components/Logo/Logo";
import RegistrationForm from "./components/Login/RegistrationForm/RegistrationForm";
import GroupInfo from "./components/GroupInfo/GroupInfo";
import Sections from "./components/Sections/Sections";

import { user, defaultUser, isLoggedIn } from "./types/User";
import { PageType } from "./types/Menu";
import { GroupMembershipType, defaultGroup } from "./types/Group";

import useStorage from "./hooks/useStorage";

import { validate } from "./remote/user";
import LoadingContext from "./utility/LoadingContext";
import CreateGroup from "./components/DialogForms/CreateGroup";
import GroupContext from "./utility/GroupContext";
import UserContext from "./utility/UserContext";
//import UserContext from "./utility/UserContext";

function App() {
  const [user, setUser] = useStorage<user>("user", defaultUser, "local");
  const [group, setGroup] = useStorage<GroupMembershipType>(
    "group",
    defaultGroup,
    "local"
  );
  const [page, setPage] = useStorage<PageType>("page", PageType.names, "local");
  const [groups, setGroups] = useState<GroupMembershipType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadingValue = useMemo(() => ({ loading, setLoading }), [loading]);

  useEffect(() => {
    const query = Object.fromEntries(new URLSearchParams(location.search));

    if (query.code && query.user_id) {
      validateUser(parseInt(query.user_id), query.code);
    }
  }, []);

  const validateUser = useCallback(async (user_id: number, code: string) => {
    const validated = await validate(user_id, code);
    if (validated.success) {
      window.history.replaceState(null, document.title, "/");
    }

    return validated.success;
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <span className={isLoggedIn(user) ? "logged-in" : "logged-out"}>
        <GroupContext.Provider value={{ group, setGroup }}>
          <LoadingContext.Provider value={loadingValue}>
            <div
              className={`global-loading ${
                loadingValue.loading ? "gl-active" : "gl-stopped"
              }`}
            >
              Loading...
            </div>

            <header className="App-header">
              <Logo />

              <div className="login">
                <Login setPage={setPage} />
                {isLoggedIn(user) && group ? (
                  <GroupInfo setGroups={setGroups} groups={groups} />
                ) : null}
              </div>
              <Menu setPage={setPage} page={page} />
            </header>
            <main>
              <Sections page={page} />
            </main>
            {isLoggedIn(user) ? (
              <CreateGroup groups={groups} setGroups={setGroups} />
            ) : (
              <RegistrationForm />
            )}
            <footer></footer>
          </LoadingContext.Provider>
        </GroupContext.Provider>
      </span>
    </UserContext.Provider>
  );
}

export default App;
