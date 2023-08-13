export type GroupMembershipType = {
  group_id: number;
  role: string;
  description: string;
  name: string;
};

export const defaultGroup: GroupMembershipType = { group_id: -1, role: "", description: "", name: "" };