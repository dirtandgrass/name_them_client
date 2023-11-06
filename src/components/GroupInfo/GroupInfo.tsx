import React, { useContext, useEffect, useState } from "react";
import GroupContext from "../../contexts/GroupContext";
import UserContext from "../../contexts/UserContext";
import { GroupMembershipType } from "../../types/Group";
import { isLoggedIn } from "../../types/User";
import localFetch from "../../utility/LocalFetch";

export default function GroupInfo({
  groups,
  setGroups,
}: {
  groups: GroupMembershipType[];
  setGroups: React.Dispatch<React.SetStateAction<GroupMembershipType[]>>;
}) {
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const { group, setGroup } = useContext(GroupContext);
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn(user)) return;
      setLoading(true);
      try {
        const response = await localFetch({
          path: "group/",
          user: user,
        });

        const data = response as any;

        if (data?.data && Array.isArray(data.data)) {
          const rData: GroupMembershipType[] = data.data.map((r: any) => {
            return {
              group_id: r.group_id,
              role: r.role,
              name: r.group?.name,
              description: r.group?.description,
            };
          });
          setGroups(rData); // Set the fetched data in the state
        }
      } catch (error: unknown) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchData(); // Call the fetch function when the component mounts
  }, [user]);

  useEffect(() => {
    if (groups.length > 0 && group) {
      setGroup(groups.find((g) => g.group_id === group.group_id) || groups[0]);
    }
  }, [group]);

  function selectedGroupChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedGroup = groups.find(
      (g) => g.group_id + "" === e.target.value
    );
    if (selectedGroup && selectedGroup !== group) {
      setGroup(selectedGroup);
    }
  }

  if (loading) return <div className="group-info">Loading...</div>;

  if (!isLoggedIn(user)) return <></>;

  return (
    <div className="group-info">
      <div>Village:</div>
      <select
        name="group-select"
        onChange={selectedGroupChange}
        value={group?.group_id}
      >
        {groups.map((g) => {
          return (
            <option key={g.group_id} value={g.group_id}>
              {g.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
