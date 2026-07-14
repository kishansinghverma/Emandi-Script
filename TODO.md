# Refactor TODO

## 1. Stabilize Current Behavior
- [ ] Fix the `printLastNiner` / `printLastReciepts` mismatch in [src/public/modules/pages/add_gatepass.js](/Users/kishansinghverma/Extras/Repos/Emandi-Script/src/public/modules/pages/add_gatepass.js:1).
- [ ] Remove unsupported-page hard failures in [src/public/modules/services/initialization.js](/Users/kishansinghverma/Extras/Repos/Emandi-Script/src/public/modules/services/initialization.js:46) and fail quietly on routes the script does not own.
- [ ] Replace blocking `async: false` AJAX in [src/public/modules/pages/ninersubmit.js](/Users/kishansinghverma/Extras/Repos/Emandi-Script/src/public/modules/pages/ninersubmit.js:74) with promise-based submission.
- [ ] Make print and finalize flows stop on failed network requests instead of alerting and continuing.

## 2. Isolate Host-Site Coupling
- [ ] Move DOM selectors, route names, and hard-coded field mappings into page-specific config modules.
- [ ] Create a selector layer for each Emandi page (`login`, `add_six_r`, `NineR`, `NineRSubmit`, `add_gatepass`) so markup changes are localized.
- [ ] Centralize route detection and supported-route handling instead of scattering route assumptions across modules.
- [ ] Add explicit guards for required DOM elements before attempting autofill or submission.

## 3. Normalize Workflow State
- [ ] Replace the implicit `localStorage` record handoff with a small workflow-state service.
- [ ] Define the record shape used across 6R -> payment -> 9R -> gatepass so pages do not rely on ad hoc nested reads.
- [ ] Separate “queued remote record” state from “in-progress local workflow” state.
- [ ] Add expiry/versioning for stored records to avoid stale data surviving site changes.

## 4. Clean Up Network Boundaries
- [ ] Split Emandi-site requests from external backend requests into separate service modules.
- [ ] Wrap `fetch` calls in a single HTTP helper with consistent error handling, status validation, and response parsing.
- [ ] Remove duplicated request assembly for receipt lookup, PDF generation, and record fetching.
- [ ] Move `baseUrl` and environment-specific endpoints out of [src/public/modules/constants.js](/Users/kishansinghverma/Extras/Repos/Emandi-Script/src/public/modules/constants.js:16) into build/runtime config.

## 5. Refactor Page Controllers
- [ ] Convert each page module into the same shape: `initialize`, `bindEvents`, `loadState`, `syncForm`, `submit`, `handleResponse`.
- [ ] Move captcha wiring into a reusable helper instead of repeating it in login, 6R, 9R submit, and gatepass flows.
- [ ] Move record autofill into declarative field maps rather than manual `updateForm()` methods full of literals.
- [ ] Remove direct reliance on global site functions where possible, and wrap unavoidable globals behind adapter methods.

## 6. Make Printing Maintainable
- [ ] Extract shared receipt-fetching logic in [src/public/modules/services/print.js](/Users/kishansinghverma/Extras/Repos/Emandi-Script/src/public/modules/services/print.js:4).
- [ ] Replace fragile DOM scraping for receipt tables and party labels with document parsers that validate required nodes.
- [ ] Separate “fetch receipt HTML”, “transform to PDF payload”, and “deliver output” into independent steps.
- [ ] Make WhatsApp/send/print/download behavior explicit in function names and request payloads.

## 7. Reduce Magic Constants
- [ ] Move crop codes, grade values, paid-type defaults, mobile fallback values, and date-window rules into named config.
- [ ] Document why each fixed value exists and which workflow depends on it.
- [ ] Remove dead constants such as unused URLs or IDs unless they are part of planned work.

## 8. Improve UI Injection Hygiene
- [ ] Prevent duplicate modal/notification/loader injection when the script executes more than once on the same page.
- [ ] Separate modal markup from behavior so modal templates stay static and controllers stay procedural.
- [ ] Standardize alert, loader, and modal lifecycle handling.
- [ ] Remove draggable/modal behavior from the bootstrap path if it is not essential.

## 9. Rework Build and Delivery
- [ ] Stop treating committed `dist/` output as the source of truth.
- [ ] Add a build step that emits the userscript loader and bundled assets from one command.
- [ ] Replace manual `cp`-based asset copying in [package.json](/Users/kishansinghverma/Extras/Repos/Emandi-Script/package.json:9) with bundler-managed static assets.
- [ ] Make local/dev/prod asset URLs configurable without editing source files.

## 10. Add Basic Verification
- [ ] Add smoke tests for route detection, record-state handling, and response validation.
- [ ] Add fixture-based tests for receipt HTML parsing and PDF payload generation.
- [ ] Add a lightweight browser harness or documented manual verification checklist for each workflow stage.
- [ ] Capture one known-good response sample per critical Emandi AJAX endpoint for regression checks.

## Suggested Order
1. Stabilize live bugs and stop unsafe continuation paths.
2. Extract shared HTTP, captcha, and workflow-state services.
3. Refactor page controllers around a common lifecycle.
4. Isolate selectors and hard-coded field mappings.
5. Rework printing and build/delivery after behavior is under control.


1. printLastNiner() reports “Sending Niner...” even when fetch failed, then still calls printNiner(undefined, ...).
     At src/public/modules/services/print.js:44, the fetch path does .catch(alertError), which converts the rejection into a resolved undefined. Execution then continues to src/public/
     modules/services/print.js:48. That gives you a second misleading error path and hides the real control-flow failure.

  2. printNiner() and printGatepass() swallow failures instead of rejecting.
     Both catch blocks at src/public/modules/services/print.js:97 and src/public/modules/services/print.js:128 only alert and return. Callers cannot tell the operation failed, so upstream
     flows can continue as if printing succeeded.

  3. Receipt parsing is extremely DOM-fragile.
     The selectors at src/public/modules/services/print.js:79, src/public/modules/services/print.js:86, src/public/modules/services/print.js:87, src/public/modules/services/print.js:104,
     and src/public/modules/services/print.js:111 assume exact table positions and row structure. Any markup change in the receipt pages will break PDF generation.

  4. Several required nodes are dereferenced without validation.
     Examples: .html().trim() at src/public/modules/services/print.js:86 and src/public/modules/services/print.js:111, #qrcode img.src at src/public/modules/services/print.js:88 and src/
     public/modules/services/print.js:119, and indexed table access at src/public/modules/services/print.js:114. Missing nodes become runtime exceptions.

  5. handlePrintResponse() ignores unexpected success/failure shapes.
     At src/public/modules/services/print.js:23, only 200, 201, and 202 are handled. Other successful statuses produce no user feedback, and there is no default branch for an unsupported
     but non-error response contract.

  6. downloadFile() leaks object URLs.
     At src/public/modules/services/print.js:38, it creates a blob URL and never revokes it. That is minor for occasional use, but it is still a resource leak.

  7. There is dead/incomplete code.
     sendLastGatepassNumber() at src/public/modules/services/print.js:52 fetches a number, does nothing with it, and never hides the loader. That is either abandoned work or a latent bug
     if called later.

  8. Naming and spelling are inconsistent enough to raise maintenance risk.
     fetchRecieptContent() and printLastReciepts() at src/public/modules/services/print.js:35 and src/public/modules/services/print.js:57 are misspelled, and the file mixes “print”,
     “send”, “download”, and “receipt” responsibilities in one module. That makes the API harder to reason about.

  9. Date scoping for “last record” is hard-coded and undocumented.
     fetchLastRecords() only looks back 5 days at src/public/modules/services/print.js:4. If the last relevant record is older, the print flow silently becomes “No Record Found...” with
     no explanation of why the search window exists.
