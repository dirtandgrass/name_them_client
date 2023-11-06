import { useContext } from "react";
import GroupContext from "../../contexts/GroupContext";
import UserContext from "../../contexts/UserContext";
import { PageType } from "../../types/Menu";
import Names from "./Names/Names";
import Results from "./Results/Results";
import "./Sections.css";
import Village from "./Village/Village";

function Sections({ page }: { page: PageType }) {
  const { user } = useContext(UserContext);
  let sectionContent = <></>;
  const { group } = useContext(GroupContext);
  if (group.group_id > 0) {
    switch (page) {
      case PageType.results: {
        sectionContent = <Results />;
        break;
      }
      case PageType.groups: {
        sectionContent = <Village />;
        break;
      }
      default: {
        sectionContent = <Names />;
        break;
      }
    }
  }

  return sectionContent;
}

export default Sections;
