# Project Handoff

Last updated: 2026-09-23

Latest operation: rebuilt the two-step vehicle-image cropper with native dialog,
canvas, and pointer events; no added dependencies. The user confirmed that the
flow should stop at cropped previews and restored the Webpack configuration.

## Current State

The notification toast in `src/public/assets/elements.js`,
`src/public/assets/loader.js`, and `src/public/assets/style.css` uses the Soft
Capsule design: muted status surfaces, fine borders, solid circular white-
stroke icons, readable 16px messages, and a subtle dismiss control. The
status palette now uses the supplied success, info, error, accent, border,
text, and shadow tokens. Message and dismiss-control text follows the active
status color. The container now uses approximately 80% of its previous
dimensions, including a 14px medium-weight message and a 380px desktop max width. Its
centered mobile and top-right desktop placement remain unchanged. The existing
app has no warning notification variant, so the supplied warning tokens are
defined but not assigned.

The active local backend routes are now `/api/dispatches/peek`,
`/api/dispatches/finalize`, and `/api/vision/captcha`. The toast uses a
stronger two-layer shadow so its container is clearly separated from the page
background.

The gatepass page now waits for the queued record before running its vehicle
tagging flow. When both `record.vehicleImage` and `record.numberPlateImage`
are available, `tagVehicle()` opens a full-screen responsive modal. The modal
supports vehicle-image cropping first, number-plate cropping second, drag and
pinch/slider zoom interactions, back navigation, and a final preview of both
cropped images. A Vehicle images button reopens the dialog. The vehicle output
is 771 × 1024; the plate keeps its source aspect ratio at 771 pixels wide.
Done stores both JPEG data URLs in `Add_Gatepass.taggedImages` for the current
page; the original queued record remains intact. The current flow only previews
the cropped images; location-card
composition is intentionally not yet applied. The vehicle and number-plate
outputs remain separate so the location card can later be applied only to the
vehicle image.

The unused `SetRate` constant was removed earlier; rate data continues to be
sent as part of the dispatch finalize request. The finalize endpoint constant
is now named `FinalizeRecord`; the unused `PopRecord` constant has also been
removed. `Url.sendNiner` and `Url.sendGatepass` now point to the document
creation endpoints, while the old `PrintPdf` call remains pending migration.

`src/public/modules/services/utils.js` now owns the notification auto-dismiss
timer and exposes `hideAlert`, preventing an older timer from closing a newer
toast. Manual dismissal in `initialization.js` uses the same cleanup path.

## Verification

Automated tests and the test script were removed at the user's request. Do not
add tests or test files; use the build and manual workflow verification.
The user restored `webpack.config.cjs` and the original config-based build
command. Preserve this file; do not delete it or move its options into the CLI.
`npm run build` and `git diff --check` passed on 2026-09-23.
The vehicle-tagging flow still needs manual mobile workflow verification,
including image loading failures, closing during loading, Back, and reopening.

The working tree contains uncommitted changes for the cropper, docs, and
generated bundle. `TODO.md` is staged; the new
`src/public/modules/services/vehicle.js` is untracked. Preserve existing staging.
`location-card.js` and `location-card-example.html` are
tracked reference files. The location-card helper is not included in the
production bundle, and the cropper does not submit images to eMandi.
Location-card composition and eMandi submission are explicitly deferred in `TODO.md`.

## Next Session

Manually verify the cropper on mobile: both crop steps, drag/pinch/slider zoom,
Back, final previews, closing while loading, failed image loads, and reopening.
Also check the normal gatepass form with no queued images. Do not add test files
or expand tagging beyond previews unless the user requests it.
