const { createChannel } = window.External;
import { $, signalingId, signalingKey } from "../_shared/global.js";

(async () => {
  $("#create").onclick = async () => {
    const ch = (window.ch = await createChannel(signalingKey, signalingId));
    console.warn(`channel "${signalingId}" created`);

    ch.on("@message", ({ data }) => {
      console.warn(`recv ${data}`);
      if (data === "ping") ch.send("pong");
    });

    const timer = setInterval(async () => {
      const users = await ch.fetchUsers();
      console.warn(users);

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

    $("#ping").onclick = () => {
      ch.send("ping");
    };

    $("#close").onclick = () => {
      ch.close();
      clearInterval(timer);
      console.warn("channel closed");
    };
  };
})();
