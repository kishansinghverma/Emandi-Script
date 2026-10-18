# Refactor TODO

## 1. Clean Up Network Boundaries
- [ ] Split Emandi-site requests from external backend requests into separate service modules.
- [ ] Wrap `fetch` calls in a single HTTP helper with consistent error handling, status validation, and response parsing (harden non-`.content` JSON parsing in `backend.js`).
- [ ] Move `baseUrl` and environment-specific endpoints out of [src/public/modules/constants.js](/Users/kishansinghverma/Extras/Repos/Emandi-Script/src/public/modules/constants.js:16) into build/runtime config.

## 5. Refactor Page Controllers
- [ ] Convert each page module into the same shape: `initialize`, `bindEvents`, `loadState`, `syncForm`, `submit`, `handleResponse`.
- [ ] Move captcha wiring into a reusable helper instead of repeating it in login, 6R, 9R submit, and gatepass flows, and ensure image load is awaited before resolution.
- [ ] Move record autofill into declarative field maps rather than manual `updateForm()` methods full of literals.
- [ ] Replace deprecated `async: false` in `ninersubmit.js` with asynchronous promise handling.
- [ ] Remove direct reliance on global site functions where possible, and wrap unavoidable globals behind adapter methods.

## 6. Make Printing Maintainable
- [ ] Extract shared receipt-fetching logic in [src/public/modules/services/print.js](/Users/kishansinghverma/Extras/Repos/Emandi-Script/src/public/modules/services/print.js:4).

## 7. Reduce Magic Constants
- [ ] Move crop codes (`58`), grade values (`9`), paid-type defaults, mobile numbers (`7037433280`, `9675679250`), and date-window rules into named config.
- [ ] Document why each fixed value exists and which workflow depends on it.
- [ ] Remove dead constants such as unused URLs or IDs unless they are part of planned work.

## 8. Improve UI Injection Hygiene
- [ ] Prevent duplicate modal/notification/loader injection when the script executes more than once on the same page.
- [ ] Add session pre-warming on `/Traders/Dashboard` and handle `/Traders/Dashboard` without throwing route injection error.
- [ ] Remove draggable/modal behavior from the bootstrap path if it is not essential.

## 9. Rework Build and Delivery
- [ ] Stop treating committed `dist/` output as the source of truth.
- [ ] Add a build step that emits the userscript loader and bundled assets from one command.
- [ ] Replace manual `cp`-based asset copying in [package.json](/Users/kishansinghverma/Extras/Repos/Emandi-Script/package.json:9) with bundler-managed static assets.
- [ ] Make local/dev/prod asset URLs configurable without editing source files.

## 10. Add Basic Verification

- [ ] Document manual verification for route detection, record handling, and response validation.
- [ ] Manually verify receipt rendering and PDF generation.
- [ ] Document normal, loading, and error states to check for each workflow stage.

## Suggested Order
1. Stabilize live bugs and stop unsafe continuation paths.
2. Extract shared HTTP, captcha, and workflow-state services.
3. Refactor page controllers around a common lifecycle.
4. Isolate selectors and hard-coded field mappings.
5. Rework printing and build/delivery after behavior is under control.
