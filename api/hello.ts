import type { VercelRequest, VercelResponse } from '@vercel/node'
import headerauth, { AuthUser } from '../backend/middleware/headerauth'

export default async function handler(req: VercelRequest, res: VercelResponse) {


  await headerauth(req, res);



  const name = AuthUser?.username || 'World';

  return res.json({
    message: `Hello ${name}!`,
  })
}