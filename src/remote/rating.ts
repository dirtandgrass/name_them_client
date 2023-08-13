
import { Sex, ratingMessage } from "../types/Api";
import { User } from "../types/User";
import localFetch, { HttpMethod } from "../utility/LocalFetch";




export const topRated = async ({ user: user, group_id, count = 5, sex = Sex.all }: { user: User, group_id: number, count: number, sex: Sex }): Promise<ratingMessage> => {
  try {

    const response: any = await localFetch({
      path: `rating/top/${group_id}/?count=${count}&sex=${sex}`,
      user: user,
    });

    const data = (response as ratingMessage);
    //console.log("top rated", sex, data);
    return (data); // Return data if successful
  } catch (error: unknown) {
    console.error(error);
    return { message: "Error", success: false };
  }
};
