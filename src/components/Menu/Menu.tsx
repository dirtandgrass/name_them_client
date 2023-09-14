import { useContext, useEffect, useState } from "react";
import { PageType } from "../../types/Menu";
import "./Menu.css";
import UserContext from "../../utility/UserContext";

function Menu({
  setPage,
  page,
}: {
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
  page: PageType;
}) {
  const { user } = useContext(UserContext);

  const utilityMenu =
    user.user_id > 0 ? (
      <>
        <li
          onClick={() => setPage(PageType.groups)}
          className={page == PageType.groups ? "active" : "inactive"}
        >
          Village
        </li>{" "}
        <li
          onClick={() => setPage(PageType.results)}
          className={page == PageType.results ? "active" : "inactive"}
        >
          Results
        </li>
      </>
    ) : (
      <></>
    );
  return (
    <div className="main-menu">
      <ul>
        <li
          onClick={() => setPage(PageType.names)}
          className={page == PageType.names ? "active" : "inactive"}
        >
          Vote
        </li>

        {utilityMenu}
      </ul>
    </div>
  );
}

export default Menu;
