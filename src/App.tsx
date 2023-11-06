import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Menu from "./components/Menu/Menu";

import GroupInfo from "./components/GroupInfo/GroupInfo";
import Login from "./components/Login/Login";
import RegistrationForm from "./components/Login/RegistrationForm/RegistrationForm";
import Logo from "./components/Logo/Logo";
import Sections from "./components/Sections/Sections";

import { GroupMembershipType, defaultGroup } from "./types/Group";
import { PageType } from "./types/Menu";
import { defaultUser, isLoggedIn, user } from "./types/User";

import useStorage from "./hooks/useStorage";

import CreateGroup from "./components/DialogForms/CreateGroup";
import InviteUserToGroup from "./components/DialogForms/InviteUserToGroup";
import GroupContext from "./contexts/GroupContext";
import LoadingContext from "./contexts/LoadingContext";
import UserContext from "./contexts/UserContext";
import { validate } from "./remote/user";
import { setSetUserFunction } from "./utility/LocalFetch";
//import UserContext from "./utility/UserContext";

function App() {
  const [user, setUser] = useStorage<user>("user", defaultUser, "local");
  setSetUserFunction(setUser);
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

  let conditionalBlock = <RegistrationForm />;

  if (isLoggedIn(user)) {
    conditionalBlock = <CreateGroup groups={groups} setGroups={setGroups} />;
    if (group.role === "admin") {
      conditionalBlock = (
        <>
          <CreateGroup groups={groups} setGroups={setGroups} />
          <InviteUserToGroup />
        </>
      );
    }
  }

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
            {conditionalBlock}
            <footer></footer>
          </LoadingContext.Provider>
        </GroupContext.Provider>
      </span>
    </UserContext.Provider>
  );
}

export default App;
