import { PrismaClient } from '@prisma/client'
import { AuthUser } from '../middleware/headerauth';
import { randomHash } from '../utility/randomHash';
import { response } from '../types/ApiMessage';
import { z } from 'zod'
const prisma = new PrismaClient()


export type Role = "admin" | "participant";

export default class Group {



  static async createGroup(name: string, description: string): Promise<response & { group_id?: number, group?: { name: string, description: string, user_id: number, role: Role, accepted: boolean } }> {

    const user_id = AuthUser?.user_id || 0;

    if (user_id === 0) return { "message": "not logged in", "success": false, "error": 401 };


    let group_id = 0;

    try {
      const result = await prisma.group.create({ data: { name: name, description: description, created_user_id: user_id } });
      group_id = result.group_id;



    } catch (e) {
      //console.log(e);
      return { "message": "unable to create group", "success": false };
    }


    try {
      await prisma.group_user.create({ data: { group_id, user_id, role: "admin", accepted: true } });

    } catch (e) {
      console.log(e);
      return { "message": "created group but unable to assign admin", "success": false, "group_id": group_id };
    }


    return { "message": "success", "success": true, "group_id": group_id, "group": { name: name, description: description, user_id, role: "admin", accepted: true } };


  }


  static async inviteUserByEmail(group_id: number, email: string, role: Role = "participant"): Promise<response> {
    const user_id = AuthUser?.user_id || 0;

    //return { message: "not implemented: " + AuthUser?.user_id, success: false };


    if (user_id === 0) return { "message": "not logged in", "success": false, error: 401 };

    const emailSchema = z.string().email().toLowerCase().trim();

    const p_result = emailSchema.safeParse(email);
    if (!p_result.success) return { "message": `invalid email ${p_result.error}`, "success": false };

    //try {
    const lookup = await prisma.user.findFirst({ where: { email: p_result.data }, select: { user_id: true } });
    console.log(lookup);
    //} catch (e) {

    //}

    return { message: "success", success: true, data: lookup };

  }

  static async inviteUser(group_id: number, guest_user_id: number, role: Role = "participant"): Promise<response> {
    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false, error: 401 };
    if (!Number.isInteger(group_id) || !Number.isInteger(guest_user_id)) {
      return { "message": "invalid data", "success": false };
    }


    try {
      const lookup = await prisma.group.findFirst({ where: { group_id: group_id, created_user_id: user_id } });
      console.log(lookup);
    } catch (e) {
      console.log(e);
      return { "message": "unable to invite user, you must be the owner/creator of the group to invite", "success": false };
    }
    const invite_key = randomHash();



    try {
      await prisma.group_user.create({ data: { group_id, user_id: guest_user_id, invite_key, role } });
      // TODO: send invite email

    } catch (e) {
      console.log(e);
      return { "message": "unable to invite user", "success": false };
    }

    return { "message": "success", "success": true };
  }

  static async acceptInvite(group_id: number, invite_key: string): Promise<response> {
    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false, "error": 401 };

    if (!Number.isInteger(group_id)) return { "message": "invalid data", "success": false };

    //console.log(group_id, user_id, invite_key);
    try {
      const result = await prisma.group_user.update({
        where: {
          group_id_user_id: {
            group_id: group_id, user_id: user_id
          },
          invite_key: invite_key,
          accepted: false
        },
        data: { accepted: true }
      });
    } catch (e) {
      //console.log("attempt to accept invite failed, invalid key or already accepted");
      return { "message": "attempt to accept invite failed, invalid key or already accepted", "success": false };
    }

    return { "message": "success", "success": true };

  }

  // static async getOwnedGroups(): Promise<{ message: string, count?: number, data?: Record<string, unknown>[], success: boolean }> {
  //   const user_id = AuthUser?.user_id || 0;
  //   if (user_id === 0) return { "message": "not logged in", "success": false };

  //   try {
  //     const result = await prisma.group.findMany({ where: { created_user_id: user_id } });
  //     return { "message": "success", "success": true, "count": result.length, "data": result };
  //   } catch (e) {
  //     console.log(e);
  //     return { "message": "unable to get groups", "success": false };
  //   }

  // }

  /* get groups the user is a member of, returns group_id, name, description, role */
  static async getGroups(): Promise<response> {

    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false, "error": 401 };

    try {
      const result = await prisma.group_user.findMany({ where: { user_id: user_id }, select: { role: true, group_id: true, group: { select: { name: true, description: true } } } });
      return { "message": "success", "success": true, "data": result };
    } catch (e) {
      //console.log(e);```
      return { "message": "unable to get groups", "success": false };
    }


  }

  /* determine if a user is a member of a group */
  static async isMember(group_id: number): Promise<response & { isMember: boolean }> {
    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", isMember: false, "success": false, error: 401 };


    try {
      const result = await prisma.group_user.findFirst({ where: { group_id: group_id, user_id: user_id } });

      if (result === null) return { "message": "not a member", isMember: false, "success": true };
      return { "message": "is a member", isMember: true, "success": true };
    } catch (e) {
      //console.log(e);
      return { "message": "unable to get groups", isMember: false, "success": false };
    }

  }

}