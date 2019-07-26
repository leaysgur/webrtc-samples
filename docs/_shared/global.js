const pageId = location.pathname
  .split("/")
  .filter(Boolean)
  .pop();

export const signalingId = localStorage.getItem("SIGNALING_SFX") + "+" + pageId;
export const signalingKey = localStorage.getItem("SIGNALING_KEY");

export function $(query) {
  const $els = document.querySelectorAll(query);
  if ($els.length === 0) {
    throw new Error(`${query} not found!`);
  }
  if ($els.length === 1) {
    return $els[0];
  }
  return $els;
}

export function appendFooter(ua) {
  const $a = document.createElement("a");
  $a.href = `https://github.com/leader22/webrtc-samples/blob/master/docs/${pageId}`;
  $a.textContent = "View source";

  const $text = document.createTextNode(" | UA: ");

  const $span = document.createElement("span");
  $span.textContent = ua;

  document.body.append(document.createElement("hr"));
  document.body.append($a);
  document.body.append($text);
  document.body.append($span);
}
