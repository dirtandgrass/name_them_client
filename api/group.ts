
import { VercelRequest, VercelResponse } from '@vercel/node';
import Group, { Role } from '../backend/model/group';
import headerauth from '../backend/middleware/headerauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    if (parseInt(req.body.group_id) && typeof (req.body.action) == "string") {
      switch (req.body.action) {
        case "invite": {
          const role: Role = req.body.role || "participant";
          const result = await Group.inviteUser(parseInt(req.body.group_id), parseInt(req.body.user_id), role);
          res.json(result);
          return;
        }
        case "accept": {
          const key = req.body.key as string;
          const group_id = parseInt(req.body.group_id);
          const result = await Group.acceptInvite(group_id, key);
          res.json(result);
          return;
        }
      }

    }
    const result = await Group.createGroup(req.body.name, req.body.description);
    res.json(result);
    return;
  } else if (req.method === "GET") {
    await headerauth(req, res);

    const result = await Group.getGroups();
    res.json(result);
    return;
  }
}
