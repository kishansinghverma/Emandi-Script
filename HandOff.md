# Emandi Script Handoff

Last updated: 2026-10-19

## Scope

The active work is the vehicle-tagging flow used from the gatepass page. The
main implementation is in
[`src/public/modules/services/vehicleTagging.js`](src/public/modules/services/vehicleTagging.js),
with page integration in
[`src/public/modules/pages/add_gatepass.js`](src/public/modules/pages/add_gatepass.js)
and styling in [`src/public/assets/style.css`](src/public/assets/style.css).

## Current Flow

1. Validate Gatepass
2. Crop Vehicle Image
3. Crop Number Plate Image
4. Select Location
5. Review and Tag Vehicle (or Finalize directly if record is queued)

If record images are unavailable, Step 0 remains open and the user can select
both images manually before continuing.

## Remaining Work

- Confirm backend field naming: verify whether backend expects `vehicleImage` as
  number-plate and `vehicleFullImage` as vehicle, or vice-versa.
- Decide whether the hardcoded contact number should come from the page/session
  instead of `9675679250`.
- Verify the backend accepts `ipAddress: null` and supports >= 10 MB payload limits.
- Add session pre-warming on `/Traders/Dashboard` and handle `/Traders/Dashboard` route
  without throwing an unhandled injection error in `initialization.js`.
- Prevent `finalizeRecord()` from proceeding to completion and redirect if upstream
  `sendNinerById` or `sendGatepassById` fails.
- Guard `validateGatepass` against duplicate in-flight requests while pending.
- Run `npm run build` when explicitly requested to update `dist/index.js` before release.

## Known Glitches and Risks

- ArcGIS is a single point of failure for address metadata now that the other
  reverse-geocoding providers have been removed. If ArcGIS omits a field, the
  card may show `Not available`.
- Location-card generation performs a network lookup and canvas export;
  the UI transition is asynchronous, but the final stamped preview depends on
  that request completing.
- If location-card generation fails, review falls back to the unstamped vehicle image.
- Manual browser verification is still required for mobile pinch gestures,
  image failures, Reset, Back navigation, and closing while asynchronous work
  is pending.

## Verification Performed

- JavaScript syntax check passed with `node --check` across all 23 source files.
- Verified all `Messages` and `Labels` references in `src/public/modules/constants.js`.
- Verified balanced CSS braces and styles in `src/public/assets/style.css`.
- Verified Webpack production build succeeds without errors or warnings.
- `npm run build` was not run on production `dist/`, in accordance with `AGENTS.md`.

## Recommended Next Order

1. Resolve the `/Traders/Dashboard` routing exception and add session pre-warming.
2. Confirm backend payload field names (`vehicleImage` vs `vehicleFullImage`) and dynamic contact number.
3. Add abort/rethrow check in `finalizeRecord()` if receipt sending fails.
4. Manually test the complete modal flow on desktop and mobile.
5. Run `npm run build` and verify the generated bundle in the target userscript workflow.
