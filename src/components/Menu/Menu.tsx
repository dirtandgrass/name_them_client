import { useEffect, useState } from "react";
import { PageType } from "../../types/Menu";
import { User } from "../../types/User";
import "./Menu.css";

function Menu({
  setPage,
  page,
  user,
}: {
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
  page: PageType;
  user: User | undefined;
}) {
  const [utilityMenu, setUtilityMenu] = useState<JSX.Element | undefined>(
    <></>
  );

  useEffect(() => {
    buildUtilityMenu();
  }, [user]);

  useEffect(() => {
    buildUtilityMenu();
  }, []);

  const buildUtilityMenu = () => {
    if (user) {
      setUtilityMenu(
        <li
          onClick={() => setPage(PageType.groups)}
          className={page == PageType.groups ? "active" : "inactive"}
        >
          Village
        </li>
      );
    }
  };

  console.log("menu", utilityMenu);

  return (
    <div className="main-menu">
      <ul>
        <li
          onClick={() => setPage(PageType.names)}
          className={page == PageType.names ? "active" : "inactive"}
        >
          Names
        </li>
        <li
          onClick={() => setPage(PageType.results)}
          className={page == PageType.results ? "active" : "inactive"}
        >
          Results
        </li>
        {utilityMenu}
      </ul>
    </div>
  );
}

export default Menu;
