export class User {
  user_id = -1;
  username = "";
  email = "";
  session_id?: number;
  session?: string;

  setUser(user: User) {
    this.user_id = user.user_id;
    this.username = user.username;
    this.email = user.email;
  }
  getUser() {
    return this;
  }
  isLoggedIn() {
    return this.user_id > 0;
  }
  logOut() {
    this.user_id = -1;
    this.username = "";
    this.email = "";
  }

  constructor(
    user_id: number,
    username: string,
    email: string,
    session_id: number | undefined = undefined,
    session: string | undefined = undefined
  ) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.session_id = session_id;
    this.session = session;
  }
}


export const defaultUser = new User(0, "guest", "n/a");