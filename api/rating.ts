
import { VercelRequest, VercelResponse } from '@vercel/node';
import Rating from '../backend/model/rating';
import headerauth, { AuthUser } from '../backend/middleware/headerauth';
import { Sex } from '../backend/model/name';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await headerauth(req, res);
  // a user is required for rating functionality
  if (!AuthUser || !AuthUser.user_id) { res.json({ message: "not logged in", success: false, error: 401 }); return; }
  const name_id = parseInt(req.query.name_id as string);




  if (req.method === "POST") {

    // rate name in a group
    // body: name_id, rating, group_id
    const result = await Rating.rateName(name_id, req.body.rating, req.body.group_id);
    res.json(result);
    return;

  } else if (req.method === "GET") {


    const { group_id, action = undefined, count = undefined, sex = Sex.all } = req.query;
    // get top rated names
    if (action === "top") {
      const result = await Rating.getTopRatedNames(parseInt(group_id as string), parseInt(count as string) ?? undefined, sex as Sex | undefined);

      res.json(result);
      return;
    }

    // get rating for name
    const result = await Rating.getRating(name_id, req.body?.group_id);
    res.json(result);
    return;
  }

}
