
import { user } from "../types/User";
import localFetch, { HttpMethod } from "../utility/LocalFetch";
import * as apiTypes from "../types/Api";
import { NameType } from "../components/Sections/Names/RandomNameList/RandomNameList";
import { Sex } from "../types/Api";

export const fetchUnratedNames = async (group_id: number, user: user, count: number = 1, sex: Sex = Sex.all, source_ids: number | number[] = -1): Promise<NameType[]> => {
  try {
    const response: any = await localFetch({
      path: `name/?action=unrated&group_id=${group_id}&count=${count}&sex=${sex}&source_ids=${source_ids}`,
      user: user,
    });

    const data = (response.data as NameType[]);
    //console.log(data);
    return (data); // Return data if successful
  } catch (error: unknown) {
    console.error(error);
    return [];
  }
};


export const rateName = async (group_id: number, name_id: number, rating: number, user: user): Promise<apiTypes.message> => {

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