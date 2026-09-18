# Project Handoff

Last updated: 2026-09-18

Latest operation: added constants for the current niner and gatepass document APIs.

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

The unused `SetRate` constant was removed earlier; rate data continues to be
sent as part of the dispatch finalize request. The finalize endpoint constant
is now named `FinalizeRecord`; the unused `PopRecord` constant has also been
removed. `Url.sendNiner` and `Url.sendGatepass` now point to the document
creation endpoints, while the old `PrintPdf` call remains pending migration.

`src/public/modules/services/utils.js` now owns the notification auto-dismiss
timer and exposes `hideAlert`, preventing an older timer from closing a newer
toast. Manual dismissal in `initialization.js` uses the same cleanup path.

## Verification

`npm run build` passed and regenerated the committed `dist` bundle and copied
stylesheet. `git diff --check` reports pre-existing trailing whitespace at
`src/public/modules/pages/listentries.js:37`; that unrelated change was
preserved.
