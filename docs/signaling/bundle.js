const { createChannel } = window.External;
import { pageId, signalingKey } from "../_shared/global.js";

(async () => {
  const ch = await createChannel(signalingKey, pageId);

  ["@userJoin", "@userLeave", "@message"].forEach(ev => {
    ch.on(ev, d => console.warn(ev, d));
  });
  ch.send("Hello!");

  window.ch = ch;
})();
