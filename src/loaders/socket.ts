import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { UserList } from "../socketData/userList.js";
import { IUser, UserType } from "../types/accounts.js";
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

    socket.on("sendConnectSocket", (user: IUser) => {
      const userData: IUser = {
        sid: socket.id,
        name: user.name,
        type: user.type,
      };

      if (user.type === "driver") {
        driverList.addUser(userData);
        socket.emit("responseCallList", callList.getCallList());
      } else {
        passengerList.addUser(userData);
      }
    });

    // 유저가 새로고침을 하거나, 페이지를 완전히 꺼버린 경우에 대응
    socket.on("disconnect", () => {
      if (driverList.getUser(socket.id)) {
        driverList.deleteUser(socket.id);

        if (roomList.getRoomIdByUserSid(socket.id, "driver")) {
          const roomId = roomList.getRoomIdByUserSid(socket.id, "driver");

          roomId && socket.leave(roomId);
          roomId && io.to(roomId).emit("responseDisconnectMatching");
        }
      } else if (passengerList.getUser(socket.id)) {
        passengerList.deleteUser(socket.id);

        if (callList.getCallBySid(socket.id)) {
          const driverSidList = driverList.getUserSidList();

          callList.deleteCallBySid(socket.id);
          io.to(driverSidList).emit("responseCallList", callList.getCallList());
        }

        if (roomList.getRoomIdByUserSid(socket.id, "passenger")) {
          const roomId = roomList.getRoomIdByUserSid(socket.id, "passenger");

          roomId && socket.leave(roomId);
          roomId && io.to(roomId).emit("responseDisconnectMatching");
        }
      }

      console.log(`Disconnected ID: ${socket.id}`);
    });

    // 유저가 페이지를 완전히 끄지 않은 상태에서
    // 중간에 로그아웃 하거나, 다른 페이지로 강제로 전환시킨 경우에 대응
    socket.on("sendDisconnectSocket", (userType: UserType) => {
      const driverSidList = driverList.getUserSidList();

      if (userType === "driver") {
        driverList.deleteUser(socket.id);

        if (roomList.getRoomIdByUserSid(socket.id, "driver")) {
          const roomId = roomList.getRoomIdByUserSid(socket.id, "driver");

          roomId && socket.leave(roomId);
          roomId && io.to(roomId).emit("responseDisconnectMatching");
        }
      } else {
        passengerList.deleteUser(socket.id);

        if (callList.getCallBySid(socket.id)) {
          callList.deleteCallBySid(socket.id);
          io.to(driverSidList).emit("responseCallList", callList.getCallList());
        }

        if (roomList.getRoomIdByUserSid(socket.id, "passenger")) {
          const roomId = roomList.getRoomIdByUserSid(socket.id, "passenger");

          roomId && socket.leave(roomId);
          roomId && io.to(roomId).emit("responseDisconnectMatching");
        }
      }
    });

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

      targetDriverSidList.length &&
        io
          .to(targetDriverSidList)
          .emit("responseCallList", callList.getCallList());
      io.to(socket.id).emit("responseCallId", uuid);
    });

    socket.on("sendCancelCall", (uuid) => {
      const driverSidList = driverList.getUserSidList();
      const driverSidInRoomList = roomList.getDriverSidList();
      const targetDriverSidList = driverSidList.filter(
        (sid) => !driverSidInRoomList.includes(sid)
      );

      callList.deleteCall(uuid);
      targetDriverSidList.length &&
        io
          .to(targetDriverSidList)
          .emit("responseCallList", callList.getCallList());
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
    });

    socket.on("sendDisconnectMatching", () => {
      const roomId = roomList.getRoomIdByUserSid(socket.id, "passenger");

      roomId && socket.leave(roomId);
      roomId && io.to(roomId).emit("responseDisconnectMatching");
    });

    socket.on("sendDriverCallback", () => {
      const roomId = roomList.getRoomIdByUserSid(socket.id, "driver");

      roomId && socket.leave(roomId);
      roomId && roomList.deleteRoom(roomId);
      socket.emit("responseCallList", callList.getCallList());
    });
  });
};

export default socketModule;
