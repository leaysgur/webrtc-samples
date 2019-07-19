export const pageId = location.pathname
  .split("/")
  .filter(Boolean)
  .pop();

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
