import { promised } from "enhanced-datachannel";
import { $, pageId, signalingKey } from "../_shared/global";
const { createChannel } = window.External;

(async () => {
  let ch;
  $("#connect").onclick = async () => {
    ch = window.ch = await createChannel(signalingKey, pageId);

    const users = await ch.fetchUsers();
    console.log(users);

    const role = users.length === 1 ? "answer" : "offer";
    console.log(`You are ${role} side`);

    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel(pageId, { negotiated: true, id: 1 });

    pc.onicecandidate = ev => {
      if (ev.candidate === null) return;
      if (ev.candidate.candidate === "") return;
      ch.send(ev.candidate);
    };

    ch.on("@message", async ({ data }) => {
      if (data.type === "offer") {
        await Promise.all([
          pc.setRemoteDescription(data),
          pc.createAnswer().then(answer => pc.setLocalDescription(answer))
        ]);
        ch.send(pc.localDescription);
      }

      if (data.type === "answer") {
        await pc.setRemoteDescription(data);
      }

      if (data.candidate) {
        await pc.addIceCandidate(data);
      }
    });

    if (role === "offer") {
      await pc.createOffer().then(offer => pc.setLocalDescription(offer));
      ch.send(pc.localDescription);
    }

    const pdc = (window.pdc = promised(dc));
    pdc.on("open", () => console.warn("OPEN"));
  };
})();
