import { useState } from "react";
import "./Village.css";
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
          <li
            onClick={() => setVillageTabs(VillageTabs.VillageInfo)}
            className={
              villageTabs == VillageTabs.VillageInfo ? "active" : "inactive"
            }
          >
            Selected Village
          </li>
          <li
            onClick={() => setVillageTabs(VillageTabs.Villages)}
            className={
              villageTabs == VillageTabs.Villages ? "active" : "inactive"
            }
          >
            My Villages
          </li>
        </ul>
      </menu>
      {outTab}
    </section>
  );
}

export default Village;
