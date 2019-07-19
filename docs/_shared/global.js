export const pageId = location.pathname
  .split("/")
  .filter(Boolean)
  .pop();

export const query = new URLSearchParams(location.search);

export const signalingKey = localStorage.getItem("SIGNALING_KEY");

export function assert(cond, note) {
  if (cond) {
    console.log(`🆗: ${note}`);
  } else {
    console.error(`🆖: ${note}`);

    if (query.has("assert")) {
      alert(`🆖: ${note}`);
    }
  }
}

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
