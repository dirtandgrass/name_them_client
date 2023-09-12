
import { VercelRequest, VercelResponse } from '@vercel/node';
import Group, { Role } from '../backend/model/group';
import headerauth from '../backend/middleware/headerauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req;

  if (method === "POST") {

    const { group_id, action, user_id, role, key, name, description, email } = body;

    if (parseInt(group_id) && typeof action === "string") {
      switch (action) {
        case "invite": {
          if (email) {
            const result = await Group.inviteUserByEmail(parseInt(group_id), email, role || "participant");
            res.json(result);
            return;
          } else {
            const result = await Group.inviteUser(parseInt(group_id), parseInt(user_id), role || "participant");
            res.json(result);
            return;
          }
        }
        case "accept": {
          const result = await Group.acceptInvite(parseInt(group_id), key as string);
          res.json(result);
          return;
        }
      }
    }
    await headerauth(req, res);
    const result = await Group.createGroup(name, description);
    res.json(result);
    return;
  } else if (method === "GET") {
    await headerauth(req, res);

    const result = await Group.getGroups();
    res.json(result);
    return;
  }
}
