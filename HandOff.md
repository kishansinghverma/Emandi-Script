# Emandi Script Handoff

Last updated: 2026-10-14

## Scope

The active work is the vehicle-tagging flow used from the gatepass page. The
main implementation is in
[`src/public/modules/services/vehicleTagging.js`](src/public/modules/services/vehicleTagging.js),
with page integration in
[`src/public/modules/pages/add_gatepass.js`](src/public/modules/pages/add_gatepass.js)
and styling in [`src/public/assets/style.css`](src/public/assets/style.css).

## Completed

### Vehicle-tagging modal

- The modal always opens at Step 0: Gatepass validation.
- Gatepass number is initialized from `#transaction_number`.
- Validation runs initially, on blur, and when Enter is pressed.
- The existing inline input loader is shown while gatepass validation is pending.
- Success displays the validated vehicle type and vehicle number.
- Existing record images are preloaded from the S3 route when available.
- Missing, invalid, or unparseable images leave the modal open and provide
  manual image selectors.
- Manual image selection does not automatically advance the flow.
- Reset reloads record images and restores the gatepass number from the page.
- Vehicle and number-plate images can be cropped independently.
- Drag, mouse, wheel, pinch, zoom, rotation, sliders, and +/- controls are
  supported in the image editor.
- Vehicle and number-plate outputs remain separate.
- Back navigation is available between the image, location, and review steps.

### Location step and location card

- The location step displays a Google Maps preview.
- Coordinates are initialized from the queued record when valid.
- Missing coordinates use a randomized location within approximately 100m of
  the configured seed: `latitude: 27.4288667`, `longitude: 78.116275`.
- Latitude and longitude can be edited manually.
- Randomize generates a new coordinate pair from the configured seed.
- Reset restores queued coordinates or generates a seeded fallback.
- `generateLocationCard()` creates the stamped vehicle image at the existing
  vehicle output size.
- ArcGIS is now the only reverse-geocoding provider.
- Address mapping currently uses:
  - Street: ArcGIS `Address`
  - City / District: ArcGIS `City` and `Subregion`/`District`
  - State & Pincode: ArcGIS `Region` and `Postal`
  - Country: ArcGIS `Country`/`CountryCode`
  - Plus Code: generated locally
- The Review step opens immediately after Location. Location-card generation
  runs asynchronously and replaces the vehicle preview when complete.
- The Tag Vehicle button stays disabled while location-card generation is in
  progress.

### Review and payload preparation

- Review shows the stamped vehicle image, cropped number-plate image, vehicle
  details, gatepass number, and GPS coordinates.
- Review values are compared with page values for vehicle number and gatepass
  number using match/mismatch card styling.
- The prepared vehicle-tagging payload includes vehicle details, gatepass,
  coordinates, contact number, both image values, and nullable `ipAddress`.
- The POST request to `Url.VehicleTaggingEntries` is intentionally commented
  out. The payload is currently logged only.
- `finalizeRecord()` is exported and available to `add_gatepass.js`; it calls
  the existing finalize route with a PATCH request.

## Current flow

1. Validate Gatepass
2. Crop Vehicle Image
3. Crop Number Plate Image
4. Select Location
5. Review and Tag Vehicle

If record images are unavailable, Step 0 remains open and the user can select
both images manually before continuing.

## Remaining work

- Connect the prepared payload to the real vehicle-tagging POST endpoint.
- Confirm the final backend contract for both image fields and payload size.
- Confirm whether `vehicleImage` and `vehicleFullImage` are mapped to the
  intended backend fields; the current preparation uses the cropped plate and
  stamped vehicle image according to the existing implementation.
- Decide whether the hardcoded contact number should come from the page/session
  instead of `9675679250`.
- Replace hardcoded latitude/longitude payload values with selected coordinates
  if required by the backend contract.
- Complete the final end-to-end submission flow after the POST contract is
  confirmed.
- Verify the backend accepts `ipAddress: null`.
- Confirm the backend body limit is at least 10 MB.
- Decide whether the existing `finalizeRecord()` call in the gatepass submit
  completion path should remain separate from vehicle-tagging submission.

## Known glitches and risks

- ArcGIS is a single point of failure for address metadata now that the other
  reverse-geocoding providers have been removed. If ArcGIS omits a field, the
  card may show `Not available`.
- Location-card generation still performs a network lookup and canvas export;
  the UI transition is asynchronous, but the final stamped preview depends on
  that request completing.
- If location-card generation fails after Review has opened, the error is shown
  through the existing alert path. This failure state should be reviewed to
  ensure Tag Vehicle cannot continue without a valid stamped image.
- The real POST call is not active, so successful Review currently does not
  submit vehicle-tagging data.
- Manual browser verification is still required for mobile pinch gestures,
  image failures, Reset, Back navigation, and closing while asynchronous work
  is pending.
- The current working tree already contains unrelated/uncommitted changes.
  Preserve them and review the full diff before committing.

## Documentation inconsistencies

- `TODO.md` still describes location-card composition and submission as
  deferred, although location-card composition is now implemented.
- `AGENTS.md` still describes vehicle tagging as preview-only and says location
  cards are deferred. That guidance should be updated if this implementation is
  now the accepted direction.
- The old root `location-card.js` and `location-card-example.html` remain
  reference files and are not the implementation used by the bundle.

## Verification performed

- JavaScript syntax check passed with `node --check` for
  `src/public/modules/services/vehicleTagging.js`.
- No automated tests exist by repository policy.
- `npm run build` was not run, in accordance with `AGENTS.md`.
- The generated `dist/` output has not been updated.

## Recommended next order

1. Manually test the complete modal flow on desktop and mobile.
2. Fix the location-card generation failure state before enabling submission.
3. Confirm backend payload names, image mapping, nullable IP handling, and the
   10 MB request limit.
4. Enable and test the vehicle-tagging POST request.
5. Update `TODO.md` and `AGENTS.md` to reflect the accepted location-card flow.
6. Run the build only when explicitly requested, then verify the generated
   bundle in the target userscript workflow.
