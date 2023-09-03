import { GroupMembershipType } from "../../types/Group";
import { PageType } from "../../types/Menu";
import { User } from "../../types/User";
import Names from "./Names/Names";
import Results from "./Results/Results";
import Village from "./Village/Village";

function Sections({
  page,
  user,
  group,
  loggedIn,
}: {
  page: PageType;
  user: User;
  group: GroupMembershipType | null;
  loggedIn: boolean;
}) {
  let sectionContent = <></>;

  if (group) {
    switch (page) {
      case PageType.results: {
        sectionContent = <Results user={user} group={group} />;
        break;
      }
      case PageType.groups: {
        sectionContent = <Village user={user} group={group} />;
        break;
      }
      default: {
        sectionContent = (
          <Names user={user} group={group} loggedIn={loggedIn} />
        );
        break;
      }
    }
  }

  return sectionContent;
}

export default Sections;
