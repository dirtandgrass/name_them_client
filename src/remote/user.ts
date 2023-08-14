import { message } from "../types/Api";
import { User } from "../types/User";
import localFetch, { HttpMethod } from "../utility/LocalFetch";




export const validate = async (user_id: number, code: string): Promise<message> => {
  try {

    const response: any = await localFetch({
      path: `user/?action=validate&user_id=${user_id}&code=${code}`,
      method: HttpMethod.PUT,
    });

    const data = (response as message);

    return (data); // Return data if successful
  } catch (error: unknown) {
    console.error(error);
    return { message: "Error", success: false };
  }
};
