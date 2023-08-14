import "./App.css";

import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import { User, defaultUser } from "./types/User";
import useStorage from "./hooks/useStorage";
import Logo from "./components/Logo/Logo";
import RegistrationForm from "./components/Login/RegistrationForm/RegistrationForm";
import GroupInfon from "./components/GroupInfo/GroupInfo";
import { useEffect, useState } from "react";
import Names from "./components/Sections/Names/Names";
import { GroupMembershipType, defaultGroup } from "./types/Group";
import GroupInfo from "./components/GroupInfo/GroupInfo";
import Results from "./components/Sections/Results/Results";

enum PageType {
  names,
  results,
}

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

  let sectionContent = <></>;

  switch (page) {
    case PageType.results: {
      sectionContent = <Results user={user} group={group} />;
      break;
    }
    default: {
      sectionContent = <Names user={user} group={group} loggedIn={loggedIn} />;
      break;
    }
  }

  return (
    <>
      <header className="App-header">
        <Logo />

        <div className="login">
          <Login user={user} setUser={setUser} />
          {loggedIn ? (
            <GroupInfo user={user} group={group} setGroup={setGroup} />
          ) : (
            <></>
          )}
        </div>
        <Menu setPage={setPage} page={page} />
      </header>
      <main>{sectionContent}</main>
      <RegistrationForm />
      <footer></footer>
    </>
  );
}

export default App;
