import type { VercelRequest, VercelResponse } from '@vercel/node'
import headerauth, { AuthUser } from '../backend/middleware/headerauth'
import mailer from '../backend/utility/mailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {


  await headerauth(req, res);


  const sent = await mailer("verdant.luke@gmail.com", "test", "test")

  const name = AuthUser?.username || 'World';

  return res.json({
    message: `Hello ${name}!`, sent,
  })
}