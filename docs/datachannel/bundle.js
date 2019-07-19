import { $, pageId, signalingKey } from "../_shared/global.js";
const { createChannel } = window.External;

(async () => {
  $("#connect").onclick = async () => {
    const ch = await createChannel(signalingKey, pageId);

    const users = await ch.fetchUsers();
    console.log(users);

    const role = users.length === 1 ? "answer" : "offer";
    console.log(`You are ${role} side`);
    if (role === "offer") console.log("Create and send offer...");
    if (role === "answer") console.log("Wait for offer...");

    const pcConf = {
      bundlePolicy: "max-bundle",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };
    const pc = (window.pc = new RTCPeerConnection(pcConf));
    console.log("pc created w/", pcConf);

    const dcInit = { negotiated: true, id: 1 };
    const dc = (window.dc = pc.createDataChannel(pageId, dcInit));
    console.log("dc created w/", dcInit);

    pc.oniceconnectionstatechange = () =>
      console.warn("oniceconnectionstatechange", pc.iceConnectionState);

    pc.onicecandidate = ev => {
      console.warn("onicecandidate");
      if (ev.candidate === null) return;
      if (ev.candidate.candidate === "") return;

      ch.send(ev.candidate);
      console.log("send icecandidate", ev.candidate);
    };

    ch.on("@message", async ({ data }) => {
      if (data.type === "offer") {
        console.log("receive offer");
        console.warn(data.sdp);
        await Promise.all([
          pc.setRemoteDescription(data),
          pc.createAnswer().then(answer => pc.setLocalDescription(answer))
        ]);
        console.log("send answer");
        ch.send(pc.localDescription);
        console.warn(pc.localDescription.sdp);
      }
      if (data.type === "answer") {
        console.log("receive answer");
        console.warn(data.sdp);
        await pc.setRemoteDescription(data);
      }
      if (data.candidate) {
        console.log("receive candidate");
        await pc.addIceCandidate(data);
      }
    });

    if (role === "offer") {
      await pc.createOffer().then(offer => pc.setLocalDescription(offer));
      ch.send(pc.localDescription);
      console.log("send offer");
      console.warn(pc.localDescription.sdp);
    }

    dc.onopen = () => {
      console.warn("dc.onopen");

      dc.onmessage = ev => {
        console.log(`receive ${ev.data}`);
        if (ev.data === "ping") dc.send("pong");
      };

      $("#ping").onclick = () => dc.send("ping");
    };
  };
})();
