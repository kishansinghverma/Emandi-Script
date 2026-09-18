# Repository Guidelines

Last reviewed: 2026-09-18 — aligned notification toast tokens, text colors, typography, sizing, max width, and timer handling.

## Project Structure & Module Organization

`src/app.js` is the small Express development server, serving `src/public` at
`/public`. The browser/userscript bundle starts at `src/public/index.js` and
is organized by responsibility: `modules/pages/` contains page-specific
automation, `modules/services/` contains shared browser, receipt, print, and
captcha logic, and `modules/constants.js` holds shared values. Browser assets
live in `src/public/assets/`. `other/` contains userscript loader and JSON
configuration files. `dist/` is the committed production output; do not edit
bundled files directly.

## Build, Test, and Development Commands

- `npm install` installs the locked Node dependencies.
- `npm start` runs the local Express server (default port `3001`) for serving
  source assets during userscript development.
- `npm run build` bundles `src/public/index.js` with Webpack and copies the
  stylesheet and script loader into `dist/`.

There is no automated test suite or lint command at present. Validate changes
by running the build and exercising the affected eMandi workflow with the
userscript pointed at the local server.

## Coding Style & Naming Conventions

Use ES modules and four-space indentation, matching the existing source.
Prefer `camelCase` for functions and variables, `PascalCase` for page/service
classes, and lowercase filenames such as `add_gatepass.js` and `receipt.js`.
Keep page-specific DOM work in its page module; extract reusable requests or
utilities to `modules/services/`. Preserve semicolons and existing import
style. Avoid hand-editing generated `dist/index.js`; rebuild it instead.

For page controllers, prefer class field arrow methods and jQuery-first DOM
manipulation. Use concise methods such as `updateColumns`, `injectActions`,
and `observeTable`, with direct jQuery chains using `.append()`, `.appendTo()`,
`.click()`, and `.addClass()`. Prefer explicit element creation and clear,
small methods over configuration-heavy abstractions or excessive defensive
wrappers. Match the surrounding module's semantics when extending existing
page behavior.

The notification toast keeps its centered placement on smaller screens and
top-right placement from 768px upward. Preserve that responsive behavior when
changing its visual design or message handling. Keep its auto-dismiss timer
centralized so a previous notification cannot close a newer one, and clear the
timer when the toast is dismissed manually.

## Testing Guidelines

For behavior changes, verify both the normal form flow and error/loading
states where relevant (especially captcha, printing, and submission code).
Run `npm run build` before submitting so generated output and copied assets
are current. If adding tests, place them beside the relevant module or in a
new `test/` directory and add an npm script to document execution.

## Commit & Pull Request Guidelines

Recent history uses short imperative subjects, often Conventional Commit
prefixes: `feat: add captcha resolution via backend API`, `fix: retry limit`,
and `refactor: simplify onComplete`. Use that pattern and keep each commit
focused. Pull requests should explain the affected user flow, list validation
performed, link related issues when available, and include screenshots or a
short recording for UI/style changes. Do not commit credentials, session data,
or production-only configuration.
