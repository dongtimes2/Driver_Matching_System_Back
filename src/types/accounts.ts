export type UserType = "driver" | "passenger";

export interface IUser {
  sid: string;
  name: string;
  type: UserType;
  roomId?: string;
}
