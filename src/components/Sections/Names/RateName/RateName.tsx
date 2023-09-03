import { useEffect, useState } from "react";

import { NameType } from "../RandomNameList/RandomNameList";
import { User } from "../../../../types/User";

import "./RateName.css";
import NameSource from "../NameSource/NameSource";
import { fetchUnratedNames, rateName } from "../../../../remote/name";
import { GroupMembershipType } from "../../../../types/Group";

import { setLoading as setNameLoading } from "../NameLoader/NameLoader";
import AwaitedBuffer from "../../../../utility/AwaitedBuffer";
import { Sex } from "../../../../types/Api";
import useStorage from "../../../../hooks/useStorage";

import { GlobalNamesQueue } from "../../../../utility/NamesQueue";

export enum NameRating {
  No = 0,
  Ugh = 0.25,
  Like = 0.75,
  Love = 1,
}

function RateName({ user, group }: { user: User; group: GroupMembershipType }) {
  const [name, setName] = useState<NameType>();

  const [genders, setGenders] = useStorage(
    "genders" + group.group_id,
    Sex.all,
    "local"
  );

  if (!GlobalNamesQueue.names) {
    console.log(GlobalNamesQueue.names);
    GlobalNamesQueue.names = new AwaitedBuffer(async () => {
      return await fetchUnratedNames(group.group_id, user, 18, genders);
    }, 9);
  }
  const namesQueue = GlobalNamesQueue.names;

  useEffect(() => {
    namesQueue.setReload(async () => {
      return await fetchUnratedNames(group.group_id, user, 18, genders);
    });
    next();
  }, [genders]);

  const next = async () => {
    //console.log("next");
    setNameLoading(true);
    setName(await namesQueue.dequeue());
    setNameLoading(false); // Set loading state to false once the fetch is done
  };

  const rate = (rating: NameRating) => {
    if (
      group?.group_id === undefined ||
      user?.user_id === undefined ||
      name === undefined
    )
      return;
    setNameLoading(true);
    const result = rateName(group.group_id, name.name_id, rating, user).then(
      (msg) => {
        if (!msg.success) {
          //TODO : show error to user
          console.error(msg.message);
        }
      }
    );
    next();
  };

  useEffect(() => {
    // Function to fetch data from the API
    console.log("count", namesQueue.count());
    if (namesQueue.count() === 0) {
      next(); // Call the fetch function when the component mounts
    }
  }, []);

  const displaySettings = {
    class: "rate-name",
    genderText: "",
  };

  if (!name) {
    return <></>;
  }

  if (name.female && name.male) {
    displaySettings.class += " unisex";
    displaySettings.genderText = "Unisex";
  } else if (name.female) {
    displaySettings.class += " girl";
    displaySettings.genderText = "Girl";
  } else if (name.male) {
    displaySettings.class += " boy";
    displaySettings.genderText = "Boy";
  }

  return (
    <>
      <div className="rate-settings">
        <label htmlFor="names-for-display">Genders ⬇️</label>
        <input type="checkbox" id="names-for-display" />
        <ul id="names-for-sex">
          <li>
            <input
              type="radio"
              checked={genders === Sex.male}
              onChange={() => {
                setGenders(Sex.male);
              }}
            />
            Boy
          </li>
          <li>
            <input
              type="radio"
              checked={genders === Sex.female}
              onChange={() => {
                setGenders(Sex.female);
              }}
            />
            Girl
          </li>
          <li>
            <input
              type="radio"
              checked={genders === Sex.unisex}
              onChange={() => {
                setGenders(Sex.unisex);
              }}
            />
            Unisex
          </li>
          <li>
            <input
              type="radio"
              checked={genders === Sex.all}
              onChange={() => {
                setGenders(Sex.all);
              }}
            />
            All
          </li>
        </ul>
      </div>
      <div className={displaySettings.class}>
        <div className="name-card">
          <div className="name">{name.name}</div>
          <div>
            <div>
              <strong>Sex</strong> <em>{displaySettings.genderText}</em>
            </div>
            <div>
              <strong>Sources</strong>
              <NameSource name={name} />
            </div>
          </div>
        </div>
        <div className="name-controls">
          <button onClick={() => rate(NameRating.No)}>No</button>
          <button onClick={() => rate(NameRating.Ugh)}>Ugh</button>
          <button
            onClick={() => {
              next();
            }}
          >
            Skip
          </button>
          <button onClick={() => rate(NameRating.Like)}>Like</button>
          <button onClick={() => rate(NameRating.Love)}>Love</button>
        </div>
      </div>
    </>
  );
}

export default RateName;
