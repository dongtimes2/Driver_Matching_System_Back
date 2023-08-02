import { ICallSocketData } from "../types/call";
import { v4 as uuidv4 } from "uuid";

export class CallList {
  callList: ICallSocketData[];

  constructor() {
    this.callList = [];
  }

  addCall(callData: Omit<ICallSocketData, "uuid">) {
    const uuid = uuidv4();
    this.callList.push({ uuid, ...callData });

    return uuid;
  }

  deleteCall(uuid: string) {
    this.callList = [...this.callList.filter((call) => call.uuid !== uuid)];
  }

  getCallList() {
    return this.callList;
  }
}
