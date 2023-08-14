
import Name, { Sex, NameParams } from '../backend/model/name';
import headerauth, { AuthUser } from '../backend/middleware/headerauth';
import Group from '../backend/model/group';
import { VercelRequest, VercelResponse } from '@vercel/node';


let parseSourceandSex = (req: VercelRequest): NameParams => {
  const queryParams: NameParams = {};

  if (AuthUser) {
    if (req.query?.count) { // querystring specified count
      queryParams.count = parseInt(req.query.count.toString()) || 5;
    }

    if (req.query?.sex) { // querystring specified count
      const qs = req.query.sex.toString();
      //console.log("QS:", qs);
      queryParams.sex = qs as Sex || undefined;
    }

    if (req.query?.source_ids) { // querystring specified source_ids

      // allow comma-separated list of source_ids
      if (typeof (req.query.source_ids) === "string" && req.query.source_ids.indexOf(',') > -1) {
        req.query.source_ids = req.query.source_ids.split(',');
      }

      if (Array.isArray(req.query.source_ids)) {
        queryParams.source_ids = req.query.source_ids.map((id) => parseInt(id.toString()) || 1);
      } else {
        queryParams.source_ids = parseInt(req.query.source_ids.toString()) || 1;
      }
    }
  } else {
    queryParams.count = 5;

  }

  return queryParams;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method === "GET") {
    const action = req.query?.action;

    switch (action) {
      case "similar": {
        if (req.body?.id && parseInt(req.body.id)) {
          const result = await Name.getSimilarNamesForId(parseInt(req.body.id));
          res.json(result);
          return;
        } else if (req.body?.name) {
          const result = await Name.getSimilarNames(req.body.name);
          res.json(result);
          return;
        }
        res.json({ message: "no name or id specified", success: false });
        return;

      } case "unrated": {

        await headerauth(req, res);
        if (!AuthUser || !AuthUser.user_id) { res.json({ message: "not logged in", success: false }); return; }

        if (!req.query.group_id) { res.json({ message: "no group_id specified", success: false }); return; }
        const group_id = parseInt(req.query.group_id?.toString());

        const { isMember } = await Group.isMember(group_id);

        if (!isMember) { res.json({ message: "not a member of this group", success: false }); return; }

        const { sex, source_ids } = parseSourceandSex(req);
        const result = await Name.getRandomUnratedName(AuthUser.user_id, group_id, sex, source_ids);
        res.json(result);
        return;
      }

      default: {
        const queryParams = parseSourceandSex(req);
        const result = await Name.getRandomNames(queryParams);

        res.json(result);
        return;
      }
    }
  }
}
