export type GroupMembershipType = {
  group_id: number;
  role: string;
  description: string;
  name: string;
};

export const defaultGroup: GroupMembershipType = { "group_id": 1, "role": "participant", "name": "Global Group", "description": "A public village to test out the app" };