import { PrismaClient } from '@prisma/client'
import { AuthUser } from '../middleware/headerauth'
import Group from './group';
import { Sex } from './name';
import { response } from '../types/ApiMessage';

const prisma = new PrismaClient()

export type ratingResult = { name_id: number, name: string, rating: number, male: boolean, female: boolean, avg_rating: number };

export default class Rating {
  static async getTopRatedNames(group_id: number = 1, count: number = 5, sex: Sex = Sex.all): Promise<response & { sex?: Sex }> {
    const user_id = AuthUser?.user_id || 0;

    if (user_id === 0) return { "message": "not logged in", "success": false, error: 401 };

    if (!Number.isInteger(group_id) || !Number.isInteger(count) || count < 1) {
      return { "message": "invalid data", "success": false };
    }

    if (!(await Group.isMember(group_id)).isMember) return { "message": "not a member of this group", "success": false };

    let sex_clause: string = "";
    switch (sex) {
      case (Sex.male): {
        sex_clause = "and n.male = true ";
        break;
      }
      case (Sex.female): {
        sex_clause = "and n.female = true ";
        break;
      }
      case (Sex.unisex): {
        sex_clause = "and (n.male = true and n.female = true) "
      }
    }
    const query = `select n."name",n.name_id,n.male,n.female,avg(rating) as avg_rating from rating r join "name" n on n.name_id = r.name_id  where group_id=${group_id} ${sex_clause}group by n.name_id order by avg_rating desc limit ${count}`;

    const ratings: ratingResult[] = await prisma.$queryRawUnsafe(query);


    return { "message": "success", "success": true, "data": ratings, sex };

  }
  static async rateName(name_id: number, rating: number, group_id: number = 1): Promise<response> {

    const user_id = AuthUser?.user_id || 0;

    if (user_id === 0) return { "message": "not logged in", "success": false, error: 401 };

    if (!Number.isInteger(name_id) || rating > 1 || rating < 0 || (!Number.isInteger(group_id) && group_id)) {
      return { "message": "invalid data", "success": false };
    }


    try {
      await prisma.rating.upsert({
        where: { user_id_name_id_group_id: { name_id, user_id, group_id } },
        update: { rating },
        create: { name_id, user_id, group_id, rating }
      });
    } catch (e) {
      console.log(e);
      return { "message": "unable to update rating", "success": false };
    }
    return { "message": "success", "success": true };
  }

  static async getRating(name_id: number, group_id: number = 1): Promise<response & { rating?: number }> {
    const user_id = AuthUser?.user_id || 0;

    if (user_id === 0) return { "message": "not logged in", "success": false, error: 401 };
    try {
      const result = await prisma.rating.findFirst({ where: { name_id, user_id, group_id } });
      if (result === null) return { "message": "no rating found", "success": false };
      return { "message": "success", "success": true, rating: result.rating as unknown as number };
    } catch (e) {
      console.log(e);
      return { "message": "unable to get rating", "success": false };
    }
  }

}
