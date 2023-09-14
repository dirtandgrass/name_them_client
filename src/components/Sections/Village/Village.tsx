import { useContext } from "react";
import GroupContext from "../../../utility/GroupContext";
import UserContext from "../../../utility/UserContext";
import VillageInfo from "./VillageInfo/VillageInfo";

function Village() {
  return (
    <section className="village-section">
      <VillageInfo />
    </section>
  );
}

export default Village;
