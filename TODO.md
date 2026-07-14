# Refactor TODO

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