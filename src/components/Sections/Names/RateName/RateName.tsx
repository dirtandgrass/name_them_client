import React, { useEffect, useState } from "react";

import { NameType } from "../RandomNameList/RandomNameList";
import { User } from "../../../../types/User";

import "./RateName.css";
import NameSource from "../NameSource/NameSource";
import { fetchName, rateName } from "../../../../remote/name";
import { GroupMembershipType } from "../../../../types/Group";

export enum NameRating {
  No = 0,
  Ugh = 0.25,
  Like = 0.75,
  Love = 1,
}

function RateName({
  user,
  group,
}: {
  user: User;
  group: GroupMembershipType | undefined;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<NameType>();

  const next = async () => {
    if (group?.group_id === undefined || user?.user_id === undefined) return;
    setLoading(true);
    setName((await fetchName(group.group_id, user)) ?? undefined);
    setLoading(false); // Set loading state to false once the fetch is done
  };

  const rate = async (rating: NameRating) => {
    if (
      group?.group_id === undefined ||
      user?.user_id === undefined ||
      name === undefined
    )
      return;
    setLoading(true);
    const result = await rateName(group.group_id, name.name_id, rating, user);

    console.log(result);
    if (result.success) {
      next();
    } else {
      console.error(result.message);
    }
    setLoading(false); // Set loading state to false once the rating is done
  };

  useEffect(() => {
    // Function to fetch data from the API
    next(); // Call the fetch function when the component mounts
  }, []);

  if (!user) {
    return <></>;
  }
  const displaySettings = {
    class: "rate-name",
    genderText: "",
  };
  if (loading) {
    return <div className="loading">Grabbing another name...</div>;
  }

  if (!name) {
    return <div>No names to rate</div>;
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
  );
}

export default RateName;
