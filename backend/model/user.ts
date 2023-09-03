import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { auth_salt } from '../middleware/headerauth';
import { randomHash } from '../utility/randomHash';
import { response } from '../types/ApiMessage';

const prisma = new PrismaClient()


export type UserData = {
  user_id?: number;
  username?: string;
  email?: string;
  message: string;
  success: boolean;
}


export default class User {



  static async getUsers(): Promise<{ count: number, data: User[] }> {

    const users = await prisma.user.findMany(
      { orderBy: { username: 'asc' } }
    );
    const resultObj = { count: users.length, data: users }
    return resultObj;
  }


  static async Register(username: string, email: string, password: string): Promise<response & { user?: UserData, code?: string }> {

    //console.log("Register", username, email, password);
    const salt = bcrypt.genSaltSync(auth_salt);
    const hash = bcrypt.hashSync(password, salt);
    const validation_code = randomHash();

    let user: User | null = null;
    try {
      user = await prisma.user.create(
        {
          data: {
            username: username,
            email: email,
            hash: hash,
            validation_code: validation_code
          }
        }
      );
    } catch (error) {

      return { message: (error as Error).message, success: false };
    }


    const resUser = user as UserData;

    // join default group
    try {
      await prisma.group_user.create({ data: { group_id: 1, user_id: resUser.user_id, accepted: true } });
    } catch (error) {
      return { user: resUser, code: validation_code, message: "User created, but unable to join default group", success: false };
    }
    return { user: resUser, code: validation_code, message: "User created", success: true };
  }


  static async ValidateUser(user_id: number, code: string): Promise<{ message: string, user?: User, success: boolean }> {



    try {
      const user = await prisma.user.update(
        { where: { user_id: user_id, validation_code: code, validated: false }, data: { validated: true, validation_code: null } }
      );
      return { user: user, message: "User validated", success: true };
    } catch (error) {
      return { message: "User not validated", success: false };
    }




  }

  static async EmailPasswordLogin(email: string, password: string): Promise<response & { user_id?: number, username?: string, email?: string }> {

    const user = await prisma.user.findFirst(
      { where: { email: email } }
    );

    if (user === null) return { message: "User not logged in", success: false };
    const isMatch = bcrypt.compareSync(password, user.hash);
    if (!isMatch) return { message: "User not logged in", success: false }

    return { user_id: user.user_id, username: user.username, email: user.email, message: "User logged in", success: true };
  }

  static async SessionLogin(user_id: number, session_id: number, user_hash: string, extend: boolean = false): Promise<response & { user_id?: number, username?: string, email?: string }> {

    const session = await prisma.session.findFirst(
      { where: { session_id: session_id, user_id: user_id, expires: { gt: new Date() } } }
    );

    if (session === null) return { message: "User not logged in", success: false };
    const isMatch = bcrypt.compareSync(user_hash, session.hash);

    if (!isMatch) return { message: "User not logged in", success: false }

    const userInfo = await User.GetUser(user_id);
    if (!userInfo.success) return { message: "User not logged in", success: false };


    if (extend) {
      await prisma.session.update({ where: { session_id: session_id }, data: { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) } })
    }


    return { user_id: user_id, username: userInfo.username, message: "User logged in", success: true };
  }


  static async GetUser(user_id: number): Promise<response & { user_id?: number, username?: string, email?: string }> {

    const user = await prisma.user.findFirst(
      { where: { user_id: user_id } }
    );

    if (user === null) return { message: "User not found", success: false };

    return { user_id: user.user_id, username: user.username, email: user.email, message: "User found", success: true };
  }

  static async CreateSession(user_id: number): Promise<response & { session?: string, session_id?: number }> {

    const user_hash = randomHash();
    const hash = bcrypt.hashSync(user_hash, auth_salt);

    const session = await prisma.session.create(
      { data: { user_id: user_id, hash } }
    );

    if (session == null) return { message: "Session not started", success: false };

    return { message: "Session started", success: true, session: user_hash, session_id: session.session_id };
  }

}
