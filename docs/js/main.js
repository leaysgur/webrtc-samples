const { createChannel } = window.Signaling;

(async () => {
  const key = localStorage.getItem("SKYWAY_KEY");
  const ch = await createChannel(key, "ko-test");

  ["@userJoin", "@userLeave", "@message"].forEach(ev => {
    ch.on(ev, d => console.warn(ev, d));
  });
  ch.send("Hello!");

  window.ch = ch;
})();
