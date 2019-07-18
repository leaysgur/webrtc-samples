import Peer from "skyway-js";
import Channel from "./channel";

async function createPeer(apiKey) {
  return new Promise((resolve, reject) => {
    let peer;
    try {
      peer = new Peer({ key: apiKey });
      peer.once("open", () => {
        peer.removeAllListeners();
        resolve(peer);
      });
      peer.once("error", err => {
        peer.close();
        reject(err);
      });
    } catch (err) {
      peer && peer.close();
      reject(err);
    }
  });
}

async function createRoom(peer, name) {
  return new Promise((resolve, reject) => {
    let room;
    try {
      room = peer.joinRoom(name, { mode: "sfu" });
      room.once("open", () => {
        room.removeAllListeners();
        resolve(room);
      });
      room.once("error", err => {
        room.close();
        reject(err);
      });
    } catch (err) {
      room && room.close();
      reject(err);
    }
  });
}

export async function createSignalingChannel(apiKey, roomName) {
  const peer = await createPeer(apiKey);
  const room = await createRoom(peer, roomName);
  return new Channel(room);
}
