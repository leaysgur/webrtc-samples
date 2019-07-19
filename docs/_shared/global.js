export const pageId = location.pathname
  .split("/")
  .filter(Boolean)
  .pop();

export const signalingKey = localStorage.getItem("SIGNALING_KEY");
