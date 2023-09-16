import { useContext, useState } from "react";
import GroupContext from "../../../utility/GroupContext";
import UserContext from "../../../utility/UserContext";
import VillageInfo from "./VillageInfo/VillageInfo";
import Villages from "./Villages/Villages";

enum VillageTabs {
  VillageInfo = "VillageInfo",
  Villages = "Villages",
}

function Village() {
  const [villageTabs, setVillageTabs] = useState<VillageTabs>(
    VillageTabs.VillageInfo
  );

  let outTab = <></>;

  switch (villageTabs) {
    case VillageTabs.VillageInfo:
      outTab = <VillageInfo />;
      break;
    case VillageTabs.Villages:
      outTab = <Villages />;
      break;
  }

  return (
    <section className="village-section">
      <menu className="village-tabs">
        <ul>
          <li>
            <a onClick={() => setVillageTabs(VillageTabs.VillageInfo)}>
              Selected Village
            </a>
          </li>
          <li>
            <a onClick={() => setVillageTabs(VillageTabs.Villages)}>
              My Villages
            </a>
          </li>
        </ul>
      </menu>
      {outTab}
    </section>
  );
}

export default Village;
