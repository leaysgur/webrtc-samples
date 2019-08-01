import Peer from "skyway-js";
import Channel from "./channel";

async function createPeer(apiKey) {
  return new Promise((resolve, reject) => {
    let peer;
    try {
      peer = new Peer({ key: apiKey });
      peer.once("open", () => {
        peer.removeAllListeners("error");
        resolve(peer);
      });
      peer.once("error", err => {
        peer.close();
        reject(err);
      });
    } catch (err) {
      peer && peer.destroy();
      reject(err);
    }
  });
}

export async function createChannel(apiKey, channelName) {
  if (!apiKey) {
    throw new Error("Missing api key!");
  }
  if (!channelName) {
    throw new Error("Missing channel name!");
  }

  const { id, socket } = await createPeer(apiKey);
  const channel = new Channel(id, socket);
  await channel.join(channelName);
  return channel;
}
