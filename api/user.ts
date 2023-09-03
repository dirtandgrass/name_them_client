

import { VercelRequest, VercelResponse } from '@vercel/node';
import User, { UserData } from '../backend/model/user';
import mailer from '../backend/utility/mailer';

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
        if (!req.body.email || !req.body.password || !req.body.username) {
          res.json({ message: "User not created", success: false });
          //console.log(req.body);
          return;
        }
        const regResult = await User.Register(req.body.username, req.body.email, req.body.password);

        if (!regResult || !regResult.user) {
          res.json({ message: "User not created: user already exists", success: false });
          return;
        }

        const user = regResult.user as UserData & { validation_code?: string }

        console.log("User created", user)
        if (user.email) {
          const host = process.env.EMAIL_URL || "http://localhost:3000";
          const sent = await mailer(user.email, "Validate your account", `Please validate your account by clicking this link: ${host}/validate?user_id=${user.user_id}&code=${user.validation_code}`)


          res.json({ code: user.validation_code, message: `User ${regResult.user.username} created, please check your email to validate`, success: true });
          return;
        }

        res.json({ code: user.validation_code, message: `User ${regResult.user.username} created, use code ${user.validation_code} to validate`, success: true });

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
