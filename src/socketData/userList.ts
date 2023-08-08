import { IUser } from "../types/accounts";

export class UserList {
  userList: IUser[];

  constructor() {
    this.userList = [];
  }

  addUser(user: IUser) {
    this.userList.push(user);
  }

  deleteUser(userSid: string) {
    this.userList = [...this.userList.filter((user) => user.sid !== userSid)];
  }

  getUser(userSid: string) {
    return this.userList.find((user) => user.sid === userSid);
  }

  getUserList() {
    return this.userList;
  }

  getUserSidList() {
    return this.userList.map((user) => user.sid);
  }

  getFilteredUserSidList(userSid: string) {
    return this.userList
      .filter((user) => user.sid !== userSid)
      .map((user) => user.sid);
  }

  getUserName(userSid: string) {
    const result = this.userList.find((user) => user.sid === userSid);
    return result ? result.name : "anonymous";
  }
}
