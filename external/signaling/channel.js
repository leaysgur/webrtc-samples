import { EventEmitter } from "events";

class Channel extends EventEmitter {
  constructor(id, socket) {
    super();
    this.setMaxListeners(Infinity);

    this._id = id;
    this._socket = socket;
    this._name = "";
  }

  async join(name) {
    const socket = this._socket;

    // use "mesh" room to get users
    socket.send("ROOM_JOIN", {
      roomName: name,
      roomType: "mesh"
    });

    await new Promise(resolve => {
      socket.once("ROOM_USER_JOIN", ({ src }) => {
        if (src === this._id) resolve();
      });
    });

    this._name = name;

    socket.on("ROOM_USER_JOIN", ({ src, roomName }) => {
      if (roomName === name && src !== this._id) {
        this.emit("@userJoin", src);
      }
    });
    socket.on("ROOM_USER_LEAVE", ({ src, roomName }) => {
      if (roomName === name) {
        this.emit("@userLeave", src);
      }
    });
    socket.on("ROOM_DATA", ({ data, src, roomName }) => {
      if (roomName === name) {
        this.emit("@message", { data, src });
      }
    });
  }

  close() {
    const socket = this._socket;

    socket.send("ROOM_LEAVE", { roomName: this._name });
    socket.close();
  }

  send(data) {
    const socket = this._socket;

    socket.send("ROOM_SEND_DATA", { roomName: this._name, data });
  }

  async fetchUsers() {
    const socket = this._socket;

    socket.send("ROOM_GET_USERS", { roomName: this._name, roomType: "mesh" });
    return new Promise(resolve => {
      socket.once("ROOM_USERS", ({ userList }) => resolve(userList));
    });
  }
}

export default Channel;
