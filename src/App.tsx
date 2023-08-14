import "./App.css";

import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import { User, defaultUser } from "./types/User";
import useStorage from "./hooks/useStorage";
import Logo from "./components/Logo/Logo";
import RegistrationForm from "./components/Login/RegistrationForm/RegistrationForm";
import { useEffect, useState } from "react";
import Names from "./components/Sections/Names/Names";
import { GroupMembershipType, defaultGroup } from "./types/Group";
import GroupInfo from "./components/GroupInfo/GroupInfo";
import Results from "./components/Sections/Results/Results";
import { validate } from "./remote/user";
import { PageType } from "./types/Menu";
import Sections from "./components/Sections/Sections";

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

  useEffect(() => {
    setLoggedIn((user?.isLoggedIn && user?.isLoggedIn()) ?? false);
  }, [user]);

  useEffect(() => {
    const query = Object.fromEntries(new URLSearchParams(location.search));

    if (query.code && query.user_id) {
      validateUser(parseInt(query.user_id), query.code);
    }

    console.log(query);
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
    <>
      <header className="App-header">
        <Logo />

        <div className="login">
          <Login user={user} setUser={setUser} setPage={setPage} />
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
    </>
  );
}

export default App;
