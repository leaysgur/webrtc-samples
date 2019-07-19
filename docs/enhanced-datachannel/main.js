import { promised } from "enhanced-datachannel";
import { pageId, signalingKey } from "../_shared/global";
const { createChannel } = window.External;

(async () => {
  const ch = await createChannel(signalingKey, pageId);

  ["@userJoin", "@userLeave", "@message"].forEach(ev => {
    ch.on(ev, d => console.warn(ev, d));
  });
  ch.send("Hello!");

  console.warn(promised);
  window.ch = ch;
})();
