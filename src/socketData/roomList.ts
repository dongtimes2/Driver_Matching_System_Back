import { v4 as uuidv4 } from "uuid";
import { IRoom } from "../types/room";
import { UserType } from "../types/accounts";

export class RoomList {
  roomList: IRoom[];

  constructor() {
    this.roomList = [];
  }

  creteRoom(driverSid: string, passengerSid: string) {
    const uuid = uuidv4();
    const room = {
      uuid,
      driverSid,
      passengerSid,
    };
    this.roomList.push(room);

    return uuid;
  }

  getRoomIdByUserSid(userSid: string, userType: UserType) {
    let room: IRoom;

    if (userType === "driver") {
      room = this.roomList.find((room) => room.driverSid === userSid) as IRoom;
    } else {
      room = this.roomList.find(
        (room) => room.passengerSid === userSid
      ) as IRoom;
    }

    if (room) return room.uuid;
  }

  getRoom(roomId: string) {
    return this.roomList.find((room) => room.uuid === roomId) as IRoom;
  }

  getRoomList() {
    return this.roomList;
  }

  getDriverSidList() {
    return this.roomList.map((room) => room.driverSid);
  }

  deleteRoom(roomId: string) {
    this.roomList = [...this.roomList.filter((room) => room.uuid !== roomId)];
  }
}
