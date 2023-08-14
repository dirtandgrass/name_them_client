
import { VercelRequest, VercelResponse } from '@vercel/node';
import Source from '../backend/model/source';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    if (req.query?.name_id) {
      // get sources for a given name
      // ?name_id
      //console.log(req.query)
      const result = await Source.getSourcesForNameId(parseInt(req.query.name_id.toString()));
      res.json(result);
      return;
    } else {
      // get all sources
      const result = await Source.getSources();
      res.json(result);
      return;
    }
  }

}
