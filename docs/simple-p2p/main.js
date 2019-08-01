import { createTransport } from "simple-p2p";
import { $, signalingId, signalingKey, appendFooter } from "../_shared/global";
const { createChannel } = window.External;

(async () => {
  appendFooter(navigator.userAgent);

  let tr = null;
  let dc = null;
  $("#connect").onclick = async () => {
    const ch = await createChannel(signalingKey, signalingId);

    const users = await ch.fetchUsers();
    console.log(users);

    const role = users.length === 1 ? "answer" : "offer";
    if (role === "offer") console.log("Create and send offer...");
    if (role === "answer") console.log("Wait for offer...");

    tr = window.tr = createTransport({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    ch.on("@message", d => tr.handleNegotiation(d.data));
    tr.on("negotiation", d => ch.send(d));
    tr.on("connectionStateChange", s => console.warn(s));
    tr.on("error", e => console.error(e));

    tr.dataHandler.on("channel", c => {
      dc = c;
      console.log("got channel!", dc);
      dc.onmessage = ev => ($("#message").textContent = ev.data);
    });
    tr.mediaHandler.on("receiver", r => {
      const { track, kind } = r;
      const $media = document.createElement(kind);
      $media.playsInline = true;
      $media.srcObject = new MediaStream([track]);
      $media.play().catch(console.error);
      $("#media").appendChild($media);

      r.on("replace", () => console.log("replaced!"));
      r.on("ended", () => $media.remove());
    });

    if (role === "offer") {
      await tr.startNegotiation();
    }

    tr.once("open", async () => {
      console.log("transport open!", tr);

      // dataHandler
      $("#createdata").onclick = async () => {
        dc = await tr.dataHandler.createChannel();
        console.log("create DataChannel", dc);
        dc.onmessage = ev => ($("#message").textContent = ev.data);
      };
      $("#senddata").onclick = () => dc.send(`Hello at ${Date.now()}`);

      // mediaHandler
      $("#sendaudio").onclick = async () => {
        const at = await navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(s => s.getAudioTracks()[0]);
        await tr.mediaHandler.sendTrack(at);
      };

      $("#sendvideo").onclick = async () => {
        const vt = await navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(s => s.getVideoTracks()[0]);
        const sender = await tr.mediaHandler.sendTrack(vt);

        $("#repldisp").onclick = async () => {
          const vt = await navigator.mediaDevices
            .getDisplayMedia({ video: true })
            .then(s => s.getVideoTracks()[0]);
          await sender.replace(vt);
        };
      };

      let dispSender;
      $("#senddisp").onclick = async () => {
        const vt = await navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then(s => s.getVideoTracks()[0]);
        dispSender = await tr.mediaHandler.sendTrack(vt);
      };
      $("#enddisp").onclick = async () => {
        await dispSender.end().catch(console.error);
      };
    });
  };
})();
