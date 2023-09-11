import { defaultUser, user } from "../types/User";

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export const setSetUserFunction = (setUser: React.Dispatch<React.SetStateAction<user>>) => {
  setUserFunction = setUser;
}

let setUserFunction: React.Dispatch<React.SetStateAction<user>> | null = null

const API_PATH = "/api/";
export default async function localFetch({ path, method = HttpMethod.GET, data, user }: { path: string, method?: HttpMethod, data?: object, user?: user }): Promise<object> {
  const reqHead: HeadersInit = new Headers();
  reqHead.set('Content-Type', 'application/json');
  if (user) {
    reqHead.append('X-NAMETHEM-UID', user.user_id.toString());
    reqHead.append('X-NAMETHEM-SID', user.session_id?.toString() || '');
    reqHead.append('X-NAMETHEM-SESSION', user.session || '');
  }

  const response = await fetch(API_PATH + path, {
    method,
    mode: 'cors',
    headers: reqHead,
    body: data ? JSON.stringify(data) : undefined
  });
  const res = await response.json();

  if (setUserFunction && res?.error === 401) {
    setUserFunction(defaultUser);
  }

  return res;
}
