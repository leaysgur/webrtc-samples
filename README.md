# webrtc-samples

Personal WebRTC samples for cross browser checking.

## docs/

- Available via GitHub pages.
- Each `main.js` will be bundled into `bundle.js` by `npm run {dev|build}:docs`.
- You can use `bundle.js` directly as ESModule entry file.

## external/

- Original module for signaling
- And other modules from `npm` to be exported here
- To be bundled as `docs/_shared/external.js` by `npm run {dev|build}:external`.
