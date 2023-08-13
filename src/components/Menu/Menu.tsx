import { PageType } from "../../types/Menu";
import "./Menu.css";

function Menu({
  setPage,
  page,
}: {
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
  page: PageType;
}) {
  const nav = (navPage: PageType) => setPage(navPage);

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
      </ul>
    </div>
  );
}

export default Menu;
