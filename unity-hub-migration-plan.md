# Unity-Hub Backend Migration Plan

This plan migrates Emandi Script’s calls to the current Unity-Hub backend while preserving its direct interaction with the eMandi website.

## Scope

Emandi Script has two separate integration boundaries:

1. Direct requests and DOM/AJAX interaction with `emandi.up.gov.in`.
2. Backend requests to Unity-Hub for queue records, captcha resolution, document generation, finalization, and sharing.

Only the second boundary is being migrated. Direct eMandi website requests must remain unchanged unless a separate requirement is raised.

The current Unity-Hub backend is available at:

```text
http://localhost:8080/api
```

The production URL must be supplied explicitly before production deployment.

## Current Legacy Backend Calls

The active backend routes in Emandi Script currently point to the older contract:

```text
/api/dispatches/finalize
/api/dispatches/peek
/api/documents/niners
/api/documents/gatepasses
/api/vision/captcha
```

These must be migrated to the current Unity-Hub routes:

| Current Emandi Script route | Unity-Hub route | Purpose |
| --- | --- | --- |
| `PATCH /api/dispatches/finalize` | `PATCH /api/gatepasses/finalize` | Move a queued gatepass to processed |
| `GET /api/dispatches/peek` | `GET /api/gatepasses/peek` | Read the next queued gatepass |
| `POST /api/documents/niners` | `POST /api/emandi/niners` | Fetch/render/share a Niner |
| `POST /api/documents/gatepasses` | `POST /api/emandi/gatepasses` | Fetch/render/share a gatepass |
| `POST /api/vision/captcha` | `POST /api/imaging/captcha` | Resolve captcha text |

## Unity-Hub Response Contract

Successful Unity-Hub responses are wrapped as:

```json
{
  "isError": false,
  "traceId": "...",
  "content": {}
}
```

Errors are returned as:

```json
{
  "isError": true,
  "errorType": "...",
  "message": "...",
  "traceId": "..."
}
```

The migration must ensure that backend callers consume `content` and expose useful `message` values when the request fails.

## Phase 0 — Baseline and Safety

Before editing source files:

- Check the working tree with `git status --short`.
- Run the existing build:

```sh
npm run build
```

- Record whether the baseline build succeeds.
- Confirm `webpack.config.cjs` is preserved.
- Do not edit `dist/` directly.
- Keep the current direct eMandi website requests unchanged.
- Confirm the local Express server remains a static asset server on port `3001`.

Each migration phase should leave the project buildable and should be independently reviewable.

## Phase 1 — Centralize Backend Configuration

Update `src/public/modules/constants.js` so the Unity-Hub base URL is clearly defined and all backend routes are derived from it.

Required routes:

```js
FinalizeRecord: /api/gatepasses/finalize
PeekRecord: /api/gatepasses/peek
sendNiner: /api/emandi/niners
sendGatepass: /api/emandi/gatepasses
ResolveCaptcha: /api/imaging/captcha
```

Keep environment selection explicit. A suitable first step is to preserve the local value:

```js
const baseUrl = "http://localhost:8080/api";
```

Do not scatter backend URLs across page modules or services.

Validation:

- Search active source for the old backend paths.
- Confirm every Unity-Hub request uses `Url` constants.
- Run `npm run build`.

## Phase 2 — Add a Shared Unity-Hub HTTP Helper

Create a small service-level helper for Unity-Hub requests. Direct requests to eMandi should continue using their existing handling.

The helper should:

- Apply JSON headers for JSON requests.
- Validate HTTP status codes.
- Handle `204 No Content`.
- Parse JSON responses safely.
- Reject Unity-Hub error envelopes using their `message` field.
- Return the unwrapped `content` value for successful responses.
- Avoid assuming that every response contains content.

Conceptual behavior:

```text
fetch Unity-Hub endpoint
  → validate status
  → handle 204
  → parse JSON
  → reject isError responses
  → return content
```

This helper should be used by:

- Captcha service
- Record service
- Delivery service
- Finalization request

The helper must not alter the existing AJAX response interception used for eMandi pages.

Validation:

- Successful response with `content`.
- Error envelope with `message`.
- `204 No Content`.
- Invalid JSON response.
- Network failure.

## Phase 3 — Migrate Captcha Resolution

### Current behavior

The captcha service currently calls:

```text
POST /api/vision/captcha
```

and expects:

```js
data.code
```

### Unity-Hub contract

```text
POST /api/imaging/captcha
```

Request:

```json
{
  "base64string": "data:image/png;base64,..."
}
```

Response content:

```json
{
  "text": "1234"
}
```

### Required changes

- Update the route constant.
- Use the shared Unity-Hub HTTP helper.
- Read `content.text` through the helper.
- Preserve the existing three-attempt retry limit.
- Preserve captcha loader behavior.
- Preserve manual-entry fallback behavior.
- Preserve login, 6R, 9R, and gatepass integrations.

Validation:

- Login captcha resolution.
- 6R captcha resolution.
- 9R captcha resolution.
- Gatepass captcha resolution.
- Valid four-digit response.
- Empty response.
- Invalid response.
- Backend error.
- Three failed attempts followed by manual entry.

## Phase 4 — Migrate Queued Gatepass Retrieval

### Current behavior

`RecordHandler` retrieves a queued record from:

```text
GET /api/dispatches/peek
```

It stores the record in:

```text
localStorage["Record"]
```

### Unity-Hub contract

```text
GET /api/gatepasses/peek
```

Successful response content is a gatepass record. An empty queue returns `204`.

### Required changes

- Update the route constant.
- Use the shared Unity-Hub HTTP helper.
- Treat `204` as an empty queue rather than a JSON parsing failure.
- Preserve the `Record` local-storage key unless a separate migration is requested.
- Preserve form autofill behavior.
- Confirm the current gatepass fields map correctly:

```text
date
seller
weight
bags
vehicleNumber
vehicleType
party
vehicleImage
numberPlateImage
rate
gatepassId
ninerId
```

Validation:

- Empty queue.
- Queue with one record.
- Existing local record.
- Malformed stored JSON.
- Failed backend request.
- Page reload after storing a record.

## Phase 5 — Migrate Gatepass Finalization

### Current behavior

The gatepass flow currently calls:

```text
PATCH /api/dispatches/finalize
```

with:

```json
{
  "rate": 0,
  "ninerId": "...",
  "gatepassId": "..."
}
```

### Unity-Hub contract

```text
PATCH /api/gatepasses/finalize
```

The request fields remain:

```text
gatepassId: optional string
ninerId: optional string
rate: optional string or 0
```

### Required changes

- Update the route constant.
- Keep the field names and allowed values.
- Use the shared Unity-Hub HTTP helper.
- Remove the local record only after finalization succeeds.
- Preserve the current loader and success notification.
- Keep `rate: 0` valid.

Validation:

- Successful finalization.
- Finalization failure.
- Missing gatepass ID.
- Missing Niner ID.
- Zero rate.
- Retry after failure.
- Confirm local storage is retained after failure and removed after success.

## Phase 6 — Migrate Gatepass Document Requests

### Current legacy payload

The old delivery service sends a shape similar to:

```json
{
  "source": {
    "type": "latest"
  },
  "print": false,
  "download": true,
  "share": false
}
```

### Unity-Hub route

```text
POST /api/emandi/gatepasses
```

### Unity-Hub latest request

```json
{
  "source": "latest",
  "actions": {
    "print": false,
    "download": true,
    "share": false
  }
}
```

### Unity-Hub ID request

```json
{
  "source": "id",
  "data": {
    "id": "...",
    "date": "..."
  },
  "actions": {
    "print": false,
    "download": true,
    "share": false
  }
}
```

### Required changes

- Update the route.
- Convert the source discriminator to a string.
- Move ID lookup fields into `data`.
- Nest action flags under `actions`.
- Preserve latest, ID, print, download, and share flows.
- Confirm the date passed to the backend matches the E-Mandi query contract expected by Unity-Hub.

### HTML source compatibility

The old service supports an HTML-derived source shape. The current Unity-Hub contract supports `latest`, `id`, and `payload`, not the old `html` source shape.

Before migrating HTML-based receipt generation:

- Identify every caller of `sendGatepassByHtml`.
- Determine whether the flow is still active.
- If still required, map the scraped values to the Unity-Hub gatepass payload contract.
- Keep this mapping isolated in the delivery service.
- Do not invent a new backend source type without an explicit backend change.

Validation:

- Latest gatepass.
- Gatepass by ID.
- Download action.
- Share action.
- Print action placeholder.
- Missing record.
- Invalid date.
- Partial action failure.

## Phase 7 — Migrate Niner Document Requests

### Unity-Hub route

```text
POST /api/emandi/niners
```

### Latest request

```json
{
  "source": "latest",
  "actions": {
    "print": false,
    "download": true,
    "share": false
  }
}
```

### ID request

```json
{
  "source": "id",
  "data": {
    "id": "...",
    "date": "..."
  },
  "actions": {
    "print": false,
    "download": true,
    "share": false
  }
}
```

### Required changes

- Update the route.
- Convert the source discriminator to a string.
- Move lookup fields into `data`.
- Nest action flags under `actions`.
- Preserve latest, ID, download, share, and print behavior.
- Investigate the existing HTML-based Niner flow before changing it.

Validation:

- Latest Niner.
- Niner by ID.
- Download.
- Share.
- Print placeholder.
- Missing Niner.
- Invalid date.
- Backend error.

## Phase 8 — Migrate Document Response and Delivery

### Current legacy assumption

The delivery service currently expects:

```js
result.downloadUrl
```

### Unity-Hub response content

The current document response is shaped like:

```json
{
  "fileName": "...pdf",
  "actions": {
    "download": {
      "status": "success",
      "url": "/api/files/....pdf"
    },
    "share": {
      "status": "success"
    },
    "print": {
      "status": "not_requested"
    }
  }
}
```

### Required changes

- Read `content.fileName`.
- Read `content.actions.download.url`.
- Prefix relative download URLs with the Unity-Hub origin.
- Handle `success`, `not_requested`, and `failure` statuses.
- Do not assume a download URL exists for every request.
- Preserve partial-success handling.
- Keep share behavior delegated to Unity-Hub.
- Preserve user-facing success/error notifications.

Download flow:

```text
document request
  → Unity-Hub response envelope
  → content.actions.download
  → relative file URL
  → Unity-Hub origin
  → browser download
```

Validation:

- Download requested and successful.
- Download not requested.
- Download failed.
- Share successful while download fails.
- Print placeholder.
- HTTP `207` or partial action result.

## Phase 9 — Validate Record and Image Compatibility

Compare the record returned by Unity-Hub with the fields consumed by Emandi Script.

Expected gatepass data includes:

```text
date
seller
weight
bags
vehicleNumber
vehicleType
party
vehicleImage
numberPlateImage
rate
gatepassId
ninerId
```

Check carefully:

- ISO date values versus the date format required by external eMandi queries.
- Numeric values represented as numbers or strings.
- Party nesting and property names.
- Image URLs or image data expected by vehicle tagging.
- `rate`, `gatepassId`, and `ninerId` persistence across 6R, 9R, and gatepass steps.
- Whether the vehicle tagging code expects data URLs, URLs, or stored object paths.

Do not add compatibility transformations until the actual consuming flow is confirmed.

## Phase 10 — Keep Vehicle Tagging Scope Separate

The current project guidelines require vehicle and number-plate cropping with final previews.

Do not implement yet:

- Location-card composition.
- Submission of prepared images to eMandi.
- New vehicle-tagging API flows.

During backend migration, preserve:

- Separate vehicle and number-plate image outputs.
- Existing crop and preview behavior.
- Current user flow and modal behavior.

## Phase 11 — Remove Obsolete Active Contract References

After all callers are migrated, search active source for:

```text
/api/dispatches
/api/documents
/api/vision
downloadUrl
data.code
source.type
"print"
"download"
"share"
```

Classify each remaining match:

- Current Unity-Hub contract.
- Direct eMandi website request.
- Historical comment/documentation.
- Deferred or unused helper.

Remove or update only obsolete active backend-contract code. Do not remove direct eMandi routes merely because they contain similar words.

## Phase 12 — Configuration and Deployment

- Keep local and production Unity-Hub URLs explicit.
- Confirm Unity-Hub CORS allows the required browser origin.
- Confirm the production backend has the required environment configuration.
- Preserve `webpack.config.cjs`.
- Keep `npm run build` as the source of generated `dist/` output.
- Do not hand-edit `dist/index.js`.
- Confirm the userscript loader points to the intended local or production asset source.
- Verify the production JsDelivr URLs after publishing.

## Phase 13 — Final Verification

Run:

```sh
npm run build
```

Manually verify the following workflows:

### Authentication and captcha

- Login captcha resolution.
- Captcha fallback after failed resolution.
- 6R captcha resolution.
- 9R captcha resolution.
- Gatepass captcha resolution.

### Queue and record state

- Empty queue.
- Queued gatepass retrieval.
- Local-storage record retrieval.
- Gatepass form autofill.
- Record retained after failed finalization.
- Record removed after successful finalization.

### eMandi workflow

- 6R creation.
- Payment continuation.
- 9R creation.
- Gatepass creation/finalization.

### Documents

- Latest gatepass receipt.
- Gatepass receipt by ID.
- Latest Niner receipt.
- Niner receipt by ID.
- PDF download.
- WhatsApp share.
- Print placeholder behavior.
- Partial action failure.

### Error and loading states

- Backend unavailable.
- Backend validation error.
- Empty `204` response.
- Invalid JSON response.
- Slow request.
- Duplicate submission protection.

## Phase 14 — Final Review

Before delivery:

- Review every changed source file twice.
- Confirm no generated file was hand-edited.
- Confirm no direct eMandi-site request was accidentally migrated.
- Confirm all backend routes are centralized.
- Confirm all Unity-Hub responses use the shared helper.
- Confirm no credentials, cookies, session data, or production-only configuration were added.
- Run `git diff --check`.
- Review `git status --short`.
- Report the build result and any remaining manual verification limitations.

## Recommended Execution Order

Implement one phase at a time:

1. Baseline and safety.
2. Backend route constants.
3. Shared Unity-Hub HTTP helper.
4. Captcha migration.
5. Queue retrieval migration.
6. Finalization migration.
7. Gatepass document migration.
8. Niner document migration.
9. Document response and delivery migration.
10. Record and image compatibility review.
11. Obsolete-contract cleanup.
12. Configuration and deployment review.
13. Full manual verification.
14. Final review.

The highest-risk work is document generation because both the request discriminator and response structure changed substantially. Complete and validate the lower-risk route and response migrations first.
