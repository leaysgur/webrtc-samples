const { createChannel } = window.External;
import { $, pageId, signalingKey, assert } from "../_shared/global.js";

(async () => {
  assert(typeof signalingKey === "string", "signalingKey exists");
  assert(typeof pageId === "string", "pageId exists");

  let ch;
  let timer;

  $("#create").onclick = async () => {
    ch = window.ch = await createChannel(signalingKey, pageId);
    assert(true, `channel "${pageId}" created`);

    ch.on("@message", ({ data }) => {
      if (data === "ping") {
        ch.send("pong");
      }
      if (data === "pong") {
        assert(true, "recv pong!");
      }
    });

    timer = setInterval(async () => {
      const users = await ch.fetchUsers();
      assert(Array.isArray(users), "fetch userId array");

      const $users = $("#users");
      $users.innerHTML = "";

      for (const user of users) {
        if (user === ch.id) {
          $users.innerHTML += `- ${user}(Me)\n`;
        } else {
          $users.innerHTML += `- ${user}\n`;
        }
      }
    }, 2000);
  };

  $("#ping").onclick = () => {
    if (!ch) return;

    ch.send("ping");
    assert(true, "ping sent!");
  };

  $("#close").onclick = () => {
    ch.close();
    clearInterval(timer);
    ch = timer = null;

    assert(true, "channel close");
  };
})();
