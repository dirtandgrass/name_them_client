export type message = {
  message: string;
  success: boolean;
}

type ratingFields = {
  data?: ratingRecord[];
  sex?: Sex;
}

export type ratingRecord = { name_id: number, name: string, rating: number, male: boolean, female: boolean, avg_rating: number };

export type ratingMessage = message & ratingFields;

export enum Sex {
  male = "male", female = "female", unisex = "unisex", all = "all"
}