import { ICoordinate } from "./map";

export interface ICallSocketData {
  uuid: string;
  coordinate: ICoordinate;
  passengerName: string;
  passengerSid: string;
}
