
import { User } from "../types/User";
import localFetch, { HttpMethod } from "../utility/LocalFetch";
import * as apiTypes from "../types/Api";
import { NameType } from "../components/Sections/Names/RandomNameList/RandomNameList";

export const fetchName = async (group_id: number, user: User): Promise<NameType | undefined> => {
  try {
    const response: any = await localFetch({
      path: `name/?action=unrated&group_id=${group_id}`,
      user: user,
    });

    const data = (response.data as NameType) || undefined;
    //console.log(data);
    return (data); // Return data if successful
  } catch (error: unknown) {
    console.error(error);
    return undefined;
  }
};


export const rateName = async (group_id: number, name_id: number, rating: number, user: User): Promise<apiTypes.message> => {

  try {
    const response: any = await localFetch({
      path: `rating/?name_id=${name_id}`,
      user: user,
      method: HttpMethod.POST,
      data: { group_id, rating }
    });

    const data = (response as apiTypes.message);
    return (data); // Return data if successful
  } catch (error: unknown) {
    console.error(error);
    return { message: "Error", success: false };
  }
}