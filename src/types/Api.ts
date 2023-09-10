import { user } from "./User";

export type message = {
  message: string;
  success: boolean;
  loginRequired?: boolean,
  data?: Record<string, unknown>
}

type ratingFields = {
  data?: ratingRecord[];
  sex?: Sex;
}

type loginFields = {
  user?: user,
  session?: {
    session_id?: number;
    message: string;
    success: boolean;
    session?: string;

  }
}
export type Role = "admin" | "participant";
type groupFields = { name: string, description: string, user_id: number, role: Role, accepted: boolean }

export type ratingRecord = { name_id: number, name: string, rating: number, male: boolean, female: boolean, avg_rating: number };

export type ratingMessage = message & ratingFields;

export type loginMessage = message & loginFields;

export type createGroupMessage = message & { group_id?: number, group?: groupFields };

export enum Sex {
  male = "male", female = "female", unisex = "unisex", all = "all"
}