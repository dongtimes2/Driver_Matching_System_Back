import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { UserList } from "../socketData/userList.js";
import { IUser } from "../types/accounts.js";
import { CallList } from "../socketData/callList.js";
import { ICoordinate } from "../types/map.js";
import { ICallSocketData } from "../types/call.js";
import { RoomList } from "../socketData/roomList.js";

const socketModule = async (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const driverList = new UserList();
  const passengerList = new UserList();
  const callList = new CallList();
  const roomList = new RoomList();

  io.on("connection", (socket) => {
    console.log(`Connected ID: ${socket.id}`);

    socket.on("disconnect", () => {
      driverList.deleteUser(socket.id);
      passengerList.deleteUser(socket.id);
      console.log(`Disconnected ID: ${socket.id}`);
    });

    socket.on("sendConnectSocket", (user: IUser) => {
      const userData: IUser = {
        sid: socket.id,
        name: user.name,
        type: user.type,
      };

      user.type === "driver"
        ? driverList.addUser(userData)
        : passengerList.addUser(userData);
    });
    ////
    socket.on("sendPassengerCoordinate", (coordinate: ICoordinate) => {
      const driverInRoomSidList = roomList.getDriverSidList();
      const targetDriverSidList = driverList
        .getUserSidList()
        .filter((sid) => !driverInRoomSidList.includes(sid));

      const uuid = callList.addCall({
        coordinate,
        passengerName: passengerList.getUserName(socket.id),
        passengerSid: socket.id,
      });

      io.to(targetDriverSidList).emit(
        "responseCallList",
        callList.getCallList()
      );
      io.to(socket.id).emit("responseCallId", uuid);
      console.log("호출: ", callList.getCallList());
    });

    socket.on("sendCancelCall", (uuid) => {
      const driverSidList = driverList.getUserSidList();

      callList.deleteCall(uuid);
      io.to(driverSidList).emit("responseCallList", callList.getCallList());
      console.log("취소요청: ", callList.getCallList());
    });

    socket.on("sendAcceptCall", (call: ICallSocketData) => {
      const filteredDriverSidList = driverList.getFilteredUserSidList(
        socket.id
      );
      const driverSidInRoomList = roomList.getDriverSidList();
      const targetDriverSidList = filteredDriverSidList.filter(
        (sid) => !driverSidInRoomList.includes(sid)
      );
      const roomId = roomList.creteRoom(socket.id, call.passengerSid);
      ///
      console.log(
        "아이디: ",
        socket.id,
        "필터리스트: ",
        filteredDriverSidList,
        "룸에있는 드라이버 리스트: ",
        driverSidInRoomList,
        "타깃 리스트: ",
        targetDriverSidList
      );

      socket.emit("responseCallList", [call]);
      callList.deleteCall(call.uuid);
      targetDriverSidList.length &&
        io
          .to(targetDriverSidList)
          .emit("responseCallList", callList.getCallList());
      io.to(call.passengerSid).emit("responseAcceptCall", roomId);
      socket.join(roomId);
    });

    socket.on("sendPassengerCallback", (roomId: string) => {
      socket.join(roomId);
      io.to(roomId).emit("responseRequestDriverCoordinate");
    });

    socket.on("sendDriverCoordinate", (coordinate: ICoordinate) => {
      const roomId = roomList.getRoomIdByUserSid(socket.id, "driver");

      roomId && io.to(roomId).emit("responseDriverCoordinate", coordinate);
      console.log(roomId, "로", coordinate, "보냄");
    });

    socket.on("sendDisconnectMatching", () => {
      const roomId = roomList.getRoomIdByUserSid(socket.id, "passenger");

      roomId && io.to(roomId).emit("responseDisconnectMatching");
      roomId && socket.leave(roomId);
    });

    socket.on("sendDriverCallback", () => {
      const roomId = roomList.getRoomIdByUserSid(socket.id, "driver");

      roomId && socket.leave(roomId);
      roomId && roomList.deleteRoom(roomId);
      socket.emit("responseCallList", callList.getCallList());
    });

    // 기사가 새로 접속했을 때, 기존 승객 좌표도 보여주는 로직 구현 필요
    /////////

    socket.on("driver", () => {
      console.log("////////////////////////");
      console.log("기사유저", socket.rooms);
      console.log("기사리스트", driverList.getUserList());
      console.log("콜리스트", callList.getCallList());
      console.log("룸리스트", roomList.getRoomList());
    });

    socket.on("passenger", () => {
      console.log("////////////////////////");
      console.log("승객유저", socket.rooms);
      console.log("승객리스트", passengerList.getUserList());
    });
  });
};

export default socketModule;
