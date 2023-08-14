

import { VercelRequest, VercelResponse } from '@vercel/node';
import User, { UserData } from '../backend/model/user';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    // get the list of users
    const result = await User.getUsers();
    res.json(result);
    return;
  } else if (req.method === "POST") {
    const action = req.query?.action;

    switch (action) {
      case "login": {
        if (req.body.user_id && req.body.session_id && req.body.hash) {
          //login with user_id, session_id, and hash

          let extend_session = false;
          if (req.body.extend_session) {
            extend_session = true;
          }

          const result = await User.SessionLogin(parseInt(req.body.user_id), parseInt(req.body.session_id), req.body.hash, extend_session);

          if (result && result.user_id) {
            res.json({ message: "User logged in", success: true, user: result });
            return;
          } else {
            res.json({ message: "User not logged in", success: false });
            return;
          }
        } else if (req.body.login_email && req.body.login_password) {
          //login with email and password
          
          let create_session = false;
          if (req.body.create_session) {
            create_session = true;
          }
          const result = await User.EmailPasswordLogin(req.body.login_email, req.body.login_password);

          // authenticated
          if (result && result.user_id) {
            // create a session
            if (create_session) {

              const session = await User.CreateSession(result.user_id);
              //console.log(session);
              res.json({ message: "User logged in", success: true, user: result, session: session });
              return;
            }

            // don't create a session
            res.json({ message: "User logged in", success: true, user: result });
            return;


          } else {
            // auth failed
            res.json({ message: "User not logged in", success: false });
            return;
          }

        }

        return { message: "User not logged in", success: false };
      }
      case "register": {
        // register a new user
        if (!req.body.register_email || !req.body.register_password || !req.body.register_username) {
          res.json({ message: "User not created", success: false });
          //console.log(req.body);
          return;
        }
        const regResult = await User.Register(req.body.register_username, req.body.register_email, req.body.register_password);

        if (!regResult || !regResult.user) {
          res.json({ message: "User not created", success: false });
          return;
        }

        const user = regResult.user as UserData & { code?: string }


        if (user.email) {
          // TODO: send validation email
          res.json({ code: user.code, message: `User ${regResult.user.username} created, please check your email to validate`, success: true });
          return;
        }

        res.json({ code: user.code, message: `User ${regResult.user.username} created, use code ${user.code} to validate`, success: true });

      }
    }
  } else if (req.method === "PUT") {
    // validate user (email)
    if (!req.query.code || !req.query.user_id) {
      res.json({ message: "No user to validate, or invalid code", success: false });
      return;
    }

    const user_id = parseInt(req.query.user_id.toString());
    const result = await User.ValidateUser(user_id, req.query.code.toString());

    res.json({ message: result.message, success: result.success });

  }
}
