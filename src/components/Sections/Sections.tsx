import { GroupMembershipType } from "../../types/Group";
import { PageType } from "../../types/Menu";
import { user } from "../../types/User";
import Names from "./Names/Names";
import Results from "./Results/Results";
import Village from "./Village/Village";
import "./Sections.css";
import GroupContext from "../../utility/GroupContext";
import { useContext } from "react";
import UserContext from "../../utility/UserContext";

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
