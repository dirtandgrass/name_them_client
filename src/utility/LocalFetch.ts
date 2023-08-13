import { User } from "../types/User";

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

const API_PATH = "http://localhost:3000/"

export default async function localFetch({ path, method, data, user }: { path: string, method?: HttpMethod, data?: object, user?: User }): Promise<object> {


  if (method === undefined) method = HttpMethod.GET;

  const reqHead: HeadersInit = new Headers();
  reqHead.set('Content-Type', 'application/json');
  if (user) {
    reqHead.append('X-NAMETHEM-UID', user.user_id.toString());
    reqHead.append('X-NAMETHEM-SID', user.session_id?.toString() || '');
    reqHead.append('X-NAMETHEM-SESSION', user.session || '');
  }

  const response = await fetch(API_PATH + path, {
    method: method,
    mode: 'cors',
    headers: reqHead,
    body: data ? JSON.stringify(data) : undefined
  });

  return await response.json();

}