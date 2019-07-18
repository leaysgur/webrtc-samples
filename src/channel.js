class Channel {
  constructor(room) {
    this._room = room;

    ["send", "on", "once"].forEach(method => {
      this[method] = this._room[method].bind(this._room);
    });
  }
}

export default Channel;
