
import { VercelRequest, VercelResponse } from '@vercel/node';
import User, { UserData } from '../model/user';

export const auth_salt = 6;

export let AuthUser: UserData | null = null;

export default async function (req: VercelRequest, res: VercelResponse) {

  if (req.headers["x-namethem-uid"] && req.headers["x-namethem-sid"] && req.headers["x-namethem-session"]) {

    const result = await User.SessionLogin(parseInt(req.headers["x-namethem-uid"].toString()), parseInt(req.headers["x-namethem-sid"].toString()), req.headers["x-namethem-session"].toString(), true);
    if (result?.user_id) {

      AuthUser = result;
      return;
    } else {
      AuthUser = null;
      return;
    }
  } else if (req.headers["x-namethem-email"] && req.headers["x-namethem-password"]) {
    const result = await User.EmailPasswordLogin(req.headers["x-namethem-email"].toString(), req.headers["x-namethem-password"].toString());
    //console.log(result);
    if (result?.user_id) {
      AuthUser = result;
      return;
    } else {
      AuthUser = null;
      return
    }
  }

  AuthUser = null;
}