import { PrismaClient } from '@prisma/client'
import headerauth, { AuthUser } from '../middleware/headerauth';
import { randomHash } from '../utility/randomHash';
const prisma = new PrismaClient()


export type Role = "admin" | "participant";

export default class Group {



  static async createGroup(name: string, description: string): Promise<{ message: string, success: boolean, group_id?: number }> {

    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false };


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


    return { "message": "success", "success": true, "group_id": group_id };


  }



  static async inviteUser(group_id: number, guest_user_id: number, role: Role = "participant"): Promise<{ message: string, success: boolean }> {
    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false };
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

  static async acceptInvite(group_id: number, invite_key: string): Promise<{ message: string, success: boolean }> {
    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false };

    if (!Number.isInteger(group_id)) return { "message": "invalid data", "success": false };

    console.log(group_id, user_id, invite_key);
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
  static async getGroups(): Promise<{ message: string, count?: number, data?: Record<string, unknown>[], success: boolean }> {

    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false };

    try {
      const result = await prisma.group_user.findMany({ where: { user_id: user_id }, select: { role: true, group_id: true, group: { select: { name: true, description: true } } } });
      return { "message": "success", "success": true, "count": result.length, "data": result };
    } catch (e) {
      //console.log(e);
      return { "message": "unable to get groups", "success": false };
    }


  }

  /* determine if a user is a member of a group */
  static async isMember(group_id: number): Promise<{ message: string, isMember: boolean, success: boolean }> {
    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", isMember: false, "success": false };


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